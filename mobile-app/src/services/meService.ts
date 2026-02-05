import {api} from "../api/axios";

export type MeResponse = {
    id: string
    email: string
    name?: string
}

export async function getMe(): Promise<MeResponse> {
    console.log('[meService] GET /me')
    const { data } = await api.get('/me')
    console.log('[meService] OK', data.data)
    return data.data
}