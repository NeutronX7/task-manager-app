import React from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import {COLORS} from "../../../constants";

type Props = {
    loading: boolean
    error: string | null
    name?: string
    email?: string
    onRefresh: () => void
    onLogout: () => void
}

export default function ProfilePresenter({
                                             loading,
                                             error,
                                             name,
                                             email,
                                             onRefresh,
                                             onLogout,
                                         }: Props) {
    if (loading) return <ActivityIndicator />

    return (
        <View style={styles.root}>
            <Text style={styles.title}>Perfil</Text>

            {error ? (
                <View style={styles.card}>
                    <Text style={styles.errorTitle}>Ups…</Text>
                    <Text style={styles.errorText}>{error}</Text>

                    <Pressable style={styles.btn} onPress={onRefresh}>
                        <Text style={styles.btnText}>Reintentar</Text>
                    </Pressable>
                </View>
            ) : (
                <View style={styles.card}>
                    <Text style={styles.label}>Nombre</Text>
                    <Text style={styles.value}>{name || '—'}</Text>

                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{email || '—'}</Text>

                    <View style={styles.row}>

                        <Pressable style={[styles.btn, styles.btnDanger]} onPress={onLogout}>
                            <Text style={styles.btnDangerText}>Cerrar sesión</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        backgroundColor: COLORS.background,
    },

    title: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 14,
        color: COLORS.text,
    },

    card: {
        padding: 16,
        borderRadius: 14,
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    label: {
        color: COLORS.muted,
        marginTop: 10,
        fontSize: 13,
        fontWeight: '500',
    },

    value: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
        marginTop: 2,
    },

    row: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 20,
        justifyContent: 'flex-end',
    },

    btn: {
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
    },

    btnDanger: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.error,
    },

    btnText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },

    btnDangerText: {
        color: COLORS.error,
        fontWeight: '700',
    },

    errorTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: '800',
    },

    errorText: {
        color: COLORS.error,
        marginTop: 6,
    },
})
