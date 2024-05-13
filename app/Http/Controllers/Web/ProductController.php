<?php

namespace App\Http\Controllers\Web;
use App\Forms\Product\CreateProductForm;
use App\Forms\Product\UpdateProductForm;
use App\Http\Controllers\Controller;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Session;

class ProductController extends Controller
{
        /**
     * @var string
     */
    private $backRoute = '/products';

    /** @var ProductService */
    private $service;
    
    public function __construct()
    {
        $this->service = new ProductService();
    }


    public function index()
    {
        return view('product.index')->with([
            'items' => $this->service->getAll(20)
        ]);

    }


    /**
     * @return Application|Factory|View
     */
    public function create()
    {
        return view('product.create');
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $form = new CreateProductForm();
        $form->loadFromArray($request->all());
        $item = $this->service->store($form);
        $msg = 'Product create successfully!';
        Session::flash('success', $msg);

        return response()->json(
            [
                'type' => 'success',
                'msg' => $msg,
                'data' => $item
            ]
        );
    }

    /**
     * @param $id
     * @return Application|Factory|View
     */
    public function show($id)
    {
        return view('product.show')
            ->with([
                'item' => $this->service->findById($id)
            ]);
    }

    /**
     * @param $id
     * @return Application|Factory|View
     */
    public function edit($id)
    {
        return view('product.edit')
            ->with([
                'item' => $this->service->findById($id)
            ]);
    }

    /**
     * @param Request $request
     * @param $id
     * @return JsonResponse
     */
    public function update(Request $request, $id)
    {
        $form = new UpdateProductForm();
        $form->loadFromArray($request->all());
        $items = $this->service->update($form, $id);

        $msg = 'Product updated successfully!';
        Session::flash('success', $msg);

        return response()->json(
            [
                'type' => 'success',
                'msg' => $msg,
                'data' => $items
            ]
        );
    }

    /**
     * @param $id
     * @return Application|RedirectResponse|Redirector
     */

    public function destroy($id)
    {
        $this->service->remove($id);

        // Set flash
        Session::flash('success', 'Successfully Removed!');

        // Redirect to users
        return redirect($this->backRoute);
    }
}
