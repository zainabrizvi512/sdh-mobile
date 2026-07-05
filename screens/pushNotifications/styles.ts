import { BORDER, GREEN, MUTED, PRIMARY_BG, TEXT } from "@/constants/theme";
import { StyleSheet } from "react-native";

const BG_LIGHT = "#F4F7F4";

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG_LIGHT },
    scrollBody: { padding: 24, paddingBottom: 60 },

    center: { flex: 1, alignItems: "center", justifyContent: "center" },

    backBtnWrap: { marginBottom: 12 },
    title: { fontSize: 26, fontWeight: "800", color: TEXT },
    subtitle: { color: MUTED, marginTop: 6, marginBottom: 20, fontSize: 13, lineHeight: 19 },

    card: {
        backgroundColor: PRIMARY_BG,
        borderRadius: 24,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderColor: BORDER,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
    },
    rowIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: "rgba(15, 76, 58,0.08)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    rowTitle: { fontSize: 15, fontWeight: "700", color: TEXT },
    rowMeta: { fontSize: 12, color: MUTED, marginTop: 2 },
    divider: { height: 1, backgroundColor: BORDER },

    note: {
        marginTop: 18,
        fontSize: 12,
        color: MUTED,
        lineHeight: 18,
    },
    noteHighlight: { color: GREEN, fontWeight: "700" },
});
