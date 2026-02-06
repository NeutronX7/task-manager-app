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
import { COLORS } from '../../../constants'
import ErrorBanner from "../../../components/ErrorBanner";

type Props = {
    name: string
    email: string
    password: string
    showPassword: boolean
    loading: boolean

    nameError?: string
    emailError?: string
    passwordError?: string
    apiError?: string
    onDismissApiError?: () => void

    onChangeName: (v: string) => void
    onChangeEmail: (v: string) => void
    onChangePassword: (v: string) => void

    onBlurName: () => void
    onBlurEmail: () => void
    onBlurPassword: () => void

    onToggleShowPassword: () => void
    onSubmit: () => void

    onPressLogin?: () => void
}

export default function RegisterPresenter({
                                              name,
                                              email,
                                              password,
                                              showPassword,
                                              loading,
                                              nameError,
                                              emailError,
                                              passwordError,
                                              onChangeName,
                                              onChangeEmail,
                                              onChangePassword,
                                              onBlurName,
                                              onBlurEmail,
                                              onBlurPassword,
                                              onToggleShowPassword,
                                              onSubmit,
                                              onPressLogin,
                                              apiError,
                                              onDismissApiError
                                          }: Props) {
    const canSubmit =
        !loading &&
        !!name.trim() &&
        !!email.trim() &&
        password.length >= 6 &&
        !nameError &&
        !emailError &&
        !passwordError

    return (
        <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.card}>
                <Text style={styles.title}>Crear cuenta</Text>
                <Text style={styles.subtitle}>Regístrate para empezar</Text>

                {!!apiError && (
                    <View style={{ marginTop: 10, marginBottom: 4 }}>
                        <ErrorBanner
                            variant="error"
                            title="No se pudo crear la cuenta"
                            message={apiError}
                            onDismiss={onDismissApiError}
                        />
                    </View>
                )}

                <View style={styles.field}>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                        value={name}
                        onChangeText={onChangeName}
                        onBlur={onBlurName}
                        placeholder="Tu nombre"
                        autoCapitalize="words"
                        style={[styles.input, nameError ? styles.inputError : undefined]}
                        placeholderTextColor={COLORS.placeholder}
                    />
                    {!!nameError && <Text style={styles.errorText}>{nameError}</Text>}
                </View>

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
                            textContentType="newPassword"
                            style={[styles.input, styles.passwordInput, passwordError ? styles.inputError : undefined]}
                            placeholderTextColor={COLORS.placeholder}
                        />
                        <Pressable onPress={onToggleShowPassword} style={styles.eyeButton} hitSlop={10}>
                            <Text style={styles.eyeText}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
                        </Pressable>
                    </View>
                    {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
                </View>

                <Pressable
                    onPress={onSubmit}
                    disabled={!canSubmit}
                    style={[styles.button, !canSubmit ? styles.buttonDisabled : undefined]}
                >
                    {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Registrarme</Text>}
                </Pressable>

                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
                    <Pressable onPress={onPressLogin}>
                        <Text style={styles.footerLink}> Inicia sesión</Text>
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
    title: { fontSize: 28, fontWeight: '800', color: COLORS.text },
    subtitle: { marginTop: 6, marginBottom: 14, color: COLORS.muted },
    field: { marginTop: 12 },
    label: { color: COLORS.text, marginBottom: 8, fontWeight: '700' },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        color: COLORS.text
    },
    inputError: { borderColor: 'rgba(239,68,68,0.7)' },
    errorText: { marginTop: 8, color: COLORS.error, fontWeight: '700' },
    passwordRow: { flexDirection: 'row', alignItems: 'center' },
    passwordInput: { flex: 1, paddingRight: 8 },
    eyeButton: { paddingHorizontal: 10, paddingVertical: 10 },
    eyeText: { color: COLORS.primaryDark, fontWeight: '800' },
    button: {
        marginTop: 16,
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
