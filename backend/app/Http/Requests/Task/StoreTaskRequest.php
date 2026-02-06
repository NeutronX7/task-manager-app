<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    // Permite que cualquier usuario autenticado ejecute el request
    public function authorize(): bool
    {
        return true;
    }

    // Reglas de validación para crear una tarea
    public function rules(): array
    {
        return [
            // Título obligatorio, con longitud controlada
            'title' => ['required', 'string', 'min:3', 'max:255'],

            // Descripción opcional
            'description' => ['nullable', 'string', 'max:1000'],

            // Estado opcional con valores permitidos
            'status' => ['nullable', 'in:pending,in_progress,completed'],
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
            'status.in' => 'El estado es inválido.',
        ];
    }
}
