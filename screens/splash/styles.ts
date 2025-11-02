import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    drop: {
        position: "absolute",
        left: 0,
        top: 0,
    },
    centerWrap: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    brand: {
        fontSize: 36,
        fontWeight: "800",
        color: "#0C0C0C",
        letterSpacing: 0.5,
    },
    brandAccent: {
        marginTop: -2,
        fontSize: 28,
        fontWeight: "700",
        color: "#2FBF71",
        letterSpacing: 0.5,
    },
    tagline: {
        marginTop: 8,
        fontSize: 14,
        color: "#0C0C0CD1",
    },
    footer: {
        alignItems: "center",
        paddingBottom: 28,
    },
    subtitle: {
        fontSize: 12,
        color: "#7A7A7A",
    },
});
