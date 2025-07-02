<?php

namespace App\Http\Controllers;

use App\Http\Repositories\Products;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InventoryController extends Controller
{
    protected $products;

    public function __construct(Products $products)
    {
        $this->products = $products;
    }

    public function getProducts(Request $request)
    {
        $branch = $request->input('branch');
        $data = $this->products->getProducts($branch);

        return response()->json($data);
    }

    public function addInventory(Request $request) {
        $request->validate([
            'productCode' => 'required|string|unique:product,productCode',
            'productName' => 'required|string',
            'productStockQuantity' => 'required|integer',
            'productPrice' => 'required|numeric',
            'productCategory' => 'required|numeric',
            'productImage' => 'required|image|max:2048',
            'branchID' => 'required|exists:branch,branchID'
        ]);

        $image = $request->file('productImage');
        $imagePath = $image->storeAs(
            'products',
            time() . '_' . $image->getClientOriginalName(),
            'r2'
        );

        $addInventory = Product::create([
            'productCode' => $request->productCode,
            'productName' => $request->productName,
            'productStockQuantity' => $request->productStockQuantity,
            'productPrice' => $request->productPrice,
            'productCategory' => $request->productCategory,
            'productImage' => $imagePath,
            'branchID' => $request->branchID
        ]);

        if ($addInventory) {
            return response()->json(['message' => 'Product added successfully.', 'status' => 'success']);
        } else {
            return response()->json(['message' => 'Error adding the product.', 'status' => 'error']);
        }
    }

    public function editInventory(Request $request) {
        $editProduct = Product::findOrFail($request->productID);
    
        $request->validate([
            'productCode' => 'required|string|unique:product,productCode,' . $editProduct->productID . ',productID',
            'productName' => 'required|string',
            'productStockQuantity' => 'required|integer',
            'productPrice' => 'required|numeric',
            'productCategory' => 'required|string',
            'productImage' => 'nullable|image|max:2048',
        ]);
    
        if ($request->hasFile('productImage')) {
            $image = $request->file('productImage');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('products', $imageName, 'r2');
            $editProduct->productImage = $imagePath;
        }
    
        $editProduct->update($request->only(['productCode', 'productName', 'productStockQuantity', 'productPrice', 'productCategory']));
    
        return response()->json(['message' => 'Product updated successfully.', 'status' => 'success']);
    }

    public function deleteInventory(Request $request) 
    {
        $productID = $request->input('productID');
        $deleteInventory = Product::findOrFail($productID)->delete();

        if ($deleteInventory) {
            return response()->json(['message' => 'Product deleted successfully.', 'status' => 'success']);
        } else {
            return response()->json(['message' => 'Error deleting the product.', 'status' => 'error']);
        }
    }
}
