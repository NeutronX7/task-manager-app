import React, { useMemo, useState } from 'react'
import RegisterPresenter from './RegisterPresenter'
import { useAuth } from '../../../store/auth/AuthContext'

type Props = {
    onGoToLogin: () => void
}

export default function RegisterContainer({ onGoToLogin }: Props) {
    const { signUp } = useAuth()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const [touched, setTouched] = useState({ name: false, email: false, password: false })
    const [apiError, setApiError] = useState('')

    const nameError = useMemo(() => {
        if (!touched.name) return ''
        if (!name.trim()) return 'El nombre es obligatorio'
        if (name.trim().length < 2) return 'Nombre muy corto'
        return ''
    }, [name, touched.name])

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
        !loading &&
        !!name.trim() &&
        !!email.trim() &&
        password.length >= 6 &&
        !nameError &&
        !emailError &&
        !passwordError

    const handleSubmit = async () => {
        setTouched({ name: true, email: true, password: true })
        setApiError('')
        if (!canSubmit) return

        try {
            setLoading(true)
            await signUp(name.trim(), email.trim(), password)
        } catch (e: any) {
            setApiError(e?.message ?? 'Error al registrarse')
        } finally {
            setLoading(false)
        }
    }

    return (
        <RegisterPresenter
            name={name}
            email={email}
            password={password}
            showPassword={showPassword}
            loading={loading}
            nameError={nameError}
            emailError={emailError}
            passwordError={passwordError || apiError}
            onChangeName={setName}
            onChangeEmail={setEmail}
            onChangePassword={setPassword}
            onBlurName={() => setTouched(t => ({ ...t, name: true }))}
            onBlurEmail={() => setTouched(t => ({ ...t, email: true }))}
            onBlurPassword={() => setTouched(t => ({ ...t, password: true }))}
            onToggleShowPassword={() => setShowPassword(s => !s)}
            onSubmit={handleSubmit}
            onPressLogin={onGoToLogin}
        />
    )
}
