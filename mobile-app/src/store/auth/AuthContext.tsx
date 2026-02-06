import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as authService from '../../services/authService'
import { setAuthToken } from '../../api/setAuthToken'

export type AuthUser = {
    id: string
    email: string
    name?: string
}

// Estado global de autenticación
type AuthState = {
    token: string | null
    user: AuthUser | null
    isLoading: boolean
}

// API pública del contexto
type AuthContextValue = AuthState & {
    signIn: (email: string, password: string) => Promise<void>
    signUp: (name: string, email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
}

// Contexto de autenticación
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Token JWT
    const [token, setToken] = useState<string | null>(null)

    // Usuario autenticado
    const [user, setUser] = useState<AuthUser | null>(null)

    // Estado de restauración de sesión
    const [isBootstrapping, setIsBootstrapping] = useState(true)

    // Sincroniza el token con axios
    useEffect(() => {
        setAuthToken(token)
    }, [token])

    // Restaura sesión al iniciar la app
    useEffect(() => {
        let mounted = true

        ;(async () => {
            try {
                const session = await authService.restoreSession()
                if (!mounted) return

                if (session?.token) {
                    setAuthToken(session.token)
                    setToken(session.token)
                    setUser(session.user)
                } else {
                    setAuthToken(null)
                    setToken(null)
                    setUser(null)
                }
            } finally {
                if (mounted) setIsBootstrapping(false)
            }
        })()

        return () => {
            mounted = false
        }
    }, [])

    const signIn = async (email: string, password: string) => {
        const session = await authService.login(email, password)
        setAuthToken(session.token)
        setToken(session.token)
        setUser(session.user)
    }

    const signUp = async (name: string, email: string, password: string) => {
        const session = await authService.register(name, email, password)
        setAuthToken(session.token)
        setToken(session.token)
        setUser(session.user)
    }

    const signOut = async () => {
        await authService.logout()
        setAuthToken(null)
        setToken(null)
        setUser(null)
    }

    const value = useMemo(
        () => ({ token, user, isLoading: isBootstrapping, signIn, signUp, signOut }),
        [token, user, isBootstrapping]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook seguro para consumir el contexto
export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('must be auth')
    return ctx
}
