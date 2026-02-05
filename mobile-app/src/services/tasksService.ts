import { api } from '../api/axios'
import type { CreateTaskDTO, TaskDTO, UpdateTaskDTO } from '../api/task'

export async function listTasks(): Promise<TaskDTO[]> {
    const { data } = await api.get('/tasks')
    return data.data
}

export async function createTask(payload: CreateTaskDTO): Promise<TaskDTO> {
    const { data } = await api.post('/tasks', payload)
    return data.data
}

export async function updateTask(taskId: string | number, payload: UpdateTaskDTO): Promise<TaskDTO> {
    const { data } = await api.put(`/tasks/${taskId}`, payload)
    return data.data
}

export async function deleteTask(taskId: string | number): Promise<void> {
    await api.delete(`/tasks/${taskId}`)
}
