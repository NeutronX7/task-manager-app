import * as SecureStore from 'expo-secure-store'

const KEY = 'auth_session_v1'

export type StoredSession = {
    token: string
    user: { id: string; email: string; name?: string }
}

export async function saveSession(session: StoredSession) {
    await SecureStore.setItemAsync(KEY, JSON.stringify(session))
}

export async function loadSession(): Promise<StoredSession | null> {
    const raw = await SecureStore.getItemAsync(KEY)
    return raw ? (JSON.parse(raw) as StoredSession) : null
}

export async function clearSession() {
    await SecureStore.deleteItemAsync(KEY)
}
