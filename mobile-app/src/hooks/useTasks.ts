import { useCallback, useEffect, useState } from 'react'
import {
    createTaskApi,
    deleteTaskApi,
    listTasksApi,
    updateTaskApi,
    type CreateTaskDTO,
    type TaskDTO,
    type UpdateTaskDTO
} from '../api/task'

export function useTasks() {
    const [tasks, setTasks] = useState<TaskDTO[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const refresh = useCallback(async () => {
        try {
            setLoading(true)
            setError('')
            const data = await listTasksApi()
            setTasks(data)
        } catch (e: any) {
            setError(e?.message ?? 'Error al cargar tareas')
        } finally {
            setLoading(false)
        }
    }, [])

    const createTask = useCallback(async (payload: CreateTaskDTO) => {
        const created = await createTaskApi(payload)
        setTasks(prev => [created, ...prev])
        return created
    }, [])

    const updateTask = useCallback(async (taskId: string | number, payload: UpdateTaskDTO) => {
        const updated = await updateTaskApi(taskId, payload)
        setTasks(prev => prev.map(t => (String(t.id) === String(taskId) ? updated : t)))
        return updated
    }, [])

    const deleteTask = useCallback(async (taskId: string | number) => {
        await deleteTaskApi(taskId)
        setTasks(prev => prev.filter(t => String(t.id) !== String(taskId)))
    }, [])

    useEffect(() => {
        refresh()
    }, [refresh])

    return { tasks, loading, error, refresh, createTask, updateTask, deleteTask }
}
