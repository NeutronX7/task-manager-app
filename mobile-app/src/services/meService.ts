import {api} from "../api/axios";

export type MeResponse = {
    id: string
    email: string
    name?: string
}

/**
 * Obtiene el usuario autenticado desde el backend.
 * Se usa para validar la sesión activa.
 */
export async function getMe(): Promise<MeResponse> {
    console.log('[meService] GET /me')
    const { data } = await api.get('/me')
    console.log('[meService] OK', data.data)
    return data.data
}