import React, { useEffect, useMemo, useState } from 'react'
import {
    ActivityIndicator,
    Keyboard,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import { COLORS, Statuses } from '../constants'
import ErrorBanner from "./ErrorBanner";

type InitialTask = {
    title: string
    description?: string | null
    status: Statuses
}

type Props = {
    visible: boolean
    loading?: boolean
    mode: 'create' | 'edit'
    initialTask?: InitialTask
    apiError?: string
    onDismissApiError?: () => void
    onClose: () => void
    onSubmit: (payload: { title: string; description: string; status: Statuses }) => Promise<void> | void
}

export default function CreateTaskModal({
                                            visible,
                                            loading = false,
                                            mode,
                                            initialTask,
                                            onDismissApiError,
                                            onClose,
                                            onSubmit
                                        }: Props) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState<Statuses>(Statuses.pending)
    const [touched, setTouched] = useState(false)
    const [apiError, setApiError] = useState('')

    useEffect(() => {
        if (!visible) return
        setTitle(initialTask?.title ?? '')
        setDescription(initialTask?.description ?? '')
        setStatus(initialTask?.status ?? Statuses.pending)
        setTouched(false)
        setApiError('')
    }, [visible, initialTask, mode])

    const titleError = useMemo(() => {
        if (!touched) return ''
        if (!title.trim()) return 'El título es obligatorio'
        if (title.trim().length < 3) return 'Mínimo 3 caracteres'
        return ''
    }, [title, touched])

    const canSubmit = !loading && !!title.trim() && !titleError

    const handleClose = () => {
        onClose()
    }

    const handleSubmit = async () => {
        setTouched(true)
        setApiError('')
        if (!canSubmit) return

        try {
            await onSubmit({ title: title.trim(), description: description.trim(), status })
            onClose()
        } catch (e: any) {
            setApiError(e?.message ?? 'Ocurrió un error')
        }
    }

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.backdrop}>
                <TouchableWithoutFeedback onPress={() => {}} accessible={false}>
                <View style={styles.card}>
                    <Text style={styles.title}>{mode === 'create' ? 'Nueva tarea' : 'Editar tarea'}</Text>

                    {!!apiError && (
                        <View style={{ marginTop: 10 }}>
                            <ErrorBanner
                                variant="error"
                                title="No se pudo guardar"
                                message={apiError}
                                onDismiss={onDismissApiError}
                            />
                        </View>
                    )}

                    <View style={styles.field}>
                        <Text style={styles.label}>Título</Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            onBlur={() => setTouched(true)}
                            placeholder="Ej: Comprar insumos"
                            style={[styles.input, titleError ? styles.inputError : undefined]}
                            placeholderTextColor={COLORS.placeholder}
                        />
                        {!!titleError && <Text style={styles.errorText}>{titleError}</Text>}
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Descripción</Text>
                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Opcional"
                            multiline
                            style={[styles.input, styles.textArea]}
                            placeholderTextColor={COLORS.placeholder}
                        />
                    </View>

                    <View style={styles.field}>
                        {
                            mode === 'create' ? null
                                : (
                                    <>
                                        <Text style={styles.label}>Estado</Text><View style={styles.chipsRow}>
                                        <Chip label="Pendiente" selected={status === Statuses.pending}
                                              onPress={() => setStatus(Statuses.pending)}/>
                                        <Chip label="En progreso" selected={status === Statuses.inProgress}
                                              onPress={() => setStatus(Statuses.inProgress)}/>
                                        <Chip label="Completada" selected={status === Statuses.completed}
                                              onPress={() => setStatus(Statuses.completed)}/>
                                    </View>
                                    </>
                                )
                        }
                    </View>

                    {!!apiError && <Text style={styles.apiError}>{apiError}</Text>}

                    <View style={styles.actionsRow}>
                        <Pressable onPress={handleClose} style={[styles.btn, styles.btnSecondary]}>
                            <Text style={[styles.btnText, styles.btnSecondaryText]}>Cancelar</Text>
                        </Pressable>

                        <Pressable onPress={handleSubmit} disabled={!canSubmit} style={[styles.btn, !canSubmit ? styles.btnDisabled : undefined]}>
                            {loading ? <ActivityIndicator /> : <Text style={styles.btnText}>{mode === 'create' ? 'Crear' : 'Guardar'}</Text>}
                        </Pressable>
                    </View>
                </View>
                </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
    return (
        <Pressable onPress={onPress} style={[styles.chip, selected ? styles.chipSelected : undefined]}>
            <Text style={[styles.chipText, selected ? styles.chipTextSelected : undefined]}>{label}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18
    },
    card: {
        width: '100%',
        maxWidth: 520,
        backgroundColor: COLORS.card,
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    title: { fontSize: 22, fontWeight: '900', color: COLORS.text },
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
    textArea: { minHeight: 80, textAlignVertical: 'top' },
    inputError: { borderColor: 'rgba(239,68,68,0.7)' },
    errorText: { marginTop: 8, color: COLORS.error, fontWeight: '700' },

    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: '#FFFFFF'
    },
    chipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    chipText: { color: COLORS.text, fontWeight: '800' },
    chipTextSelected: { color: '#FFFFFF' },

    apiError: { marginTop: 10, color: COLORS.error, fontWeight: '700' },
    actionsRow: { marginTop: 16, flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
    btn: {
        backgroundColor: COLORS.primary,
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 16,
        minWidth: 110,
        alignItems: 'center'
    },
    btnDisabled: { opacity: 0.6 },
    btnText: { color: '#FFFFFF', fontWeight: '900' },
    btnSecondary: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: COLORS.border },
    btnSecondaryText: { color: COLORS.primaryDark }
})
