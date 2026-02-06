import * as SecureStore from 'expo-secure-store'

//clave unica
const KEY = 'auth_session_v1'

//Estructura de la sesión guardada localmente.
export type StoredSession = {
    token: string
    user: { id: string; email: string; name?: string }
}

//Guarda la sesión de forma segura en el dispositivo.
export async function saveSession(session: StoredSession) {
    await SecureStore.setItemAsync(KEY, JSON.stringify(session))
}

//Carga la sesión guardada si existe.
export async function loadSession(): Promise<StoredSession | null> {
    const raw = await SecureStore.getItemAsync(KEY)
    return raw ? (JSON.parse(raw) as StoredSession) : null
}

export async function clearSession() {
    await SecureStore.deleteItemAsync(KEY)
}
