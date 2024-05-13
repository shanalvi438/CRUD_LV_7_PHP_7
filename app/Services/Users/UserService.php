<?php

namespace App\Services\Users;

use App\Helpers\GeneralHelper;
use App\Jobs\SendProfileCheckedMailJob;
use App\Models\BusinessMusicCategory;
use App\Models\CompanyImage;
use App\Models\HobbyUser;
use App\Models\QuestionUser;
use App\Models\TypeOfWorkout;
use App\Models\User;
use App\Services\BaseService;
use App\Forms\IForm;
use App\Services\EmailNotificationService;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Collection;
use App;
use Carbon\Carbon;
use Auth;
use DB;
use Hash;
use EloquentBuilder;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use willvincent\Rateable\Rating;

/**
 * Class UserService
 * @package App\Services\Users
 */
class UserService extends BaseService implements IUserServiceInterface
{


    /**
     * UserService constructor.
     */
    public function __construct()
    {
        /** @var User */
        $this->model = new User();

        parent::__construct();
    }

    /** @var $model */
    public $model;


    // /**
    //  * @param  $data
    //  *
    //  * @return mixed
    //  */
    // public function get( $data ) {
    //     if ( $this->relations ) {
    //         return $this->model->where( $data )->with( $this->relations )->orderBy( 'created_at', 'DESC' )->get();
    //     }

    //     return $this->model->where( $data )->orderBy( 'created_at', 'DESC' )->get();
    // }


    /**
     * @param $email
     *
     * @return mixed
     */
    public function findByEmail($email)
    {
        return $this->model->where('email', $email)->first();
    }

    /**
     * @param $email
     *
     * @return mixed
     */
    public function findByIds($arrayIds)
    {
        return $this->model->whereIn('id', $arrayIds)->get();
    }

    /**
     * @param $email
     *
     * @return mixed
     */
    public function findBySocialToken($token)
    {
        return $this->model->where('social_token', $token)->first();
    }

    /**
     * @param $pin
     *
     * @return mixed
     */
    public function findByPin($pin)
    {
        return $this->model->where('pin', $pin)->first();
    }

    /**
     *
     * @return mixed
     */
    public function findAllByFCM()
    {
        return $this->model->whereNotNull('device_token')->get();
    }

    /**
     * @param $otp
     *
     * @return mixed
     */
    public function findByOTP($otp)
    {
        return $this->model->where('signup_otp', $otp)->first();
    }

    /**
     * @param  $id
     *
     * @return mixed|void
     */
    public function remove($id)
    {
        $user = $this->findById($id);

        return $user->delete();
    }

    /**
     * @param  $id
     *
     * @return mixed|void
     */
    public function approve($id)
    {
        $user = $this->findById($id);
        $user->is_approved = true;

        $res = $user->save();

        // /** @var EmailNotificationService $mailService */
        // $mailService = App::make(EmailNotificationService::class);
        // $mailService->signupEmail($user);

        return $res;
    }

    /**
     * @param $form
     * @param $userId
     *
     * @return mixed
     */
    public function updateAdmin($form, $userId)
    {
        $form->validate();
        $user = $this->findById($userId);
        $form->old_image = $user->image;
        if ($form->image) {
            $form->image = GeneralHelper::uploadImageManual($form->image, 'images/user', (!$form->old_image) ?: true, $form->old_image ?? null);
        } else {
            $form->image = $form->old_image;
        }
        $form->loadToModel($user);
        $user->save();

        return $user;
    }

    /**
     * @param $form
     * @param $userId
     *
     * @return mixed
     */
    public function updateDetails($form, $userId)
    {
        $form->validate();
        $user = $this->findById($userId);
        $form->old_image = $user->image;
        if ($form->image) {
            $form->image = GeneralHelper::uploadImageManual($form->image, 'images/user', (!$form->old_image) ?: true, $form->old_image ?? null);
        } else {
            $form->image = $form->old_image;
        }
        $form->loadToModel($user);

        $user->save();

        return $user;
    }

    /**
     * @return User[]|Collection
     */
    public function getAllVerified()
    {
        return $this->model->where('is_verified', 1)->get();
    }

    /**
     * @param $form
     * @param $userId
     *
     * @return mixed
     */
    public function updateStatus($form, $userId)
    {
        $form->validate();
        $user = $this->findById($userId);
        $form->loadToModel($user);
        $user->status = $form->status;
        $user->save();

        return $user;
    }

    /**
     * @param $id
     *
     * @throws \Exception
     */
    public function activate($id)
    {
        $user = $this->model->withTrashed()->find($id);
        DB::beginTransaction();
        $user->restore();
        $user->status = 1;
        $user->save();
        DB::commit();
    }


    /**
     * Get all super admins
     *
     * @return mixed
     */
    public function getSuperAdmins()
    {
        return $this->model
            ->where('user_type', IUserType::ADMIN)
            ->get();
    }

    /**
     * Get super admin emails
     *
     * @return mixed
     */
    public function getSuperAdminEmails()
    {
        return $this->getSuperAdmins()->pluck('email')->toArray();
    }

    /**
     * @param $userType
     *
     * @return mixed
     */
    public function getByType($userType)
    {
        return $this->model
            ->where('user_type', $userType)
            ->get();
    }

    /**
     * @param $email
     *
     * @return mixed
     */
    public function fetchByEmail($email)
    {
        return $this->model->where('email', $email)->first();
    }

    /**
     * @param $email
     * @param $password
     * @param $token
     *
     * @return Authenticatable|bool
     */
    public function login($email, $password, $token)
    {
        if (
            Auth::attempt(
                [
                    'email' => $email,
                    'password' => $password
                ]
            )
        ) {
            /** @var User $user */
            $user = Auth::user();
            if ($user) {
                $user->device_token = $token;
                $user->save();

                if ($user->is_verified && $user->status) {
                    return $user;
                }

                if (!$user->status) {

                    return 'is_blocked';
                }

                return 'is_not_verified';
            }
        }

        return 'wrong_credentials';
    }

    /**
     * @param $email
     *
     * @return bool
     */
    public function forgetPasswordRequest($email)
    {
        $user = $this->fetchByEmail($email);
        if ($user) {
            $user->pin = $this->generateRandom(10);
            $user->save();
            // /** @var EmailNotificationService $mailService */
            // $mailService = App::make(EmailNotificationService::class);
            // $mailService->forgetPasswordEmail($user);

            return $user;
        }

        return false;
    }

    /**
     * @param $pin
     *
     * @return bool
     */
    public function pinMatch($pin)
    {
        $user = $this->findByPin($pin);
        if ($user) {
            if ($user['pin'] == $pin) {
                $user->pin = null;
                $user->save();

                return $user;
            }

            return false;
        }

        return false;
    }

    /**
     * @param $otp
     *
     * @return false|mixed
     */
    public function otpMatch($otp)
    {
        $user = $this->findByOTP($otp);
        if ($user) {
            if ($user['signup_otp'] == $otp) {
                $user->is_verified = true;
                $user->signup_otp = null;
                $user->save();

                return $user;
            }

            return false;
        }

        return false;
    }

    /**
     * @param $userId
     * @param $password
     *
     * @return bool
     */
    public function changePassword($userId, $password)
    {
        $user = $this->findById($userId);
        if ($user) {
            $user->password = Hash::make($password);
            $user->is_verified = true;
            $user->save();

            return $user;
        }

        return false;
    }

    /**
     * @param IForm $form
     * @return User|null
     * @throws ValidationException
     */
    public function passwordChange(IForm $form)
    {
        // Validate form rules
        $form->validate();

        // Current user
        $user = Auth::user();

        // Save password
        $user->password = Hash::make($form->password);
        $user->save();
//        /* @var EmailNotificationService $mailService /
//        $mailService = app()->make(EmailNotificationService::class);
//        $mailService->changeDetails($user, $user->first_name. ' has update there password.');

        return $user;
    }

    /**
     * @param $email
     *
     * @return bool|Authenticatable|null
     */
    public function fingerPrint($email)
    {

        $user = $this->fetchByEmail($email);

        if (Auth::loginUsingId($user->id)) {
            return Auth::user();
        }

        return false;
    }

    /**
     * @param $userId
     *
     * @return mixed
     */
    public function fetchToken($userId)
    {
        $user = $this->findById($userId);

        return $user->createToken('eh')->accessToken;
    }

    /**
     * @param IForm $form
     *
     * @return bool|mixed
     */
    public function register(IForm $form)
    {
        $user = new User();
        $form->loadToModel($user);
        $user->signup_otp = $this->generateRandom(5);
        $user->is_verified = false;
        $user->created_by_admin = 0;
        if (isset($form->image)) {
            $user->image = GeneralHelper::uploadImageManual($form->image, 'images/users');
        }
        $user->password = Hash::make($form->password);
        $user->user_type = IUserType::USER;
        $user->is_approved = false;

        $user->save();
//        /** @var EmailNotificationService $mailService */
//        $mailService = App::make( EmailNotificationService::class );
//        $mailService->awaitingApprovalMail( $user );
        return $user;
    }

    /**
     * @param $token
     * @param $data
     *
     * @return false|mixed
     */
    public function registerPassword($token, $data)
    {
        $user = $this->findByOTP($token);
        if ($user) {
            if ($user['signup_otp'] == $token) {
                $user->password = Hash::make($data['password']);
                $user->is_verified = true;
                $user->signup_otp = null;
                $user->save();

                return $user;


            }

            return false;
        }

        return false;
    }


    /**
     * @param $length
     *
     * @return false|string
     */
    private function generateRandom($length)
    {
        $str = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        return substr(str_shuffle($str), 0, $length);
    }

    /**
     * @param $user_id
     *
     * @return mixed
     */
    public function generateNewOtp($user_id)
    {
        $user = $this->findById($user_id);
        $user->signup_otp = $this->generateRandom(5);
        $user->save();

//        /** @var EmailNotificationService $mailService */
//        $mailService = App::make( EmailNotificationService::class );
//        $mailService->newOtp( $user );

        return $user;
    }

    /**
     * @param $data
     * @param $perpage
     * @return mixed
     */
    public function search($data, $perpage = 20)
    {
        $query = $this->model;

        $query = EloquentBuilder::to($query, $data)->where('user_type', IUserType::USER)->orderBy( 'id', 'DESC' );;

        return $query->paginate($perpage);
    }

    /**
     * @param Request $data
     *
     * @return mixed
     */
    public function searchAdmin($data, $perpage = 20)
    {
        $query = $this->model;

        $query = EloquentBuilder::to($query, $data)->where('user_type', IUserType::ADMIN);

        return $query->paginate($perpage);
    }


    /**
     * @return mixed
     */
    public function searchUser()
    {
        return User::where('user_type', IUserType::USER)->get();
    }


    /**
     * @param IForm $form
     * @return User|mixed
     * @throws ValidationException
     */
    public function store(IForm $form)
    {
        // Validate Form
        $form->validate();

        $model = $this->model;
        $model->signup_otp = $this->generateRandom(5);
        if ($form->image) {
            $form->image = GeneralHelper::uploadImageManual($form->image, 'images/user');
        }
        // Assign values to model attributes
        $form->loadToModel($model);
        if ( isset( $form->question_ids ) ) {
            $question_ids = $form->question_ids;
            unset( $form->question_ids );
        }
        $model->user_type = IUserType::USER;
        $model->created_by_admin = 1;
        $model->is_verified = 1;
        $model->is_approved = false;

        $model->save();
        
         if ( isset( $question_ids ) ) {
            foreach ( $question_ids as $key1 => $question_id ) {
                $item             = new QuestionUser();
                $item->question_id      = $question_id;
                $item->user_id = $model->id;
                $item->save();
            }
        }
//        /** @var EmailNotificationService $mailService */
//        $mailService = App::make(EmailNotificationService::class);
//        $mailService->passwordEmail($model);

        return $model;
    }


    /**
     * @param array $data
     * @param $paginate
     *
     * @return mixed
     */
    public function filter(array $data, $paginate = null)
    {
        return $this->getAll();
    }


///*    /**
//     * @param  $id
//     *
//     * @return mixed
//     */
//    public function findById($id)
//    {
//        $user = $this->model->find($id);
//
//        return $this->model->with($this->relations)->find($id);
//    }*/

    /**
     * @param array $data
     * @param $paginate
     * @return mixed
     */
    public
    function getBasedOnLatLng($lat, $lng, $radius, $paginate = null)
    {
        $query = DB::table('users')->selectRaw("* ,
             (
                6371 *
                acos( cos( radians(?) ) * cos( radians( users.lat ) ) *
                cos( radians( users.lng ) - radians(?) ) + sin( radians(?) ) *
                sin( radians( users.lat ) ) )
             ) AS distance", [$lat, $lng, $lat])
            ->where('id', '<>', auth()->id())
            ->where('total_hide', '<>', 'true')
            ->whereNull('user_type')
            ->having("distance", "<", ($radius))
            ->orderBy("distance", 'asc');

        if ($paginate) {
            return $query->paginate($paginate);
        }

        return $query->get();
    }

    /**
     * @param IForm $form
     * @param $token
     * @return false|mixed
     * @throws ValidationException
     */
    public function userPassword(IForm $form, $token)
    {
        $form->validate();
        /** @var User $user */
        $user = $this->findByOTP($token);
        if ($user) {
            if ($user['signup_otp'] == $token) {
                $user->password = Hash::make($form->password);
                $user->is_verified = true;
                $user->signup_otp = null;
                $user->save();

                return $user;
            }

            return false;
        }

        return false;
    }

    /**
     * @return array
     */
    public static function allWithIdAndName(): array
    {
        return TypeOfWorkout::all()->pluck('name', 'id')->all();
    }

    /**
     * Social Register API
     *
     * @param IForm $form
     *
     * @return bool|mixed
     */
    public function socialRegister(IForm $form)
    {
        $form->validate();
        $user = new User();
        $form->loadToModel($user);
        $user->is_verified = true;
        if (isset($form->user_image)) {
            $user->user_image = GeneralHelper::uploadImage($form->user_image, 'images/user');
        }
        $user->device_token =$form->device_token;
        $user->save();

        return $user;
    }

    /**
     * @param $id
     * @param $deviceToken
     * @return mixed
     */
    public function updateDeviceToken($id, $deviceToken)
    {
        $user = $this->findById($id);
        $user->device_token = $deviceToken;
        $user->save();
        return $user;
    }

    /**
     * @param $id
     * @param $ratingValue
     * @param $userId
     * @param $review
     * @return mixed|null
     */
    public function rate($id, $ratingValue, $userId, $review = null)
    {
        $business = $this->findById($id);
        $rating = new Rating;
        $rating->rating = $ratingValue;
        $rating->user_id = $userId;
        $rating->coach_id = $id;
        if ($review) {
            $rating->review = $review;
        }
        if ($business->ratings()->save($rating)) {
            return $business;
        }

        return null;
    }
    
     /**
     * @param $form
     * @param $userId
     *
     * @return mixed
     */
    public function profileComplete($form, $userId)
    {
        $form->validate();
        $user = $this->findById($userId);
        $form->old_image = $user->image;
        if ($form->image) {
            $form->image = GeneralHelper::uploadImageManual($form->image, 'images/user', (!$form->old_image) ?: true, $form->old_image ?? null);
        } else {
            $form->image = $form->old_image;
        }
        $form->loadToModel($user);

        $user->save();

        return $user;
    }
    
 
    public function assignQuestion($questionIds, $userId)
    {
        foreach ( $questionIds as  $question_id ) {
            $item             = new QuestionUser();
            $item->question_id      = $question_id;
            $item->user_id          = $userId;
            $item->save();
        }

        return true;

    }




}
