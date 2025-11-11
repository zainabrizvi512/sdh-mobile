import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "space-between",
    },
    profileCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        alignItems: "center",
        paddingVertical: 40,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    email: {
        color: "#111827",
        fontSize: 16,
        fontWeight: "700",
    },
    city: {
        color: "#6b7280",
        fontSize: 14,
        marginTop: 4,
    },
    logoutBtn: {
        backgroundColor: "#ef4444",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 30,
    },
    logoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 8,
    },
});
