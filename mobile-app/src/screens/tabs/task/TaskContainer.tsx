import React, {useEffect, useState} from 'react'
import {Alert, FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import { useTasks } from '../../../hooks/useTasks'
import { COLORS, Statuses } from '../../../constants'
import CreateTaskModal from '../../../components/CreateTaskModal'
import { Pen, Trash2 } from 'lucide-react-native'

export default function TasksContainer() {
    const { tasks, loading, error, refresh, createTask, updateTask, deleteTask } = useTasks()

    const [modalVisible, setModalVisible] = useState(false)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
    const [saving, setSaving] = useState(false)

    const [query, setQuery] = useState('')

    useEffect(() => {
        refresh()
    }, []);

    const filteredTasks = tasks.filter(t => {
        const q = query.trim().toLowerCase()
        if (!q) return true
        const title = (t.title ?? '').toLowerCase()
        const desc = (t.description ?? '').toLowerCase()
        return title.includes(q) || desc.includes(q)
    })

    const [editingTask, setEditingTask] = useState<null | {
        id: string | number
        title: string
        description?: string | null
        status: Statuses
    }>(null)

    const openCreate = () => {
        setEditingTask(null)
        setModalMode('create')
        setModalVisible(true)
    }

    const openEdit = (task: any) => {
        setEditingTask(task)
        setModalMode('edit')
        setModalVisible(true)
    }

    const handleSubmit = async (payload: { title: string; description: string; status: Statuses }) => {
        try {
            setSaving(true)
            if (modalMode === 'create') {
                await createTask(payload)
            } else {
                if (!editingTask) return
                await updateTask(editingTask.id, payload)
            }
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = (taskId: string | number) => {
        Alert.alert('Eliminar tarea', '¿Seguro que deseas eliminar esta tarea?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteTask(taskId)
                    } catch (e) {
                        
                    }
                }
            }
        ])
    }

    return (
        <View style={styles.root}>
            <FlatList
                data={filteredTasks}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.listContent}
                refreshing={loading}
                onRefresh={refresh}
                ListHeaderComponent={
                    <>
                        <Text style={styles.headerTitle}>Tus tareas</Text>

                        <View style={styles.searchBox}>
                            <TextInput
                                value={query}
                                onChangeText={setQuery}
                                placeholder="Buscar por título o descripción…"
                                placeholderTextColor={COLORS.placeholder}
                                style={styles.searchInput}
                                autoCorrect={false}
                                autoCapitalize="none"
                                clearButtonMode="while-editing"
                            />
                        </View>

                        {!!error && <Text style={styles.errorText}>{error}</Text>}
                    </>
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardTopRow}>
                            <View style={styles.leftCol}>
                                <Text style={styles.taskTitle} numberOfLines={1}>
                                    {item.title}
                                </Text>

                                {!!item.description && (
                                    <Text style={styles.taskDesc} numberOfLines={2}>
                                        {item.description}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.rightCol}>
                                <StatusBadge status={item.status} />

                                <View style={styles.iconsRow}>
                                    <TouchableOpacity
                                        onPress={() => handleDelete(item.id)}
                                        style={[styles.iconBtn, styles.deleteBtn]}
                                    >
                                        <Trash2 size={16} color={COLORS.error} />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => openEdit(item)}
                                        style={[styles.iconBtn, styles.editBtn]}
                                    >
                                        <Pen size={16} color={COLORS.primaryDark} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                ListEmptyComponent={
                    !loading ? (
                        <Text style={styles.emptyText}>No tienes tareas aún. Crea la primera con el botón +</Text>
                    ) : null
                }
            />

            {/* FAB */}
            <Pressable style={styles.fab} onPress={openCreate}>
                <Text style={styles.fabText}>＋</Text>
            </Pressable>

            <CreateTaskModal
                visible={modalVisible}
                loading={saving}
                mode={modalMode}
                initialTask={
                    editingTask
                        ? { title: editingTask.title, description: editingTask.description ?? '', status: editingTask.status }
                        : undefined
                }
                onClose={() => setModalVisible(false)}
                onSubmit={handleSubmit}
            />
        </View>
    )
}


function StatusBadge({ status }: { status: Statuses }) {
    const label =
        status === Statuses.pending ? 'Pendiente' :
            status === Statuses.inProgress ? 'En progreso' :
                'Completada'

    const bg =
        status === Statuses.completed ? '#DCFCE7' :
            status === Statuses.inProgress ? '#FEF9C3' :
                '#E0F2FE'

    const color =
        status === Statuses.completed ? '#166534' :
            status === Statuses.inProgress ? '#854D0E' :
                '#075985'

    return (
        <View style={[styles.badge, { backgroundColor: bg }]}>
            <Text style={[styles.badgeText, { color }]}>{label}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: COLORS.background },
    listContent: { padding: 16, paddingBottom: 120 },

    headerTitle: { fontSize: 24, fontWeight: '900', color: COLORS.text, marginBottom: 10 },
    errorText: { color: COLORS.error, fontWeight: '700', marginBottom: 10 },

    card: {
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        padding: 14,
        marginBottom: 12
    },

    badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
    badgeText: { fontWeight: '900', fontSize: 12 },

    emptyText: { color: COLORS.muted, textAlign: 'center', marginTop: 22, fontWeight: '700' },

    fab: {
        position: 'absolute',
        right: 18,
        bottom: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 4
    },
    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12
    },

    leftCol: {
        flex: 1,
        paddingRight: 8
    },

    rightCol: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        minWidth: 90
    },

    taskTitle: {
        color: COLORS.text,
        fontWeight: '900',
        fontSize: 16,
        lineHeight: 20
    },

    taskDesc: {
        marginTop: 6,
        color: COLORS.muted,
        fontSize: 14,
        lineHeight: 18
    },

    iconsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 10
    },

    iconBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: '#FFFFFF'
    },

    deleteBtn: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FECACA'
    },

    editBtn: {
        backgroundColor: '#EFF6FF',
        borderColor: '#BFDBFE'
    },
    searchBox: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12
    },
    searchInput: {
        color: COLORS.text,
        fontWeight: '700'
    },

    fabText: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginTop: -2 },
})
