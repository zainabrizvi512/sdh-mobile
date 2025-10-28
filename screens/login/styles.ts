import { BORDER, DANGER, GREEN, INPUT_BG, MUTED, PRIMARY_BG, TEXT } from "@/constants/theme";
import { horizontalScale, verticalScale } from "@/theme/responsive";
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
    container: {
        flex: 1,
        paddingHorizontal: horizontalScale(32),
    },
    title: {
        fontSize: 32,
        lineHeight: 38,
        fontWeight: "800",
        fontFamily: "inter",
        color: TEXT,
        marginTop: verticalScale(14),
    },
    subtitle: {
        color: MUTED,
        marginTop: 6,
        marginBottom: 18,
        fontSize: 14,
    },
    label: {
        color: TEXT,
        fontSize: 14,
        marginBottom: 8,
        fontWeight: "600",
    },
    input: {
        height: 48,
        borderRadius: 28,
        paddingHorizontal: 18,
        backgroundColor: INPUT_BG,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: BORDER,
        color: TEXT,
    },
    rowBetween: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    rememberWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#bdbdbd",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    checkboxChecked: {
        backgroundColor: GREEN,
        borderColor: GREEN,
    },
    rememberText: {
        color: MUTED,
        fontSize: 13,
    },
    forgot: {
        color: DANGER,
        fontSize: 13,
        fontWeight: "700",
    },
    primaryBtn: {
        flexDirection: "row",
        gap: 8,
        marginTop: verticalScale(16),
        height: 52,
        borderRadius: 28,
        backgroundColor: GREEN,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: Platform.select({ ios: 0.12, android: 0.2 }) as number,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    socialMediaBtn: {
        backgroundColor: PRIMARY_BG
    },
    primaryBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    socialBtn: {
        height: 50,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: BORDER,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 16,
    },
    socialText: {
        fontSize: 15,
        color: TEXT,
        fontWeight: "600",
    },
    footerRow: {
        marginTop: 'auto',        // ⬅️ pushes footer to bottom
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: Platform.select({ ios: verticalScale(22), android: verticalScale(26) }), // optional breathing room
    },
    footerText: { color: MUTED, fontSize: 13 },
    footerLink: { color: GREEN, fontSize: 13, fontWeight: "800" },
});
