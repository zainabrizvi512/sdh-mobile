import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1, position: "relative" },
    loader: { flex: 1, alignItems: "center", justifyContent: "center" },
    headerOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        elevation: 10,
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
