import { GREEN, TEXT_DARK, TEXT_MUTED } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 0,
        paddingBottom: 16,
    },

    // Top content takes available space; footer will sit at bottom
    topContent: {
        // let content grow, but not push footer
        flexGrow: 1,
    },

    // Curved oval-bottom image
    heroWrap: {
        width,
        // keep it tall but not excessively: ~60% of screen height
        height: Math.min(width * 0.9, height * 0.6),
        marginHorizontal: -20,
        backgroundColor: "#ddd",
        overflow: "hidden",
        borderBottomLeftRadius: width * 0.75,
        borderBottomRightRadius: width * 0.75,
        marginBottom: 30,
    },
    heroImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },

    title: {
        textAlign: "center",
        fontSize: 22,
        lineHeight: 28,
        fontWeight: "700",
        color: TEXT_DARK,
        paddingHorizontal: 10,
    },
    subtitle: {
        marginTop: 10,
        textAlign: "center",
        fontSize: 14,
        lineHeight: 20,
        color: TEXT_MUTED,
        paddingHorizontal: 10,
    },

    // Footer pinned to bottom
    footer: {
        marginTop: "auto",          // pushes footer to the bottom
        paddingTop: 12,
    },
    button: {
        alignSelf: "center",
        backgroundColor: GREEN,
        paddingVertical: 14,
        paddingHorizontal: 36,
        borderRadius: 28,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    dotsRow: {
        marginTop: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#c7c7c7",
    },
    dotActive: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: GREEN,
    },

    footerLink: { color: GREEN, fontSize: 13, fontWeight: "800" },
    footerRow: {
        marginTop: 18,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
    },
    footerText: { fontSize: 13, color: TEXT_MUTED },
});
