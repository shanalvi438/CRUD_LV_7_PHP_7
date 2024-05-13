<?php

namespace App\Services;

use App\Forms\IForm;
use App\Helpers\GeneralHelper;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

/**
 * Class BaseService
 * @package App\Services
 */
abstract class BaseService implements IService {

    /** @var $model */
    public $model;

    /** @var $relations */
    public $relations;

    /**
     * BaseService constructor.
     */
    public function __construct() {
        //
    }


    /**
     * @param  $data
     *
     * @return mixed
     */
    public function find( $data ) {
        if ( $this->relations ) {
            return $this->model->where( $data )->with( $this->relations )->get();
        }

        return $this->model->where( $data )->get();
    }

    /**
     * @param  $data
     *
     * @return mixed
     */
    public function findFirst( $data ) {
        return $this->model->where( $data )->first();
    }

    /**
     * @param  $data
     *
     * @return mixed
     */
    public function get( $data ) {
        if ( $this->relations ) {
            return $this->model->where( $data )->with( $this->relations )->orderBy( 'created_at', 'DESC' )->get();
        }

        return $this->model->where( $data )->orderBy( 'created_at', 'DESC' )->get();
    }

    /**
     * @param  $id
     *
     * @return mixed|void
     */
    public function remove( $id ) {
        $item = $this->model->find( $id );
        if ( $item ) {
            return $item->delete();
        }

        return false;
    }

    /**
     * @param IForm $form
     *
     * @return mixed
     * @throws ValidationException
     */
    public function store( IForm $form ) {
        // Validate Form
        $form->validate();

        $model = $this->model;

        // Assign values to model attributes
        $form->loadToModel( $model );

        $model->save();

        return $model;
    }

    /**
     * @param IForm $form
     * @param  $id
     *
     * @return mixed
     * @throws ValidationException
     */
    public function update( IForm $form, $id ) {
        // Validate Form
        $form->validate();

        $model = $this->findById( $id );

        // Assign values to model attributes
        $form->loadToModel( $model );

        $model->save();

        return $model;
    }


    /**
     * @param null $paginate
     *
     * @return mixed
     */
    public function getAll( $paginate = null ) {
        if ( $paginate ) {
            if ( $this->relations ) {
                return $this->model->with( $this->relations )->orderBy( 'id', 'DESC' )->paginate( $paginate );
            }

            return $this->model->orderBy( 'id', 'DESC' )->paginate( $paginate );
        }

        if ( $this->relations ) {
            return $this->model->with( $this->relations )->orderBy( 'id', 'DESC' )->get();
        }

        return $this->model->orderBy( 'id', 'DESC' )->get();
    }

    /**
     * @param null $paginate
     *
     * @return mixed
     */
    public function lastWeekAll( $paginate = null ) {
        if ( $paginate ) {
            return $this->model->whereDate( 'created_at', '<=', date( 'Y-m-d H:i:s', strtotime( '-7 days' ) ) )->paginate( $paginate );
        }

        return $this->model->whereDate( 'created_at', '<=', date( 'Y-m-d H:i:s', strtotime( '-7 days' ) ) )->get();
    }

    /**
     * @param null $paginate
     *
     * @return mixed
     */
    public function lastMonthAll( $paginate = null ) {
        if ( $paginate ) {
            return $this->model->whereDate( 'created_at', '<=', now()->startOfMonth() )->paginate( $paginate );
        }

        return $this->model->whereDate( 'created_at', '<=', now()->startOfMonth() )->get();
    }

    /**
     * @param null $paginate
     *
     * @return mixed
     */
    public function toDaysAll( $paginate = null ) {
        if ( $paginate ) {
            return $this->model->whereDate( 'created_at', Carbon::today() )->paginate( $paginate );
        }

        return $this->model->whereDate( 'created_at', Carbon::today() )->get();
    }

    /**
     * @param  $id
     *
     * @return mixed
     */
    public function findById( $id ) {
        if ( $this->relations ) {
            return $this->model->with( $this->relations )->find( $id );
        }

        return $this->model->find( $id );
    }

}
