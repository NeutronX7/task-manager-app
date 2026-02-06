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
    // Inyección del servicio de autenticación
    public function __construct(private AuthService $auth) {}

    // Registro de usuario
    public function register(RegisterRequest $request)
    {
        // Lógica delegada al service
        [$user, $token] = $this->auth->register($request->validated());

        // Respuesta estandarizada con token y usuario
        return response()->json([
            'token' => $token,
            'token_type' => 'bearer',
            'user' => new UserResource($user),
        ], 201);
    }

    // Login de usuario
    public function login(LoginRequest $request)
    {
        // Autenticación vía service
        [$user, $token] = $this->auth->login($request->validated());

        return response()->json([
            'token' => $token,
            'token_type' => 'bearer',
            'user' => new UserResource($user),
        ]);
    }

    // Devuelve el usuario autenticado
    public function me(Request $request)
    {
        return new UserResource($request->user());
    }

    // Cierra sesión eliminando el token actual
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
