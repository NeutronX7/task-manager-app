import {loginApi, registerApi} from "../api/auth";

export type AuthUser = {
    id: string
    email: string
    name?: string
}

export type AuthSession = {
    token: string
    user: AuthUser
}

function mapSession(data: any): AuthSession {
    return {
        token: data.token,
        user: {
            id: String(data.user.id),
            email: data.user.email,
            name: data.user.name
        }
    }
}

export async function login(email: string, password: string): Promise<AuthSession> {
    const data = await loginApi({ email, password })
    return mapSession(data)
}

export async function register(name: string, email: string, password: string): Promise<AuthSession> {
    const data = await registerApi({ name, email, password })
    return mapSession(data)
}

export async function restoreSession(): Promise<AuthSession | null> {
    return null
}

export async function clearSession(): Promise<void> {}
