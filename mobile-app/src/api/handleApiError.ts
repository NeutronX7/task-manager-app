export type ApiError = {
    status: number
    message: string
    errors?: Record<string, string[]>
}

export function handleApiError(error: any): never {
    const status = error?.response?.status ?? 0
    const data = error?.response?.data

    const apiError: ApiError = {
        status,
        message: data?.message ?? 'Error inesperado'
    }

    if (data?.errors) {
        apiError.errors = data.errors
    }

    throw apiError
}
