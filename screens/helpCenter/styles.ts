import { BORDER, GREEN, MUTED, PRIMARY_BG, TEXT } from "@/constants/theme";
import { StyleSheet } from "react-native";

const BG_LIGHT = "#F4F7F4";

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG_LIGHT },
    scrollBody: { padding: 24, paddingBottom: 60 },

    backBtnWrap: { marginBottom: 12, },
    title: { fontSize: 26, fontWeight: "800", color: TEXT },
    subtitle: { color: MUTED, marginTop: 6, marginBottom: 20, fontSize: 13, lineHeight: 19 },

    sectionTitle: { fontSize: 11, fontWeight: "900", color: GREEN, letterSpacing: 1.2, marginBottom: 12 },

    quickRow: { flexDirection: "row", gap: 10, marginBottom: 26 },
    quickCard: {
        flex: 1,
        backgroundColor: PRIMARY_BG,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: BORDER,
        alignItems: "center",
        paddingVertical: 16,
    },
    quickIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(15, 76, 58,0.08)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    quickLabel: { fontSize: 12, fontWeight: "700", color: TEXT },

    card: {
        backgroundColor: PRIMARY_BG,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: BORDER,
        marginBottom: 24,
        overflow: "hidden",
    },
    faqRow: { paddingHorizontal: 16, paddingVertical: 16 },
    faqQuestionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    faqQuestion: { flex: 1, fontSize: 14, fontWeight: "700", color: TEXT, marginRight: 10 },
    faqAnswer: { fontSize: 13, color: MUTED, marginTop: 10, lineHeight: 19 },
    divider: { height: 1, backgroundColor: BORDER },

    contactBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: GREEN,
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 18,
        justifyContent: "center",
        gap: 10,
    },
    contactBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
