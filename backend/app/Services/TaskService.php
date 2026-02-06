<?php

namespace App\Services;

use App\Models\Task;
use App\Repositories\TaskRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Exceptions\HttpResponseException;

class TaskService
{
    // Se inyecta el repositorio para separar acceso a datos de lógica de negocio
    public function __construct(private TaskRepository $repo) {}

    // Lista tareas del usuario autenticado
    public function list(int $userId): Collection
    {
        return $this->repo->forUser($userId);
    }

    // Crea tarea asignándola al usuario autenticado
    // Importante: user_id NO viene del cliente, se asigna en backend
    public function create(int $userId, array $data): Task
    {
        $data['user_id'] = $userId;

        // Estado por defecto si no se envía
        $data['status'] = $data['status'] ?? 'pending';

        return $this->repo->create($data);
    }

    // Actualiza una tarea solo si pertenece al usuario
    public function update(int $userId, int $taskId, array $data): Task
    {
        $task = $this->repo->findForUser($userId, $taskId);

        // Evita que un usuario modifique tareas ajenas
        if (!$task) {
            $this->taskNotFound();
        }

        return $this->repo->update($task, $data);
    }

    // Elimina una tarea solo si pertenece al usuario
    public function delete(int $userId, int $taskId): void
    {
        $task = $this->repo->findForUser($userId, $taskId);

        // Evita que un usuario elimine tareas ajenas
        if (!$task) {
            $this->taskNotFound();
        }

        $this->repo->delete($task);
    }

    // Respuesta consistente cuando una tarea no existe o no pertenece al usuario
    private function taskNotFound(): never
    {
        throw new HttpResponseException(
            response()->json([
                'message' => 'Tarea no encontrada.',
                'code' => 'TASK_NOT_FOUND',
            ], 404)
        );
    }
}
