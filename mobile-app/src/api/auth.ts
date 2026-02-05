import { api } from './axios'

export type RegisterRequest = { name: string; email: string; password: string }

export type AuthResponse = {
    token: string
    token_type?: string
    user: {
        id: number | string
        name?: string
        email: string
        created_at?: string
    }
}

export async function loginApi(payload: { email: string; password: string }): Promise<AuthResponse> {
    console.log(payload)
    try {
        const response = await api.post('/login', {
            email: payload.email,
            password: payload.password
        })

        console.log('LOGIN RESPONSE:', response.data)
        return response.data
    } catch ( error: any ) {
        console.log('LOGIN ERROR STATUS:', error?.response?.status)
        console.log('LOGIN ERROR DATA:', error?.response?.data)
        throw error
    }
}

export async function registerApi(payload: RegisterRequest): Promise<AuthResponse> {
    console.log(payload)
    try {
        const response = await api.post('/register', {
            name: payload.name,
            email: payload.email,
            password: payload.password
        })

        console.log('Register RESPONSE:', response.data)
        return response.data
    } catch ( error: any ) {
        console.log('Register ERROR STATUS:', error?.response?.status)
        console.log('Register ERROR DATA:', error?.response?.data)
        throw error
    }
}
