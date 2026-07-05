import { BORDER, GREEN, MUTED, PRIMARY_BG, TEXT } from "@/constants/theme";
import { StyleSheet } from "react-native";

const BG_LIGHT = "#F4F7F4";

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG_LIGHT },
    scrollBody: { paddingHorizontal: 20, paddingBottom: 60 },

    backBtnWrap: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
    title: { fontSize: 26, fontWeight: "800", color: TEXT },
    subtitle: { color: MUTED, marginTop: 6, marginBottom: 18, fontSize: 13, lineHeight: 19 },

    center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
    emptyTitle: { fontSize: 16, fontWeight: "800", color: TEXT, marginTop: 14, textAlign: "center" },
    emptyBody: { fontSize: 13, color: MUTED, marginTop: 6, textAlign: "center", lineHeight: 19 },
    emptyBtn: { marginTop: 20, backgroundColor: GREEN, borderRadius: 24, paddingHorizontal: 22, paddingVertical: 12 },
    emptyBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },

    mapCard: {
        height: 320,
        borderRadius: 24,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: BORDER,
        marginBottom: 20,
    },
    map: { flex: 1 },

    markerPin: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: GREEN,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#fff",
        elevation: 4,
    },
    markerInitial: { color: "#fff", fontWeight: "800", fontSize: 14 },
    calloutBox: { padding: 6, minWidth: 120 },
    calloutTitle: { fontWeight: "700", color: TEXT, fontSize: 13 },
    calloutMeta: { color: MUTED, fontSize: 11, marginTop: 2 },

    sectionTitle: { fontSize: 11, fontWeight: "900", color: GREEN, letterSpacing: 1.2, marginBottom: 12 },

    card: { backgroundColor: PRIMARY_BG, borderRadius: 20, borderWidth: 1, borderColor: BORDER, marginBottom: 20 },
    memberRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14 },
    memberDivider: { height: 1, backgroundColor: BORDER },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#EFEFEF", alignItems: "center", justifyContent: "center", marginRight: 12 },
    avatarInitial: { fontWeight: "800", color: GREEN },
    memberName: { fontSize: 14, fontWeight: "700", color: TEXT },
    memberStatusRow: { flexDirection: "row", alignItems: "center", marginTop: 3 },
    statusDot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
    memberStatus: { fontSize: 12, color: MUTED },

    chatCta: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: GREEN,
        borderRadius: 20,
        paddingVertical: 14,
    },
    chatCtaText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
