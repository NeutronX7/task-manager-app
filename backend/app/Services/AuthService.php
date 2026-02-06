<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function register(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('mobile')->plainTextToken;

        return [$user, $token];
    }

    public function login(array $data): array
    {
        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw new HttpResponseException(
                response()->json([
                    'message' => 'Credenciales inválidas, pruebe con otras.',
                    'code' => 'AUTH_INVALID_CREDENTIALS',
                    'errors' => [
                        'email' => ['Credenciales inválidas.'],
                    ],
                ], 401)
            );
        }

        $token = $user->createToken('mobile')->plainTextToken;

        return [$user, $token];
    }
}
