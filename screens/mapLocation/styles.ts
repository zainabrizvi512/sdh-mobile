import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1 },
    loader: { flex: 1, alignItems: "center", justifyContent: "center" },
    fab: {
        position: "absolute",
        right: 16,
        bottom: 32,
        backgroundColor: "white",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 24,
        elevation: 3,
    },
    fabText: { fontWeight: "600" },
});
