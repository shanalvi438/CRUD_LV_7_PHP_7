<?php

namespace App\Services;

use App\Helpers\GeneralHelper;
use App\Forms\IForm;
use App\Models\Company;



/**
 * Class CategoryService
 * @package App\Services
 */
class CompanyService extends BaseService
{

    /**
     * CategoryService constructor.
     */
    public function __construct()
    {
        $this->model = new Company();

        parent::__construct();
    }

    public function store( IForm $form ) {
        $form->validate();
        if ( $form->logo ) {
            $form->logo = GeneralHelper::uploadImageManual( $form->logo, 'image/company' );
        }
        $company = new Company();
        $form->loadToModel( $company );

        $company->save();

        return $company;
    }

    public function update( IForm $form,$id ) {
        $form->validate();
        if ( $form->logo ) {
            $form->logo = GeneralHelper::uploadImageManual( $form->logo, 'image/company' );
        }
        $company = Company::find($id);
        $form->loadToModel( $company );

        $company->update();

        return $company;
    }



}
