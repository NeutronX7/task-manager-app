<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Services\TaskService;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // Inyección del servicio de tareas
    public function __construct(private TaskService $service) {}

    // Lista tareas del usuario autenticado
    public function index(Request $request)
    {
        $tasks = $this->service->list($request->user()->id);
        return TaskResource::collection($tasks);
    }

    // Crea una nueva tarea
    public function store(StoreTaskRequest $request)
    {
        $task = $this->service->create(
            $request->user()->id,
            $request->validated()
        );

        return response()->json([
            'message' => 'Tarea creada',
            'code' => 'TASK_CREATED',
            'data' => new TaskResource($task),
        ], 201);
    }

    // Actualiza una tarea existente
    public function update(UpdateTaskRequest $request, int $task)
    {
        $updated = $this->service->update(
            $request->user()->id,
            $task,
            $request->validated()
        );

        return response()->json([
            'message' => 'Tarea actualizada',
            'code' => 'TASK_UPDATED',
            'data' => new TaskResource($updated),
        ]);
    }

    // Elimina una tarea del usuario
    public function destroy(Request $request, int $task)
    {
        $this->service->delete($request->user()->id, $task);

        return response()->json([
            'message' => 'Tarea eliminada',
            'code' => 'TASK_DELETED',
        ]);
    }
}
