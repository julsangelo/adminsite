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

        $image = $request->file('productCategoryImage');
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
            $productCategory = ProductCategory::findOrFail($productCategoryID);

            if ($productCategory->productCategoryImage) {
                $imagePath = $product->productCategoryImage;
                Storage::disk('r2')->delete($imagePath);
            }

            $deleted = $productCategory->delete();
        } else {
            return response()->json(['message' => 'A product is currently using this category.', 'status' => 'error']);
        }

        if ($deleted) {
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
            if ($editProduct->productCategoryImage && Storage::disk('r2')->exists($editProduct->productCategoryImage)) {
                Storage::disk('r2')->delete($editProduct->productCategoryImage);
            }
            $image = $request->file('productCategoryImage');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('product-categories', $imageName, 'r2');
            $editProduct->productCategoryImage = $imagePath;
        }
    
        $editProduct->update($request->only(['productCategoryName']));
    
        return response()->json(['message' => 'Product updated successfully.', 'status' => 'success']);
    }
}
