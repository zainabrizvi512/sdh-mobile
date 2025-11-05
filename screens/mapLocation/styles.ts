import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1, position: "relative" },
    loader: { flex: 1, alignItems: "center", justifyContent: "center" },
    headerRow: {
        flex: 1,
        flexDirection: "row"
    },
    headerOverlay: {
        position: "absolute",
        top: 22,           // adjust / combine with safe area if needed
        left: 12,
        right: 12,
        flexDirection: "row",
        alignItems: "center",
        zIndex: 10,
        elevation: 10,     // Android
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
        elevation: 3,
    },
    headerTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: "600",
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    fab: {
        position: "absolute",
        right: 16,
        bottom: 32,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 24,
        elevation: 4,
        zIndex: 10,
    },
    fabText: { fontWeight: "700" },
});
