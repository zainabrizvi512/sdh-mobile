// styles.ts
import { BORDER, GREEN, INPUT_BG, MUTED, TEXT } from "@/constants/theme";
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
    container: { flex: 1, paddingHorizontal: 22, paddingTop: 6, paddingBottom: 16 },

    // back: solid green circle w/ white chevron
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: GREEN,
        marginBottom: 8,
    },

    title: {
        fontSize: 34,
        lineHeight: 40,
        fontWeight: "800",
        color: TEXT,
        marginTop: 2,
    },
    subtitle: {
        marginTop: 8,
        marginBottom: 18,
        color: MUTED,
        fontSize: 14,
        lineHeight: 20,
    },

    // search pill
    searchWrap: {
        position: "relative",
        height: 48,
        borderRadius: 24,
        backgroundColor: INPUT_BG,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: BORDER,
        justifyContent: "center",
    },
    searchIcon: { position: "absolute", left: 16, zIndex: 1 },
    searchInput: { paddingLeft: 42, paddingRight: 16, color: TEXT, fontSize: 14 },

    // outline button centered content
    outlineBtn: {
        marginTop: 12,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#cfcfcf",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    outlineInner: { flexDirection: "row", alignItems: "center" },
    outlineBtnText: { color: GREEN, fontWeight: "700", fontSize: 14 },

    // section label
    sectionLabel: {
        marginTop: 18,
        marginBottom: 10,
        fontSize: 13,
        color: GREEN,
        fontWeight: "800",
    },

    // map card
    mapCard: {
        height: 180,
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E7E7E7",
        backgroundColor: "#f7f7f7",
        ...Platform.select({
            ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
            android: { elevation: 2 },
        }),
    },
    map: { flex: 1 },

    // primary CTA
    primaryBtn: {
        // marginTop: 26,   // ⬅ remove this
        marginTop: "auto", // ⬅ push to bottom
        height: 56,
        borderRadius: 28,
        backgroundColor: GREEN,
        alignItems: "center",
        justifyContent: "center",
        // safe shadow...
    },
    primaryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
