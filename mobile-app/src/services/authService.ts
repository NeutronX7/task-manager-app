import {AuthResponse, loginApi, registerApi} from "../api/auth";
import {clearSession, loadSession, saveSession} from "./sessionStorage";

export type AuthUser = {
    id: string
    email: string
    name?: string
}

export type AuthSession = {
    token: string
    user: AuthUser
}

/**
 * Mapea la respuesta del backend a una sesión interna de la app.
 * Se normaliza el id como string para evitar inconsistencias.
 */
function mapSession(data: AuthResponse): AuthSession {
    return {
        token: data.token,
        user: {
            id: String(data.user.id),
            email: data.user.email,
            name: data.user.name,
        },
    }
}

//Guarda la sesión de forma segura en el dispositivo.
export async function login(email: string, password: string): Promise<AuthSession> {
    const data = await loginApi({ email, password })
    const session = mapSession(data)
    await saveSession(session)
    return session
}

//Guarda automáticamente la sesión al finalizar.
export async function register(name: string, email: string, password: string): Promise<AuthSession> {
    const data = await registerApi({ name, email, password })
    const session = mapSession(data)
    await saveSession(session)
    return session
}

//Restaura la sesión guardada al abrir la app.
export async function restoreSession() {
    return await loadSession()
}

//Cierra sesión eliminando la información guardada.
export async function logout(): Promise<void> {
    await clearSession()
}