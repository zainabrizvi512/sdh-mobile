import { BORDER, GREEN, INPUT_BG, MUTED, PRIMARY_BG, TEXT } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const PRIMARY = GREEN;
export const RADIUS = 28;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_BG,
  },

  scrollContainer: {
    padding: 24,
    paddingBottom: 40, // extra padding added again via component to reach ~120
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: TEXT,
    marginTop: 6,
  },

  subtitle: {
    color: MUTED,
    marginTop: 6,
  },

  avatarWrapper: {
    alignItems: "center",
    marginTop: 24,
  },

  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: INPUT_BG,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  inputLabel: {
    fontWeight: "600",
    color: TEXT,
    marginBottom: 8,
  },

  input: {
    borderRadius: RADIUS,
    backgroundColor: INPUT_BG,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: TEXT,
  },

  // ---------- Sticky footer ----------
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    // Android elevation
    elevation: 8,
  },

  footerBtn: {
    height: 56,
    borderRadius: RADIUS,
    alignItems: "center",
    justifyContent: "center",
  },

  // ---------- Gender modal ----------
  genderModalWrapper: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },

  genderModalBox: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  genderItem: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginVertical: 4,
  },

  // ---------- iOS Date picker sheet ----------
  iosSheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  iosSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 8,
  },
  iosSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  iosSheetBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  iosSheetBtnText: {
    fontSize: 16,
    color: TEXT,
  },
  iosSheetTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT,
  },
  iosPicker: {
    backgroundColor: "#FFFFFF",
  },
});
