import axios from 'axios'

const rawBase = process.env.EXPO_PUBLIC_API_URL

if (!rawBase) {
    throw new Error(
        'Missing EXPO_PUBLIC_API_URL. Create mobile-app/.env with EXPO_PUBLIC_API_URL=http://localhost:8000 (or 10.0.2.2 for Android emulator).'
    )
}

const base = rawBase.replace(/\/+$/, '') // quita slashes al final
const apiBaseURL = `${base}/api`

export const api = axios.create({
    baseURL: apiBaseURL,
    timeout: 15000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(config => {
    console.log('➡️', config.method?.toUpperCase(), config.baseURL + config.url)
    console.log('AUTH HEADER:', config.headers?.Authorization || config.headers?.authorization)
    console.log('AUTH HEADER:', config.headers?.Authorization)
    return config
})