import { BORDER, DANGER, GREEN, MUTED, PRIMARY_BG, TEXT } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: PRIMARY_BG },
    scrollBody: { padding: 24, paddingBottom: 60 },

    backBtnWrap: { marginBottom: 12 },
    title: { fontSize: 26, fontWeight: "800", color: TEXT },
    updated: { color: MUTED, marginTop: 6, marginBottom: 16, fontSize: 12 },

    draftBadge: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#FFF3E0",
        borderWidth: 1,
        borderColor: "#FFE0B2",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        marginBottom: 20,
    },
    draftBadgeText: { color: "#B45309", fontSize: 11, fontWeight: "800" },

    emergencyNotice: {
        backgroundColor: "#FFF0F0",
        borderWidth: 1,
        borderColor: "#FFD9D9",
        borderRadius: 16,
        padding: 14,
        marginBottom: 24,
    },
    emergencyNoticeTitle: { color: DANGER, fontWeight: "800", fontSize: 13, marginBottom: 4 },
    emergencyNoticeBody: { color: TEXT, fontSize: 12.5, lineHeight: 18 },

    section: { marginBottom: 22 },
    sectionTitle: { fontSize: 15, fontWeight: "800", color: TEXT, marginBottom: 8 },
    sectionBody: { fontSize: 13.5, color: MUTED, lineHeight: 21 },

    divider: { height: 1, backgroundColor: BORDER, marginVertical: 6 },

    footerNote: { fontSize: 12, color: MUTED, marginTop: 8, lineHeight: 18 },
    link: { color: GREEN, fontWeight: "700" },
});
