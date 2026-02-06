import axios from 'axios'

// URL base del backend definida por variable de entorno
const rawBase = process.env.EXPO_PUBLIC_API_URL

// La app no puede funcionar sin backend configurado
if (!rawBase) {
    throw new Error(
        'Missing EXPO_PUBLIC_API_URL. Create mobile-app/.env with EXPO_PUBLIC_API_URL=http://localhost:8000 (or 10.0.2.2 for Android emulator).'
    )
}

// Normaliza la URL eliminando slashes finales
const base = rawBase.replace(/\/+$/, '')

// Prefijo /api para todos los endpoints
const apiBaseURL = `${base}/api`

// Instancia centralizada de axios
export const api = axios.create({
    baseURL: apiBaseURL,
    timeout: 15000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

// Interceptor de request para debug y trazabilidad
api.interceptors.request.use(config => {
    console.log('➡️', config.method?.toUpperCase(), config.baseURL + config.url)
    console.log('AUTH HEADER:', config.headers?.Authorization || config.headers?.authorization)
    return config
})
