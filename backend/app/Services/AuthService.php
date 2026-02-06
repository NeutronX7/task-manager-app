<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    // Registra un usuario y genera un token (Sanctum) para el móvil
    public function register(array $data): array
    {
        // Se hashea la contraseña antes de guardarla
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // Token tipo "bearer" para consumo desde mobile
        $token = $user->createToken('mobile')->plainTextToken;

        return [$user, $token];
    }

    // Valida credenciales y retorna token si son correctas
    public function login(array $data): array
    {
        $user = User::where('email', $data['email'])->first();

        // Si el usuario no existe o la contraseña no coincide, responde 401 con mensaje claro
        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw new HttpResponseException(
                response()->json([
                    'message' => 'Credenciales inválidas, pruebe con otras.',
                    'code' => 'AUTH_INVALID_CREDENTIALS',
                    // Formato útil para UI (ej. mostrar error en campo email)
                    'errors' => [
                        'email' => ['Credenciales inválidas.'],
                    ],
                ], 401)
            );
        }

        // Genera token nuevo en cada login
        $token = $user->createToken('mobile')->plainTextToken;

        return [$user, $token];
    }
}
