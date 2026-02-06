import React, { useMemo, useState } from 'react'
import LoginPresenter from './LoginPresenter'
import { useAuth } from '../../../store/auth/AuthContext'

type Props = {
    onGoToRegister: () => void
}

export default function LoginContainer({ onGoToRegister }: Props) {
    const { signIn } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [touched, setTouched] = useState({ email: false, password: false })
    const [apiError, setApiError] = useState('')
    const emailTrim = email.trim()
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)
    const isPasswordValid = password.trim().length > 0

    const emailError = useMemo(() => {
        if (!touched.email) return ''

        if (!email.trim()) return 'El correo es obligatorio'
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        return ok ? '' : 'Ingresa un correo válido'
    }, [email, touched.email])

    const passwordError = useMemo(() => {
        if (!touched.password) return ''
        if (!password) return 'La contraseña es obligatoria'
        return ''
    }, [password, touched.password])

    const canSubmit =
        !loading &&
        isEmailValid &&
        isPasswordValid

    const handleChangeEmail = (v: string) => {
        setEmail(v)
        if (apiError) setApiError('')
    }

    const handleChangePassword = (v: string) => {
        setPassword(v)
        if (apiError) setApiError('')
    }

    const handleSubmit = async () => {
        setApiError('')
        setTouched({ email: true, password: true })
        if (!canSubmit) return

        try {
            setLoading(true)
            await signIn(email.trim(), password)
        } catch (e: any) {
            const msg =
                e?.response?.data?.message ||
                e?.response?.data?.errors?.email?.[0] ||
                e?.message ||
                'No se pudo iniciar sesión'

            setApiError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <LoginPresenter
            email={email}
            password={password}
            showPassword={showPassword}
            loading={loading}
            emailError={emailError}
            passwordError={passwordError}
            apiError={apiError}
            onChangeEmail={setEmail}
            onChangePassword={setPassword}
            onBlurEmail={() => setTouched(t => ({ ...t, email: true }))}
            onBlurPassword={() => setTouched(t => ({ ...t, password: true }))}
            onToggleShowPassword={() => setShowPassword(s => !s)}
            onSubmit={handleSubmit}
            onPressRegister={onGoToRegister}
            onDismissApiError={() => setApiError('')}
        />
    )
}
