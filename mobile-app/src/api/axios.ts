import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:8000/api',
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