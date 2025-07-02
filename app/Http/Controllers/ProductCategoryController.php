<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;

class ProductCategoryController extends Controller
{
    public function addProductCategory(Request $request) {
        $request->validate([
            'productCategoryName' => 'required|string|unique:productCategory,productCategoryName',
            'productCategoryImage' => 'required|image|max:2048',
        ]);

        $image = $request->file('productImage');
        $imagePath = $image->storeAs(
            'product-categories',
            time() . '_' . $image->getClientOriginalName(),
            'r2'
        );

        $addInventory = ProductCategory::create([
            'productCategoryName' => $request->productCategoryName,
            'productCategoryImage' => $imagePath,
        ]);

        if ($addInventory) {
            return response()->json(['message' => 'Product category added successfully.', 'status' => 'success']);
        } else {
            return response()->json(['message' => 'Error adding the product category.', 'status' => 'error']);
        }
    }

    public function deleteProductCategory(Request $request) 
    {
        $productCategoryID = $request->input('productCategoryID');
        $categoryExists = Product::where("productCategory", $productCategoryID)->exists();

        if (!$categoryExists) {
            $deleteCategory = ProductCategory::findOrFail($productCategoryID)->delete();
        } else {
            return response()->json(['message' => 'A product is currently using this category.', 'status' => 'error']);
        }

        if ($deleteCategory) {
            return response()->json(['message' => 'Product category deleted successfully.', 'status' => 'success']);
        } else {
            return response()->json(['message' => 'Error deleting the product category.', 'status' => 'error']);
        }
    }

    public function editProductCategory(Request $request) {
        $editProduct = ProductCategory::findOrFail($request->productCategoryID);
    
        $request->validate([
            'productCategoryName' => 'required|string|unique:productCategory,productCategoryName,' . $editProduct->productCategoryID . ',productCategoryID',
            'productCategoryImage' => 'nullable|image|max:2048',
        ]);
    
        if ($request->hasFile('productCategoryImage')) {
            $imageName = $request->file('productCategoryImage')->getClientOriginalName();
            $request->file('productCategoryImage')->move(public_path('hydrogen/images/product-categories'), $imageName);
            $editProduct->productCategoryImage = 'images/product-categories/' . $imageName;
        }
    
        $editProduct->update($request->only(['productCategoryName']));
    
        return response()->json(['message' => 'Product updated successfully.', 'status' => 'success']);
    }
}
