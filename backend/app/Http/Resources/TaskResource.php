<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    // Define la estructura pública de una tarea en la API
    public function toArray(Request $request): array
    {
        return [
            // Identificador de la tarea
            'id' => $this->id,

            // Campos principales
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,

            // Fechas de auditoría
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
