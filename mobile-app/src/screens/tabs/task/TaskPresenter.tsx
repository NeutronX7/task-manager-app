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
import { COLORS, Statuses } from '../../../constants'

type Props = {
    mode: 'create' | 'edit'
    title: string
    description: string
    status: Statuses
    loading: boolean

    titleError?: string
    descriptionError?: string
    apiError?: string

    onChangeTitle: (v: string) => void
    onChangeDescription: (v: string) => void
    onChangeStatus: (v: Statuses) => void

    onBlurTitle: () => void
    onBlurDescription: () => void

    onSubmit: () => void
    onDelete?: () => void
    onCancel?: () => void
}

export default function TaskPresenter({
                                          mode,
                                          title,
                                          description,
                                          status,
                                          loading,
                                          titleError,
                                          descriptionError,
                                          apiError,
                                          onChangeTitle,
                                          onChangeDescription,
                                          onChangeStatus,
                                          onBlurTitle,
                                          onBlurDescription,
                                          onSubmit,
                                          onDelete,
                                          onCancel
                                      }: Props) {
    const canSubmit =
        !loading &&
        !!title.trim() &&
        !titleError &&
        !descriptionError

    return (
        <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.card}>
                <Text style={styles.title}>{mode === 'create' ? 'Nueva tarea' : 'Editar tarea'}</Text>
                <Text style={styles.subtitle}>
                    {mode === 'create' ? 'Crea una tarea y asigna su estado.' : 'Actualiza los datos o cambia el estado.'}
                </Text>

                <View style={styles.field}>
                    <Text style={styles.label}>Título</Text>
                    <TextInput
                        value={title}
                        onChangeText={onChangeTitle}
                        onBlur={onBlurTitle}
                        placeholder="Ej: Llamar al cliente"
                        autoCapitalize="sentences"
                        style={[styles.input, titleError ? styles.inputError : undefined]}
                        placeholderTextColor={COLORS.placeholder}
                    />
                    {!!titleError && <Text style={styles.errorText}>{titleError}</Text>}
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Descripción</Text>
                    <TextInput
                        value={description}
                        onChangeText={onChangeDescription}
                        onBlur={onBlurDescription}
                        placeholder="mas detalle"
                        autoCapitalize="sentences"
                        multiline
                        style={[
                            styles.input,
                            styles.textArea,
                            descriptionError ? styles.inputError : undefined
                        ]}
                        placeholderTextColor={COLORS.placeholder}
                    />
                    {!!descriptionError && <Text style={styles.errorText}>{descriptionError}</Text>}
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Estado</Text>

                    <View style={styles.chipsRow}>
                        <Chip
                            label="Pendiente"
                            selected={status === Statuses.pending}
                            onPress={() => onChangeStatus(Statuses.pending)}
                        />
                        <Chip
                            label="En progreso"
                            selected={status === Statuses.inProgress}
                            onPress={() => onChangeStatus(Statuses.inProgress)}
                        />
                        <Chip
                            label="Completada"
                            selected={status === Statuses.completed}
                            onPress={() => onChangeStatus(Statuses.completed)}
                        />
                    </View>
                </View>

                {!!apiError && <Text style={styles.apiError}>{apiError}</Text>}

                <View style={styles.actionsRow}>
                    {!!onCancel && (
                        <Pressable onPress={onCancel} style={[styles.button, styles.secondaryBtn]}>
                            <Text style={[styles.buttonText, styles.secondaryText]}>Cancelar</Text>
                        </Pressable>
                    )}

                    <Pressable
                        onPress={onSubmit}
                        disabled={!canSubmit}
                        style={[styles.button, !canSubmit ? styles.buttonDisabled : undefined]}
                    >
                        {loading ? (
                            <ActivityIndicator />
                        ) : (
                            <Text style={styles.buttonText}>{mode === 'create' ? 'Guardar' : 'Guardar cambios'}</Text>
                        )}
                    </Pressable>
                </View>

                {mode === 'edit' && !!onDelete && (
                    <Pressable onPress={onDelete} style={styles.dangerBtn}>
                        <Text style={styles.dangerText}>Eliminar tarea</Text>
                    </Pressable>
                )}
            </View>
        </KeyboardAvoidingView>
    )
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.chip,
                selected ? styles.chipSelected : undefined
            ]}
        >
            <Text style={[styles.chipText, selected ? styles.chipTextSelected : undefined]}>
                {label}
            </Text>
        </Pressable>
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
        maxWidth: 480,
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
    title: { fontSize: 26, fontWeight: '800', color: COLORS.text },
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
    textArea: {
        minHeight: 92,
        textAlignVertical: 'top'
    },
    inputError: { borderColor: 'rgba(239,68,68,0.7)' },
    errorText: { marginTop: 8, color: COLORS.error, fontWeight: '700' },

    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10
    },
    chip: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: '#FFFFFF'
    },
    chipSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary
    },
    chipText: {
        color: COLORS.text,
        fontWeight: '800'
    },
    chipTextSelected: {
        color: '#FFFFFF'
    },

    apiError: {
        marginTop: 12,
        color: COLORS.error,
        fontWeight: '700'
    },

    actionsRow: {
        marginTop: 16,
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-end'
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        alignItems: 'center',
        minWidth: 140
    },
    buttonDisabled: { opacity: 0.55 },
    buttonText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },

    secondaryBtn: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: COLORS.border
    },
    secondaryText: {
        color: COLORS.primaryDark
    },

    dangerBtn: {
        marginTop: 14,
        paddingVertical: 12,
        alignItems: 'center'
    },
    dangerText: {
        color: COLORS.error,
        fontWeight: '900'
    }
})
