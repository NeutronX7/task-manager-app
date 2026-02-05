import { api } from './axios'
import { Statuses } from '../constants'
import { handleApiError } from './handleApiError'

export type TaskDTO = {
    id: number | string
    title: string
    description?: string | null
    status: Statuses
    created_at?: string
    updated_at?: string
}

export type CreateTaskDTO = {
    title: string
    description?: string
    status: Statuses
}

export type UpdateTaskDTO = Partial<CreateTaskDTO>

export async function listTasksApi(): Promise<TaskDTO[]> {
    try {
        const res = await api.get('/tasks')
        return res.data.data
    } catch (e) {
        handleApiError(e)
    }
}

export async function createTaskApi(payload: CreateTaskDTO): Promise<TaskDTO> {
    try {
        const res = await api.post('/tasks', payload)
        return res.data.data ?? res.data
    } catch (e) {
        handleApiError(e)
    }
}

export async function updateTaskApi(taskId: string | number, payload: UpdateTaskDTO): Promise<TaskDTO> {
    try {
        const res = await api.put(`/tasks/${taskId}`, payload)
        return res.data.data ?? res.data
    } catch (e) {
        handleApiError(e)
    }
}

export async function deleteTaskApi(taskId: string | number): Promise<void> {
    try {
        await api.delete(`/tasks/${taskId}`)
    } catch (e) {
        handleApiError(e)
    }
}
