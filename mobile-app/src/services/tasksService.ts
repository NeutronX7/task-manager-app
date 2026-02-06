import { api } from '../api/axios'
import type { CreateTaskDTO, TaskDTO, UpdateTaskDTO } from '../api/types'
import {handleApiError} from "../api/handleApiError";

export async function listTasks(): Promise<TaskDTO[]> {
    try {
        const { data } = await api.get('/tasks')
        return data?.data ?? data // por si usas resource collection (data.data)
    } catch (e: any) {
        handleApiError(e)
    }
}

export async function createTask(payload: CreateTaskDTO): Promise<TaskDTO> {
    try {
        const { data } = await api.post('/tasks', payload)
        return data?.data ?? data
    } catch (e: any) {
        handleApiError(e)
    }
}

export async function updateTask(taskId: string | number, payload: UpdateTaskDTO): Promise<TaskDTO> {
    try {
        const { data } = await api.put(`/tasks/${taskId}`, payload)
        return data?.data ?? data
    } catch (e: any) {
        handleApiError(e)
    }
}

export async function deleteTask(taskId: string | number): Promise<void> {
    try {
        await api.delete(`/tasks/${taskId}`)
    } catch (e: any) {
        handleApiError(e)
    }
}