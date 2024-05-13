<?php

namespace App\Services;

use App\Helpers\GeneralHelper;
use App\Forms\IForm;
use App\Models\Company;
use App\Models\Employee;



/**
 * Class CategoryService
 * @package App\Services
 */
class EmployeeService extends BaseService
{

    /**
     * CategoryService constructor.
     */
    public function __construct()
    {
        $this->model = new Employee();

        parent::__construct();
    }

    public static function allWithIdAndName()
    {
        return Company::all()->pluck('name', 'id')->all();
    }


}
