import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9F5F5", // soft pink-ish like the mock
    },

    /** Header */
    header: {
        paddingHorizontal: 12,
        paddingBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    headerCenter: {
        flex: 1,
        marginLeft: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    groupAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    groupTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    groupSubtitle: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 2,
    },
    headerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    headerIconBtn: {
        padding: 8,
        borderRadius: 12,
    },

    /** Date Pill */
    datePillWrap: {
        alignSelf: "center",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
    datePillText: {
        fontSize: 12,
        color: "#6B7280",
    },

    /** Message Row */
    row: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 8,
    },
    rowLeft: {
        justifyContent: "flex-start",
    },
    rowRight: {
        justifyContent: "flex-end",
    },

    /** Avatar + Bubble Holder */
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    bubbleWrap: {
        maxWidth: "80%",
    },
    bubbleWrapLeft: {
        alignItems: "flex-start",
    },
    bubbleWrapRight: {
        alignItems: "flex-end",
    },
    name: {
        fontSize: 12,
        color: "#4B5563",
        marginBottom: 4,
        marginLeft: 4,
    },

    /** Bubbles */
    bubble: {
        borderRadius: 14,
        paddingVertical: 8,
        paddingHorizontal: 10,
        minHeight: 38,
        justifyContent: "center",
    },
    bubbleOther: {
        backgroundColor: "#EFEFEF",
        borderTopLeftRadius: 4,
    },
    bubbleMe: {
        backgroundColor: "#1D6532", // deep green
        borderTopRightRadius: 4,
    },
    msgText: {
        fontSize: 14,
        lineHeight: 20,
    },
    msgTextOther: {
        color: "#111827",
    },
    msgTextMe: {
        color: "#FFFFFF",
    },

    /** Meta (time + ticks) */
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },
    timeText: {
        fontSize: 11,
    },
    timeTextOther: {
        color: "#6B7280",
    },
    timeTextMe: {
        color: "#E6F4EA",
    },

    /** Composer */
    composerWrap: {
        paddingHorizontal: 12,
        paddingTop: 8,
        backgroundColor: "transparent",
    },
    composerBar: {
        backgroundColor: "rgba(255,255,255,0.85)",
        borderRadius: 16,
        paddingHorizontal: 8,
        paddingVertical: 6,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    iconBtn: {
        padding: 6,
        borderRadius: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 6,
        paddingHorizontal: 8,
        fontSize: 14,
        color: "#111827",
    },
    sendBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#1D6532",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 4,
    },
});
