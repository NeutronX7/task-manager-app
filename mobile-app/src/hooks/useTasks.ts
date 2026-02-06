import { useCallback, useEffect, useState } from 'react'
import * as tasksService from '../services/tasksService'
import {getApiErrorMessage} from "../api/handleApiError";
import {CreateTaskDTO, TaskDTO, UpdateTaskDTO} from "../api/types";

type ActionErrors = {
    list: string
    create: string
    update: string
    delete: string
}

export function useTasks() {
    const [tasks, setTasks] = useState<TaskDTO[]>([])
    const [loading, setLoading] = useState(false)

    const [errors, setErrors] = useState<ActionErrors>({
        list: '',
        create: '',
        update: '',
        delete: '',
    })

    const clearError = useCallback((key: keyof ActionErrors) => {
        setErrors(prev => ({ ...prev, [key]: '' }))
    }, [])

    const refresh = useCallback(async () => {
        try {
            setLoading(true)
            setErrors(prev => ({ ...prev, list: '' }))
            const data = await tasksService.listTasks()
            setTasks(Array.isArray(data) ? data : [])
        } catch (e: any) {
            setErrors(prev => ({
                ...prev,
                list: getApiErrorMessage(e, 'Error al cargar tareas'),
            }))
        } finally {
            setLoading(false)
        }
    }, [])

    const createTask = useCallback(async (payload: CreateTaskDTO) => {
        try {
            setErrors(prev => ({ ...prev, create: '' }))
            const created = await tasksService.createTask(payload)
            setTasks(prev => [created, ...prev])
            return created
        } catch (e: any) {
            const msg = getApiErrorMessage(e, 'No se pudo crear la tarea')
            setErrors(prev => ({ ...prev, create: msg }))
            throw e
        }
    }, [])

    const updateTask = useCallback(async (taskId: string | number, payload: UpdateTaskDTO) => {
        try {
            setErrors(prev => ({ ...prev, update: '' }))
            const updated = await tasksService.updateTask(taskId, payload)
            setTasks(prev => prev.map(t => (String(t.id) === String(taskId) ? updated : t)))
            return updated
        } catch (e: any) {
            const msg = getApiErrorMessage(e, 'No se pudo actualizar la tarea')
            setErrors(prev => ({ ...prev, update: msg }))
            throw e
        }
    }, [])

    const deleteTask = useCallback(async (taskId: string | number) => {
        try {
            setErrors(prev => ({ ...prev, delete: '' }))
            await tasksService.deleteTask(taskId)
            setTasks(prev => prev.filter(t => String(t.id) !== String(taskId)))
        } catch (e: any) {
            const msg = getApiErrorMessage(e, 'No se pudo eliminar la tarea')
            setErrors(prev => ({ ...prev, delete: msg }))
            throw e
        }
    }, [])

    useEffect(() => {
        refresh()
    }, [refresh])

    return {
        tasks,
        loading,
        errors,
        clearError,
        refresh,
        createTask,
        updateTask,
        deleteTask,
    }
}
