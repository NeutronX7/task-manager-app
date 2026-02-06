<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    // Permite que cualquier usuario autenticado ejecute el request
    public function authorize(): bool
    {
        return true;
    }

    // Reglas de validación para actualizar una tarea
    // Se usa "sometimes" para permitir updates parciales
    public function rules(): array
    {
        return [
            // El título solo se valida si viene en el request
            'title' => ['sometimes', 'required', 'string', 'min:3', 'max:255'],

            // La descripción es opcional en updates
            'description' => ['sometimes', 'nullable', 'string', 'max:1000'],

            // El estado debe ser uno válido si se envía
            'status' => ['sometimes', 'required', 'in:pending,in_progress,completed'],
        ];
    }

    // Mensajes personalizados de validación
    public function messages(): array
    {
        return [
            'title.required' => 'El título es obligatorio.',
            'title.min' => 'El título debe tener al menos 3 caracteres.',
            'title.max' => 'El título no puede exceder 255 caracteres.',
            'description.max' => 'La descripción no puede exceder 1000 caracteres.',
            'status.required' => 'El estado es obligatorio.',
            'status.in' => 'El estado es inválido.',
        ];
    }
}
