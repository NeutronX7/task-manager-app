import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as authService from '../../services/authService'
import { setAuthToken } from '../../api/setAuthToken'

export type AuthUser = {
    id: string
    email: string
    name?: string
}

type AuthState = {
    token: string | null
    user: AuthUser | null
    isLoading: boolean
}

type AuthContextValue = AuthState & {
    signIn: (email: string, password: string) => Promise<void>
    signUp: (name: string, email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<AuthUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setAuthToken(token)
    }, [token])

    useEffect(() => {
        setIsLoading(false)
    }, [])

    const signIn = async (email: string, password: string) => {
        setIsLoading(true)
        try {
            const session = await authService.login(email, password)
            setAuthToken(session.token)
            setToken(session.token)
            setUser(session.user)
        } finally {
            setIsLoading(false)
        }
    }

    const signUp = async (name: string, email: string, password: string) => {
        setIsLoading(true)
        try {
            const session = await authService.register(name, email, password)
            setAuthToken(session.token)
            setToken(session.token)
            setUser(session.user)
        } finally {
            setIsLoading(false)
        }
    }

    const signOut = async () => {
        setIsLoading(true)
        try {
            await authService.logout()
            setAuthToken(null)
            setToken(null)
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    const value = useMemo<AuthContextValue>(
        () => ({ token, user, isLoading, signIn, signUp, signOut }),
        [token, user, isLoading]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('must be auth')
    return ctx
}
