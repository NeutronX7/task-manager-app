export type ApiError = {
    status: number
    code?: string
    message: string
    errors?: Record<string, string[]>
}

export function handleApiError(error: any): never {
    const status = error?.response?.status ?? 0
    const data = error?.response?.data

    const apiError: ApiError = {
        status,
        code: data?.code,
        message: data?.message ?? 'Error inesperado',
    }

    if (data?.errors) apiError.errors = data.errors

    throw apiError
}

export function getApiErrorMessage(e: unknown, fallback = 'Ocurrió un error') {
    const err = e as ApiError | any

    if (err?.message) {
        // prioriza el primer error por campo si existe
        const firstFieldError =
            err?.errors?.title?.[0] ||
            err?.errors?.description?.[0] ||
            err?.errors?.status?.[0]

        return firstFieldError || err.message
    }

    return fallback
}

