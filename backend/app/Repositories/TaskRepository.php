<?php

namespace App\Repositories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

class TaskRepository
{
    // Obtiene todas las tareas de un usuario, ordenadas por fecha más reciente
    public function forUser(int $userId): Collection
    {
        return Task::where('user_id', $userId)->latest()->get();
    }

    // Busca una tarea específica asegurando que pertenezca al usuario
    public function findForUser(int $userId, int $taskId): ?Task
    {
        return Task::where('user_id', $userId)->where('id', $taskId)->first();
    }

    // Crea una tarea con los datos ya validados por el service/request
    public function create(array $data): Task
    {
        return Task::create($data);
    }

    // Actualiza una tarea existente y retorna la versión actualizada
    public function update(Task $task, array $data): Task
    {
        $task->update($data);
        return $task->refresh();
    }

    // Elimina una tarea
    public function delete(Task $task): void
    {
        $task->delete();
    }
}
