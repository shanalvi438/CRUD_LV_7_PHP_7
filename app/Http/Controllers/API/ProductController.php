<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Forms\Product\CreateProductForm;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{/**
 * @var ProductService $productService
 */
    private $productService;
    public function __construct()
    {
        $this->productService = new ProductService();
    }


    public function getProduct()
    {
        $item = $this->productService->getAll();
        if ($item) {

            return $this->successResponse(trans('All Products'), $item);

        }
        return $this->parametersInvalidResponse();
    }

    public function store(Request $request)
    {
        $validated = validator::make($request->all(), [

            'name' => 'required',
            'description' => 'required',
            'price' => 'required|numeric|min:0',

        ]);

        if ($validated->fails()) {

            return $this->parametersInvalidResponse(null, $validated->errors()->all());
        }

        $form = new CreateProductForm();
        $form->loadFromArray($request->all());
        $item = $this->productService->store($form);

        if ($item) {
            return $this->successResponse(trans('Product Create Successfully'), $item);
        }
        return $this->parametersInvalidResponse();

    }
}
