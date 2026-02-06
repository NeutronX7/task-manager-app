// Estructura normalizada de error de API
export type ApiError = {
    status: number
    code?: string
    message: string
    errors?: Record<string, string[]>
}

// Convierte el error HTTP en un ApiError consistente
export function handleApiError(error: any): never {
    const status = error?.response?.status ?? 0
    const data = error?.response?.data

    const apiError: ApiError = {
        status,
        code: data?.code,
        message: data?.message ?? 'Error inesperado',
    }

    // Errores de validación por campo
    if (data?.errors) apiError.errors = data.errors

    // Se relanza para que el caller lo maneje
    throw apiError
}

// Obtiene un mensaje legible para mostrar en UI
export function getApiErrorMessage(e: unknown, fallback = 'Ocurrió un error') {
    const err = e as ApiError | any

    if (err?.message) {
        // Prioriza el primer error de validación si existe
        const firstFieldError =
            err?.errors?.title?.[0] ||
            err?.errors?.description?.[0] ||
            err?.errors?.status?.[0]

        return firstFieldError || err.message
    }

    return fallback
}
