import { Statuses } from '../constants'

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