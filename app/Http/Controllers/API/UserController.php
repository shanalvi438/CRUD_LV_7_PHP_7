<?php

namespace App\Http\Controllers\API;
use App\Forms\Users\RegisterForm;
use App\Forms\Users\SocialLoginForm;
use App\Forms\Users\UpdateForm;
use App\Models\User;
use App\Services\Users\UserService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;
use Illuminate\Support\Facades\Validator;

/**
 * Class UserController
 * @package App\Http\Controllers\API
 */
class UserController extends Controller
{

    /**
     * @var UserService $userService
     */
    private $userService;



    /**
     * UserController constructor.
     */
    public function __construct()
    {
        $this->userService = new UserService();


    }

    /**
     * Login api
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        if (isset($request['email'], $request['password'], $request['device_token'])) {
            $res = $this->userService->login($request['email'], $request['password'], $request['device_token']);
            if ($res == 'wrong_credentials') {

                return $this->successResponse(trans('Wrong Credentials!'));

            } elseif ($res == 'is_not_verified') {
                $user = $this->userService->fetchByEmail($request['email']);

                $data['user'] = $user;

                return $this->successResponse(trans('Email is not Verified!'), $data);

            } elseif ($res == 'is_blocked') {
                $user = $this->userService->fetchByEmail($request['email']);

                $data['user'] = $user;

                return $this->successResponse(trans('User is Blocked!'), $data);

            } else {
                $user = $res;
                $success['user'] = $user->load('typeofWorkout');
                $success['token'] = $this->userService->fetchToken($user['id']);

                return $this->successResponse(trans('Logged in!'), $success);
            }
        }
        return $this->parametersInvalidResponse();
    }

    /**
     * Forget Password Request api
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function forgetPasswordRequest(Request $request): JsonResponse
    {
        if (isset($request['email'])) {
            $res = $this->userService->forgetPasswordRequest($request['email']);
            if ($res) {
                $data['user'] = $res;
                
                return $this->successResponse(trans('Forget Password Request Sent!'.$res->pin), $data);
            }
            return $this->parametersInvalidResponse();
        }
        return $this->parametersInvalidResponse();
    }

    /**
     * Forget Password Request api
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function forgetPasswordPin(Request $request): JsonResponse
    {
        if ($request['pin']) {
            $res = $this->userService->pinMatch($request['pin']);
            if ($res) {
                $data['user'] = $res;

                return $this->successResponse(trans('PIN Matched'), $data);
            }

            return $this->parametersInvalidResponse(trans('Pin does not Match'));
        }

        return $this->parametersInvalidResponse();
    }

    /**
     * Check Otp
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function checkOtp(Request $request): JsonResponse
    {

        if (isset($request['otp'])) {
            $res = $this->userService->otpMatch($request['otp']);
            if ($res) {

                $user = $res;
                $data['user'] = $user;
                $data['token'] = $this->userService->fetchToken($user['id']);

                return $this->successResponse(trans('OTP Matched!'), $data);
            }

            return $this->parametersInvalidResponse(trans('OTP does not Match'));
        }

        return $this->parametersInvalidResponse();
    }

    /**
     * Generate New Otp
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function generateNewOtp(Request $request): JsonResponse
    {
        if (isset($request['user_id'])) {
            $res = $this->userService->generateNewOtp($request['user_id']);
            if ($res) {
                $user = $res;
                $data['user'] = $user;

                return $this->successResponse(trans('New OTP is created and sent to your email!'.$res->signup_otp), $data);
            }

            return $this->parametersInvalidResponse();
        }

        return $this->parametersInvalidResponse();
    }

    /**
     * Change Password api
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function changePasswordPin(Request $request): JsonResponse
    {
        if (isset($request['user_id'], $request['password'])) {
            $res = $this->userService->changePassword($request['user_id'], $request['password']);
            if ($res) {
                $data['user'] = $res;

                return $this->successResponse(trans('Password Changed!'), $data);
            }

            return $this->parametersInvalidResponse();
        }

        return $this->parametersInvalidResponse();
    }

    /**
     * Change Password api
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function checkEmail(Request $request): JsonResponse
    {
        if (isset($request['email'])) {
            $res = $this->userService->findByEmail($request['email']);
            if ($res) {
                if ($res['is_verified']) {
                    return $this->successResponse(trans('Your email is verified!'), $res);
                }

                return $this->parametersInvalidResponse(trans('Your email not verified!'), $res);
            }
            return $this->parametersInvalidResponse();
        }
        return $this->parametersInvalidResponse();
    }

    /**
     * Register api
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function register(Request $request): JsonResponse
    {

        $validated = Validator::make($request->all(), [

            'email' => 'email|required|unique:users',
            'name' => 'required',
            'device_token' => 'required',
            'password' => 'required|confirmed|min:6',
            'password_confirmation' => 'required',
        ]);

        if ($validated->fails()) {

            return $this->parametersInvalidResponse(null, $validated->errors()->all());
        }

        $form = new RegisterForm();

        $form->loadFromArray($request->all());

        $user = $this->userService->register($form);

        if ($user) {
            $data['user'] = $user;
         
            return $this->successResponse(trans('User registered successfully!'.$user->signup_otp), $data);
        }
        return $this->parametersInvalidResponse();
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function updateDetails(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        if ($user) {

            if ($request->email) {
                $validated = Validator::make($request->all(), [
//                    'email' => 'required|email|unique:users',
                    'hobby_id' => 'required|array',
                ]);

                if ($validated->fails()) {
                    return $this->parametersInvalidResponse(null, $validated->errors()->all());
                }
            }


            $form = new UpdateForm();
            $form->loadFromArray($request->all());
            $user = $this->userService->updateDetails($form, $user->id);
            $data['user'] = $user;

            return $this->successResponse(trans('User details updated!'), $data);

        }

        return $this->unAuthorizedResponse();

    }

    /**
     * Details api
     *
     * @return JsonResponse
     */
    public function details(): JsonResponse
    {
        $user = Auth::user();
        if ($user) {
            $data['user'] = $user->load('typeOfWorkout','mealPlans');

            return $this->successResponse(null, $data);
        }

        return $this->unAuthorizedResponse();
    }



    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->token()->revoke();

        return $this->successResponse(trans('User has successfully logged out!'));
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @throws Exception
     */
    public function signout(Request $request): JsonResponse
    {
        $user = Auth::user();
        if ($user) {
            $user->delete();

            return $this->successResponse(trans('Successfully signed out!'));
        }

        return $this->unAuthorizedResponse();
    }

    /***
     * @param Request $request
     * @return JsonResponse
     */
    public function profileCompletion(Request $request,$id): JsonResponse
    {
       
            $validated = Validator::make($request->all(), [
                'image' => 'required',
                'age' => 'required',
                'weight' => 'required',
                'gender' => 'required',
                'fitness_goal' => 'required',
                'fitness_idol' => 'required',
                'bio_section' => 'required',
                'type_of_workout_id' => 'required',
                'sport' => 'required',

            ]);

            if ($validated->fails()) {
                return $this->parametersInvalidResponse(null, $validated->errors()->all());

            }$form = new RegisterForm();
            $form->loadFromArray( $request->all() );
            $item = $this->userService->profileComplete( $form, $id);
            if ($item){
                $data['user'] = $item;
                return $this->successResponse('Profile Complete successful', $data);
            }
       


        return $this->parametersInvalidResponse();
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function socialLogin( Request $request ): JsonResponse
    {
        if ( isset( $request->social_token ) ) {
            $res = $this->userService->findBySocialToken( $request['social_token'] );

            if ( !$res ) {

                $validated = Validator::make( $request->all(), [
                    'social_token'                 => 'required',
                ] );
                if ( $validated->fails() ) {
                    return $this->parametersInvalidResponse( null, $validated->errors()->all() );
                }
                $form = new SocialLoginForm();
                $form->loadFromArray( $request->all() );

                $this->userService->socialRegister( $form);

            }
            $res = $this->userService->findBySocialToken( $request['social_token'] );

            if ( $res ) {
                $user = $res;
                $newUser=$this->userService->updateDeviceToken($user->id, $request->device_token);
                $success['user'] = $newUser;
                $success['token'] = $this->userService->fetchToken($user['id']);

                return $this->successResponse('Logged in!', $success);
            }
        }
        return $this->parametersInvalidResponse();
    }


    /**
     * @param Request $request
     * @param $id
     * @return JsonResponse
     */
    public function rate(Request $request, $id): JsonResponse
    {
        $user = Auth::user();
        if ($user) {
            if (isset($request->rating)) {
                if (isset($request->review)) {
                    $business = $this->userService->rate(
                        $id,
                        $request->rating,
                        $user->id,
                        $request->review
                    );
                } else {
                    $business = $this->userService->rate(
                        $id,
                        $request->rating,
                        $user->id
                    );
                }

                if ($business) {

                    return $this->successResponse(null, $business->load('ratings', 'ratings.user'));
                }

                return $this->parametersInvalidResponse('No Coach Found!');
            }

            return $this->parametersInvalidResponse();
        }

        return $this->unAuthorizedResponse();
    }

    /**
     * @return JsonResponse
     */
    public function getAllAgainstUser(): JsonResponse
    {
        if ( Auth::check() ) {
            $items = $this->userService->get(
                [
                    'id' => auth()->id(),
                ]
            );

            if ( $items && count( $items ) > 0 ) {
                return $this->successResponse(
                    null,
                    $items->load('ratings', 'ratings.users')
                );
            }

            return $this->parametersInvalidResponse( 'No Items Found!' );
        }

        return $this->unAuthorizedResponse();
    }









}
