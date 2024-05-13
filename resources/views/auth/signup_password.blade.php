@extends('layouts.new_auth')

@section('content')
<div class="row justify-content-center">
        <div class="col-md-8 my-5">
            <div class="card card-auth my-5">
                <div class="card-body my-5">
                    <h1>Let's <strong>Sign In</strong></h1>
                    <p class="mt-4" style="color:#52587a;">Hey, Enter your details to get sign in<br> to your account.</p>
                    <form method="POST" action="{{ route('password-saved') }}" class="my-5">
                        @csrf
                        <input type="hidden" name="signup_token" value="{{$token}}">
                        <div class="form-group row mt-2">
                            <div class="col-md-12">
                                <label for="password" class="col-md-4 col-form-label text-left"><strong>{{ __('Password') }}</strong></label>
                                <input id="password" type="password" class="form-control form-control-rounded @error('password') is-invalid @enderror" name="password" placeholder="{{ __('Enter Password') }}">

                                @error('password')
                                <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row mt-2">
                            <div class="col-md-12">
                                <label for="password_confirmation" class="col-md-4 col-form-label text-left"><strong>{{ __('Confirm Password') }}</strong></label>
                                <input id="password_confirmation" type="password" class="form-control form-control-rounded @error('password_confirmation') is-invalid @enderror" name="password_confirmation"  placeholder="{{ __('Enter Password') }}">

                                @error('password_confirmation')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row mt-5">
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>

                                    <label class="form-check-label" for="remember">
                                        {{ __('Remember Me') }}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="form-group row mb-5">
                            <div class="col-md-8">
                                <button type="submit" class="btn btn-lg btn-primary">
                                    {{ __('Save') }}
                                </button>


                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
