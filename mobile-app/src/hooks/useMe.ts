import { useCallback, useEffect, useState } from 'react'
import * as meService from '../services/meService'

// Estado del perfil autenticado
type State = {
    user: meService.MeResponse | null
    loading: boolean
    error: string | null
}

export function useMe() {
    // Estado inicial: cargando perfil
    const [state, setState] = useState<State>({
        user: null,
        loading: true,
        error: null,
    })

    // Obtiene el usuario autenticado desde /me
    const refresh = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }))
        try {
            const user = await meService.getMe()
            setState({ user, loading: false, error: null })
        } catch (e: any) {
            // Mensaje seguro para UI
            const message =
                e?.response?.data?.message ||
                e?.message ||
                'No se pudo cargar el perfil'
            setState({ user: null, loading: false, error: message })
        }
    }, [])

    // Carga automática del perfil al montar
    useEffect(() => {
        refresh()
    }, [refresh])

    return {
        user: state.user,
        loading: state.loading,
        error: state.error,
        refresh,
    }
}
