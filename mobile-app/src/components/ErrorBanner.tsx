import React from 'react'
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { AlertTriangle, Info, XCircle } from 'lucide-react-native'
import {COLORS} from "../constants";

type Variant = 'error' | 'warning' | 'info'

type Props = {
    title?: string
    message: string
    variant?: Variant
    actionLabel?: string
    onActionPress?: () => void
    onDismiss?: () => void
    style?: ViewStyle
}

export default function ErrorBanner({
                                        title,
                                        message,
                                        variant = 'error',
                                        actionLabel,
                                        onActionPress,
                                        onDismiss,
                                        style,
                                    }: Props) {
    const Icon = variant === 'error' ? XCircle : variant === 'warning' ? AlertTriangle : Info

    const bg =
        variant === 'error' ? '#FEF2F2' : variant === 'warning' ? '#FFFBEB' : '#EFF6FF'

    const border =
        variant === 'error' ? '#FECACA' : variant === 'warning' ? '#FDE68A' : '#BFDBFE'

    const iconColor =
        variant === 'error' ? COLORS.error : variant === 'warning' ? '#B45309' : COLORS.primaryDark

    const titleText = title ?? (variant === 'error' ? 'Ups…' : variant === 'warning' ? 'Atención' : 'Info')

    return (
        <View style={[styles.root, { backgroundColor: bg, borderColor: border }, style]}>
            <View style={styles.left}>
                <Icon size={18} color={iconColor} />
            </View>

            <View style={styles.body}>
                <Text style={styles.title}>{titleText}</Text>
                <Text style={styles.message}>{message}</Text>

                {!!actionLabel && !!onActionPress && (
                    <Pressable onPress={onActionPress} style={styles.actionBtn}>
                        <Text style={styles.actionText}>{actionLabel}</Text>
                    </Pressable>
                )}
            </View>

            {!!onDismiss && (
                <Pressable onPress={onDismiss} hitSlop={10} style={styles.closeBtn}>
                    <Text style={styles.closeText}>×</Text>
                </Pressable>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        gap: 10,
        borderWidth: 1,
        padding: 12,
        borderRadius: 14,
    },
    left: { paddingTop: 2 },
    body: { flex: 1 },
    title: { fontWeight: '900', color: COLORS.text, marginBottom: 2 },
    message: { color: COLORS.muted, fontWeight: '700', lineHeight: 18 },
    actionBtn: { marginTop: 10, alignSelf: 'flex-start' },
    actionText: { color: COLORS.primaryDark, fontWeight: '900' },
    closeBtn: { paddingHorizontal: 6, paddingVertical: 2 },
    closeText: { fontSize: 20, fontWeight: '900', color: COLORS.muted },
})
