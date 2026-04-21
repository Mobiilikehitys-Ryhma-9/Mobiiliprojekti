import { StyleSheet } from "react-native";
import { colors, typography, spacing, borderRadius } from "./theme"

export const globalStyles = {
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.lg
    },

    center: {
        justifyContent: 'center' as 'center',
        alignItems: 'center' as 'center'
    },

    heading: {
        ...typography.heading,
        color: colors.textPrimary,
        marginBottom: spacing.lg
    },

    text: {
        color: colors.textPrimary,
        fontSize: 16
    },

    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderTopLeftRadius: borderRadius.medium,
        borderTopRightRadius: borderRadius.medium,
        padding: spacing.md,
        fontSize: 16,
        backgroundColor: colors.background,
        marginBottom: spacing.lg,
        width: '100%' as const
    },
    
    button: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.small,
        alignItems: 'center' as 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold' as 'bold'
    },

    link: {
        color: colors.primary,
        fontSize: 16,
        textDecorationLine: 'underline' as 'underline',
        marginBottom: spacing.lg
    },

    card: {
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: borderRadius.medium,
        marginBottom: spacing.lg
    },

    row: {
        flexDirection: 'row' as 'row',
        alignItems: 'center' as 'center'
    }
}