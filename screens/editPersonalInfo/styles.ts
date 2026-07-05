import { BORDER, GREEN, INPUT_BG, MUTED, PRIMARY_BG, TEXT } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const RADIUS = 28;

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: PRIMARY_BG },
    scrollContainer: { padding: 24, paddingBottom: 40 },

    backBtnWrap: { marginBottom: 8 },

    title: { fontSize: 30, fontWeight: "800", color: TEXT, marginTop: 6 },
    subtitle: { color: MUTED, marginTop: 6, marginBottom: 8 },

    avatarWrapper: { alignItems: "center", marginTop: 20 },
    avatar: {
        width: 108,
        height: 108,
        borderRadius: 54,
        backgroundColor: INPUT_BG,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: BORDER,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    avatarEditBadge: {
        position: "absolute",
        bottom: 0,
        right: "34%",
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: GREEN,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: PRIMARY_BG,
    },

    inputLabel: { fontWeight: "600", color: TEXT, marginBottom: 8 },
    input: {
        borderRadius: RADIUS,
        backgroundColor: INPUT_BG,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: BORDER,
        paddingHorizontal: 18,
        paddingVertical: 16,
        fontSize: 16,
        color: TEXT,
    },

    footer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 16,
        backgroundColor: PRIMARY_BG,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: BORDER,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: -2 },
        elevation: 8,
    },
    footerBtn: { height: 56, borderRadius: RADIUS, alignItems: "center", justifyContent: "center" },

    genderModalWrapper: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "flex-end" },
    genderModalBox: { backgroundColor: PRIMARY_BG, padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    genderItem: { paddingVertical: 14, paddingHorizontal: 8, borderRadius: 12, marginVertical: 4 },
});
