import React from 'react'
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native'
import {COLORS} from "../../../constants";

type Props = {
    email: string
    password: string
    showPassword: boolean
    loading: boolean

    emailError?: string
    passwordError?: string

    onChangeEmail: (v: string) => void
    onChangePassword: (v: string) => void
    onBlurEmail: () => void
    onBlurPassword: () => void

    onToggleShowPassword: () => void
    onSubmit: () => void

    onPressForgotPassword?: () => void
    onPressRegister?: () => void
}

export default function LoginPresenter({
                                           email,
                                           password,
                                           showPassword,
                                           loading,
                                           emailError,
                                           passwordError,
                                           onChangeEmail,
                                           onChangePassword,
                                           onBlurEmail,
                                           onBlurPassword,
                                           onToggleShowPassword,
                                           onSubmit,
                                           onPressForgotPassword,
                                           onPressRegister
                                       }: Props) {
    const canSubmit =
        !loading &&
        !!email.trim() &&
        password.length >= 6 &&
        !emailError &&
        !passwordError

    return (
        <KeyboardAvoidingView
            style={styles.root}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.card}>
                <Text style={styles.title}>Bienvenido</Text>
                <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

                <View style={styles.field}>
                    <Text style={styles.label}>Correo</Text>
                    <TextInput
                        value={email}
                        onChangeText={onChangeEmail}
                        onBlur={onBlurEmail}
                        placeholder="tu@correo.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        textContentType="emailAddress"
                        style={[styles.input, emailError ? styles.inputError : undefined]}
                        placeholderTextColor={COLORS.placeholder}
                    />
                    {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Contraseña</Text>

                    <View style={styles.passwordRow}>
                        <TextInput
                            value={password}
                            onChangeText={onChangePassword}
                            onBlur={onBlurPassword}
                            placeholder="••••••••"
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            textContentType="password"
                            style={[
                                styles.input,
                                styles.passwordInput,
                                passwordError ? styles.inputError : undefined
                            ]}
                            placeholderTextColor={COLORS.placeholder}
                        />

                        <Pressable onPress={onToggleShowPassword} style={styles.eyeButton} hitSlop={10}>
                            <Text style={styles.eyeText}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
                        </Pressable>
                    </View>

                    {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
                </View>

                <View style={styles.divider}/>

                <Pressable
                    onPress={onSubmit}
                    disabled={!canSubmit}
                    style={[styles.button, !canSubmit ? styles.buttonDisabled : undefined]}
                >
                    {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Iniciar sesión</Text>}
                </Pressable>

                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>¿No tienes cuenta?</Text>
                    <Pressable onPress={onPressRegister}>
                        <Text style={styles.footerLink}> Crear cuenta</Text>
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18
    },
    card: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: COLORS.card,
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.text
    },
    subtitle: {
        marginTop: 6,
        marginBottom: 14,
        color: COLORS.muted
    },
    field: { marginTop: 12 },
    label: {
        color: COLORS.text,
        marginBottom: 8,
        fontWeight: '700'
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        color: COLORS.text
    },
    inputError: {
        borderColor: 'rgba(239,68,68,0.7)'
    },
    errorText: {
        marginTop: 8,
        color: COLORS.error,
        fontWeight: '700'
    },
    passwordRow: { flexDirection: 'row', alignItems: 'center' },
    passwordInput: { flex: 1, paddingRight: 8 },
    eyeButton: { paddingHorizontal: 10, paddingVertical: 10 },
    eyeText: { color: COLORS.primaryDark, fontWeight: '800' },
    divider: { alignSelf: 'flex-end', marginTop: 10, marginBottom: 14 },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center'
    },
    buttonDisabled: { opacity: 0.55 },
    buttonText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
    footerRow: { marginTop: 14, flexDirection: 'row', justifyContent: 'center' },
    footerText: { color: COLORS.muted },
    footerLink: { color: COLORS.primaryDark, fontWeight: '900' }
})
