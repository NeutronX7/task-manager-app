<?php

namespace App\Services;

use App\Models\Task;
use App\Repositories\TaskRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Auth\Access\AuthorizationException;

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
            throw new AuthorizationException('Task not found.');
        }

        return $this->repo->update($task, $data);
    }

    public function delete(int $userId, int $taskId): void
    {
        $task = $this->repo->findForUser($userId, $taskId);

        if (!$task) {
            throw new AuthorizationException('Task not found.');
        }

        $this->repo->delete($task);
    }
}
