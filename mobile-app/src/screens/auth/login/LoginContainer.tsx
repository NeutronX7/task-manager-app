import React, { useMemo, useState } from 'react'
import LoginPresenter from './LoginPresenter'

type Props = {
    onLogin?: (email: string, password: string) => Promise<void> | void
    onGoToRegister?: () => void
    onForgotPassword?: () => void
}

export default function LoginContainer({ onLogin, onGoToRegister, onForgotPassword }: Props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [touched, setTouched] = useState({ email: false, password: false })

    const emailError = useMemo(() => {
        if (!touched.email) return ''
        if (!email.trim()) return 'El correo es obligatorio'
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        return ok ? '' : 'Ingresa un correo válido'
    }, [email, touched.email])

    const passwordError = useMemo(() => {
        if (!touched.password) return ''
        if (!password) return 'La contraseña es obligatoria'
        if (password.length < 6) return 'Mínimo 6 caracteres'
        return ''
    }, [password, touched.password])

    const canSubmit =
        !loading && !!email.trim() && password.length >= 6 && !emailError && !passwordError

    const handleSubmit = async () => {
        setTouched({ email: true, password: true })
        if (!canSubmit) return

        try {
            setLoading(true)
            await onLogin?.(email.trim(), password)
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
            onChangeEmail={setEmail}
            onChangePassword={setPassword}
            onBlurEmail={() => setTouched(t => ({ ...t, email: true }))}
            onBlurPassword={() => setTouched(t => ({ ...t, password: true }))}
            onToggleShowPassword={() => setShowPassword(s => !s)}
            onSubmit={handleSubmit}
            onPressRegister={onGoToRegister}
            onPressForgotPassword={onForgotPassword}
        />
    )
}
