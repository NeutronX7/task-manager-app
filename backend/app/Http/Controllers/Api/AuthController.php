<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private AuthService $auth) {}

    public function register(RegisterRequest $request)
    {
        [$user, $token] = $this->auth->register($request->validated());

        return response()->json([
            'token' => $token,
            'token_type' => 'bearer',
            'user' => new UserResource($user),
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        [$user, $token] = $this->auth->login($request->validated());

        return response()->json([
            'token' => $token,
            'token_type' => 'bearer',
            'user' => new UserResource($user),
        ]);
    }

    public function me(Request $request)
    {
        return new UserResource($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
