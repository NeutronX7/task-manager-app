<?php

namespace App\Exceptions;

use Illuminate\Validation\ValidationException;
use Throwable;

class Handler
{

    public function render($request, Throwable $e)
    {
        if ($request->expectsJson() && $e instanceof ValidationException) {
            // detectar emails duplicados
            $errors = $e->errors();
            $code = 'VALIDATION_ERROR';

            if (isset($errors['email'])) {
                foreach ($errors['email'] as $msg) {
                    if (str_contains(strtolower($msg), 'registrado') || str_contains(strtolower($msg), 'taken')) {
                        $code = 'AUTH_EMAIL_TAKEN';
                        break;
                    }
                }
            }

            return response()->json([
                'message' => $code === 'AUTH_EMAIL_TAKEN'
                    ? 'El correo ya está registrado.'
                    : 'Datos inválidos.',
                'code' => $code,
                'errors' => $errors,
            ], 422);
        }

        return parent::render($request, $e);
    }
}
