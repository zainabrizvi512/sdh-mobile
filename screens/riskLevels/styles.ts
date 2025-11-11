import { StyleSheet } from "react-native";

// palette tuned to your UI (same family as your red alert banner & cards)
export const LEVEL_COLORS: Record<1 | 2 | 3 | 4 | 5, string> = {
    1: "#22c55e", // green 500
    2: "#facc15", // yellow 400
    3: "#f59e0b", // amber 500
    4: "#ef4444", // red 500
    5: "#991b1b", // red 900 (deep)
};

export const styles = StyleSheet.create({
    headerWrap: {
        backgroundColor: "#ef4444", // matches the red ticker header vibe
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        margin: 16,
    },
    headerText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
    },
    listPad: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 14,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    badge: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        marginBottom: 10,
    },
    badgeText: {
        fontWeight: "700",
        fontSize: 12,
        letterSpacing: 0.2,
    },
    title: {
        color: "#0b0f14",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 4,
    },
    titleEm: { color: "#0b0f14", fontWeight: "800" },
    desc: {
        color: "#30363f",
        fontSize: 14,
        lineHeight: 20,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 12,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 6,
    },
    meta: { color: "#667085", fontSize: 12 },
    hex: { color: "#111827", fontSize: 12, fontWeight: "700", marginLeft: "auto" },
    cta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 8,
        marginTop: 8,
    },
    ctaText: { color: "#0a84ff", fontWeight: "700" },
});
