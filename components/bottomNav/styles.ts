import { Platform, StyleSheet } from "react-native";
import { HEADER_GREEN } from "@/components/fancyAppHeader/styles";

export const BAR_HEIGHT = 64;
/** Use as scroll content paddingBottom on screens that show the bottom nav */
export const BOTTOM_NAV_SCROLL_PADDING = 100;

export const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -4 },
      },
      android: { elevation: 12 },
    }),
  },
  bar: {
    width: "100%",
    backgroundColor: HEADER_GREEN,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    paddingTop: 10,
    overflow: "hidden",
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  glow1: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(236,72,153,0.2)",
    top: -50,
    left: -20,
  },
  glow2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: -30,
    right: 40,
  },
  glow3: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(236,72,153,0.12)",
    top: -20,
    right: -10,
  },
  tabBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    minWidth: 56,
    gap: 3,
  },
  tabBtnActive: {
    backgroundColor: "#FFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 3 },
    }),
  },
  tabIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  tabIconWrapActive: {
    backgroundColor: "rgba(15,76,58,0.08)",
    borderColor: "transparent",
  },
  tabLabel: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: HEADER_GREEN,
    fontWeight: "900",
  },
});
