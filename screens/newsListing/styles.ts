import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 8,
        justifyContent: "space-between",
    },
    headerCenter: {
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#101828",
    },
    onlineRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#22C55E",
        marginRight: 6,
    },
    onlineText: {
        fontSize: 12,
        color: "#9CA3AF",
    },

    searchWrap: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 6,
        borderRadius: 16,
        backgroundColor: "#F3F4F6",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        height: 40,
        ...(Platform.OS === "ios"
            ? { shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }
            : { elevation: 1 }),
    },
    searchIcon: { marginRight: 6 },
    searchInput: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 8,
        color: "#111827",
    },
    clearBtn: { paddingLeft: 6 },

    listContent: {
        paddingHorizontal: 16,
        paddingTop: 6,
        paddingBottom: 20,
    },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    itemSubtitle: {
        marginTop: 2,
        fontSize: 12,
        color: "#9CA3AF",
    },
    separator: {
        height: 1,
        backgroundColor: "#F1F5F9",
        marginLeft: 52, // aligns under text, not avatar
    },
});
