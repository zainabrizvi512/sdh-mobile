import { BORDER, GREEN, MUTED, PRIMARY_BG, TEXT } from "@/constants/theme";
import { StyleSheet } from "react-native";

const BG_LIGHT = "#F4F7F4";

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG_LIGHT },
    markAllText: { color: "#FFF", fontWeight: "700", fontSize: 13, textDecorationLine: "underline" },

    center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 },
    emptyIconCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: "rgba(15,76,58,0.08)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
    },
    emptyTitle: { fontSize: 17, fontWeight: "800", color: TEXT },
    emptyText: { color: MUTED, marginTop: 6, fontSize: 13, textAlign: "center", lineHeight: 19 },

    listBody: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },

    card: {
        flexDirection: "row",
        backgroundColor: PRIMARY_BG,
        borderRadius: 18,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: BORDER,
    },
    cardUnread: {
        borderColor: GREEN,
        backgroundColor: "rgba(15,76,58,0.04)",
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "rgba(15,76,58,0.08)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    cardTitle: { fontSize: 14, fontWeight: "700", color: TEXT },
    cardBody: { fontSize: 12, color: MUTED, marginTop: 2 },
    cardTime: { fontSize: 10, color: MUTED, marginTop: 6 },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: GREEN,
        marginLeft: 8,
        marginTop: 4,
    },
});
