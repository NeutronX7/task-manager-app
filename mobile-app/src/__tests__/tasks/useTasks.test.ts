import { renderHook, act, waitFor } from '@testing-library/react-native'
import { useTasks } from '../../hooks/useTasks'
import * as tasksService from '../../services/tasksService'

/**
 * ENLACE CLAVE:
 * El hook real importa el service así:
 *    import * as tasksService from '../services/tasksService'
 *
 * Con jest.mock(...) hacemos que TODAS esas funciones (listTasks, createTask, etc.)
 * sean mocks y NO llamen al backend real.
 */
jest.mock('../../services/tasksService')

// Se tipa mocked
const mocked = tasksService as jest.Mocked<typeof tasksService>

describe('useTasks', () => {
    /**
     * Limpia mocks antes de cada test para que:
     * - no se acumulen calls
     * - no se “mezclen” implementaciones de un test con otro
     */
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('carga tareas al montar (refresh automático)', async () => {
        /**
         * ENLACE CON HOOK REAL:
         * useTasks() tiene:
         *   useEffect(() => { refresh() }, [refresh])
         *
         * refresh() llama:
         *   const data = await tasksService.listTasks()
         *
         * Aquí mockeamos esa respuesta para que al montar el hook,
         * el refresh automático reciba estas tareas.
         */
        mocked.listTasks.mockResolvedValueOnce([
            { id: 1, title: 'Tarea 1', description: 'Desc', status: 'pending' },
        ] as any)

        /**
         * renderHook monta el hook como si fuera un componente.
         * Esto dispara el useEffect interno => refresh() automático.
         */
        const { result } = renderHook(() => useTasks())

        /**
         * Espera al refresh
         * refresh() hace setLoading(true) y al final setLoading(false)
         * waitFor reintenta hasta que la condición se cumpla.
         */
        await waitFor(() => expect(result.current.loading).toBe(false))

        // verifica que se llamó el service correcto
        expect(mocked.listTasks).toHaveBeenCalledTimes(1)

        // Verifica el estado del hook después del refresh
        expect(Array.isArray(result.current.tasks)).toBe(true)
        expect(result.current.tasks).toHaveLength(1)
        expect(result.current.tasks[0].title).toBe('Tarea 1')
    })

    it('createTask agrega la tarea al inicio', async () => {
        /**
         * Primero: el mount hace refresh automático.
         * Lo dejamos vacío para que el estado inicial sea [].
         */
        mocked.listTasks.mockResolvedValueOnce([] as any)

        /**
         * ENLACE CON HOOK REAL:
         * createTask(payload) llama:
         *   const created = await tasksService.createTask(payload)
         *   setTasks(prev => [created, ...prev])
         *
         * Aquí se define qué "tarea creada" devolverá el service.
         */
        mocked.createTask.mockResolvedValueOnce({
            id: 99,
            title: 'Nueva',
            description: '',
            status: 'pending',
        } as any)

        const { result } = renderHook(() => useTasks())
        await waitFor(() => expect(result.current.loading).toBe(false))

        /**
         * act(...) es obligatorio cuando un test dispara actualizaciones de estado.
         * Aquí createTask cambia state con setTasks(...).
         */
        await act(async () => {
            await result.current.createTask({ title: 'Nueva', description: '' } as any)
        })

        // asegura que el request a create fue hecho
        expect(mocked.createTask).toHaveBeenCalledTimes(1)

        // expect en este caso espera el resultado al crear una nueva tarea
        expect(result.current.tasks[0].id).toBe(99)
        expect(result.current.tasks[0].status).toBe('pending')
    })

    it('updateTask reemplaza la tarea por id', async () => {
        /**
         * mount => refresh automático => estado inicial con 2 tareas
         */
        mocked.listTasks.mockResolvedValueOnce([
            { id: 1, title: 'Old', description: '', status: 'pending' },
            { id: 2, title: 'Other', description: '', status: 'pending' },
        ] as any)

        /**
         * ENLACE CON HOOK:
         * updateTask(id, payload) llama:
         *   const updated = await tasksService.updateTask(id, payload)
         *   setTasks(prev => prev.map(t => (t.id === id ? updated : t)))
         */
        mocked.updateTask.mockResolvedValueOnce({
            id: 1,
            title: 'Updated',
            description: 'Nueva desc',
            status: 'in_progress',
        } as any)

        const { result } = renderHook(() => useTasks())
        await waitFor(() => expect(result.current.loading).toBe(false))

        await act(async () => {
            await result.current.updateTask(1, {
                title: 'Updated',
                description: 'Nueva desc',
                status: 'in_progress',
            } as any)
        })

        expect(mocked.updateTask).toHaveBeenCalledTimes(1)

        // Se mantiene el largo, solo se reemplaza el item con id=1
        expect(result.current.tasks).toHaveLength(2)
        expect(result.current.tasks.find(t => t.id === 1)?.title).toBe('Updated')
        expect(result.current.tasks.find(t => t.id === 1)?.status).toBe('in_progress')
    })

    it('deleteTask elimina la tarea del estado', async () => {
        mocked.listTasks.mockResolvedValueOnce([
            { id: 1, title: 'A', description: '', status: 'pending' },
            { id: 2, title: 'B', description: '', status: 'pending' },
        ] as any)

        /**
         * ENLACE CON HOOK:
         * deleteTask(id) llama:
         *   await tasksService.deleteTask(id)
         *   setTasks(prev => prev.filter(t => t.id !== id))
         */
        mocked.deleteTask.mockResolvedValueOnce(undefined as any)

        const { result } = renderHook(() => useTasks())
        await waitFor(() => expect(result.current.loading).toBe(false))

        await act(async () => {
            await result.current.deleteTask(1)
        })

        expect(mocked.deleteTask).toHaveBeenCalledWith(1)
        expect(result.current.tasks).toHaveLength(1)
        expect(result.current.tasks[0].id).toBe(2)
    })

    it('si listTasks falla, setea error', async () => {
        /**
         * ENLACE CON HOOK:
         * refresh() tiene try/catch y setError(...)
         * Aquí forzamos un error en listTasks.
         */
        mocked.listTasks.mockRejectedValueOnce(new Error('Unauthenticated.'))

        const { result } = renderHook(() => useTasks())
        await waitFor(() => expect(result.current.loading).toBe(false))

        // Debe exponer el error como state en vez de crashear
        expect(result.current.error).toBeTruthy()
        expect(result.current.error).toContain('Unauthenticated')
    })

    it('refresh() manual vuelve a pedir tareas', async () => {
        /**
         * Primera llamada (mount) => []
         * Segunda llamada (refresh manual) => [X]
         */
        mocked.listTasks
            .mockResolvedValueOnce([] as any)
            .mockResolvedValueOnce([{ id: 7, title: 'X', description: '', status: 'pending' }] as any)

        const { result } = renderHook(() => useTasks())
        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.tasks).toHaveLength(0)

        /**
         * ENLACE CON HOOK:
         * refresh es expuesto en el return del hook.
         * Al llamarlo, vuelve a ejecutar listTasks() y actualiza tasks.
         */
        await act(async () => {
            await result.current.refresh()
        })

        expect(mocked.listTasks).toHaveBeenCalledTimes(2)
        expect(result.current.tasks).toHaveLength(1)
        expect(result.current.tasks[0].id).toBe(7)
    })
})
