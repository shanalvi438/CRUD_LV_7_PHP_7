<?php

namespace App\Http\Controllers\Web;


use App\Forms\Users\AddUserForm;
use App\Forms\Users\UpdateUserStatusForm;
use App\Jobs\SendProfileCheckedMailJob;
use App\Services\Users\UserService;
use App\Services\ProgressService;
use App\Services\QuestionService;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Session;
use Illuminate\View\View;
use Illuminate\Validation\ValidationException;
use App\Exports\UsersExport;
use Maatwebsite\Excel\Facades\Excel;
use Validator;

/**
 * Class UserController
 * @package App\Http\Controllers\Web
 */
class UserController extends Controller
{

    /**
     * @var UserService $userService
     */
    private $userService;

    /**
     * CompanyController constructor.
     */
    public function __construct()
    {
        $this->middleware('auth');
        $this->userService = new UserService();

    }


    /**
     * @return Application|Factory|View
     */
    public function indexAdmin(Request $request)
    {
        $params = $request->query->all();
        $items = $this->userService->searchAdmin($request->filter, $params->pageSize ?? 20);
        return view('admin.index')
            ->with(
                [
                    'items' => $items,
                    'params' => $params,
                ]
            );
    }





    /**
     * @param $id
     *
     * @return Application|Factory|View
     */
    public function showAdmin($id)
    {
        $item = $this->userService->findById($id);

        return view('admin.show')
            ->with([
                'item' => $item,
                'reviews' => $item->ratings,
            ]);
    }




   

}
