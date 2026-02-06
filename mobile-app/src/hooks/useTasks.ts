import { useCallback, useEffect, useState } from 'react'
import * as tasksService from '../services/tasksService'
import { getApiErrorMessage } from '../api/handleApiError'
import { CreateTaskDTO, TaskDTO, UpdateTaskDTO } from '../api/types'

// Errores separados por acción para mejor control en UI
type ActionErrors = {
    list: string
    create: string
    update: string
    delete: string
}

export function useTasks() {
    // Estado principal de tareas
    const [tasks, setTasks] = useState<TaskDTO[]>([])

    // Estado global de carga
    const [loading, setLoading] = useState(false)

    // Errores por acción
    const [errors, setErrors] = useState<ActionErrors>({
        list: '',
        create: '',
        update: '',
        delete: '',
    })

    // Limpia el error de una acción específica
    const clearError = useCallback((key: keyof ActionErrors) => {
        setErrors(prev => ({ ...prev, [key]: '' }))
    }, [])

    // Carga inicial y refresh manual de tareas
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

    // Crea una nueva tarea y la agrega al estado local
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

    // Actualiza una tarea existente
    const updateTask = useCallback(
        async (taskId: string | number, payload: UpdateTaskDTO) => {
            try {
                setErrors(prev => ({ ...prev, update: '' }))
                const updated = await tasksService.updateTask(taskId, payload)
                setTasks(prev =>
                    prev.map(t => (String(t.id) === String(taskId) ? updated : t))
                )
                return updated
            } catch (e: any) {
                const msg = getApiErrorMessage(e, 'No se pudo actualizar la tarea')
                setErrors(prev => ({ ...prev, update: msg }))
                throw e
            }
        },
        []
    )

    // Elimina una tarea del backend y del estado local
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

    // Carga automática al montar el hook
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
