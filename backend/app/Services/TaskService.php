<?php

namespace App\Services;

use App\Models\Task;
use App\Repositories\TaskRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Exceptions\HttpResponseException;

class TaskService
{
    public function __construct(private TaskRepository $repo) {}

    public function list(int $userId): Collection
    {
        return $this->repo->forUser($userId);
    }

    public function create(int $userId, array $data): Task
    {
        $data['user_id'] = $userId;
        $data['status'] = $data['status'] ?? 'pending';

        return $this->repo->create($data);
    }

    public function update(int $userId, int $taskId, array $data): Task
    {
        $task = $this->repo->findForUser($userId, $taskId);

        if (!$task) {
            $this->taskNotFound();
        }

        return $this->repo->update($task, $data);
    }

    public function delete(int $userId, int $taskId): void
    {
        $task = $this->repo->findForUser($userId, $taskId);

        if (!$task) {
            $this->taskNotFound();
        }

        $this->repo->delete($task);
    }

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
