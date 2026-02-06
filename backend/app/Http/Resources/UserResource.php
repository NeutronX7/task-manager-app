<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    // Define la información pública del usuario expuesta por la API
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            // Datos básicos del perfil
            'name' => $this->name,
            'email' => $this->email,

            // Fecha de creación del usuario
            'created_at' => $this->created_at,
        ];
    }
}
