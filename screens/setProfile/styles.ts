import { StyleSheet } from "react-native";

export const PRIMARY = "#154617";
export const RADIUS = 24;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContainer: {
    padding: 24,
    paddingBottom: 40, // extra padding added again via component to reach ~120
  },

  backBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    marginTop: 6,
  },

  subtitle: {
    color: "#6B7280",
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
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  inputLabel: {
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    borderRadius: RADIUS,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#111827",
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
    borderTopColor: "#E5E7EB",
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
    borderBottomColor: "#E5E7EB",
  },
  iosSheetBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  iosSheetBtnText: {
    fontSize: 16,
    color: "#111827",
  },
  iosSheetTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  iosPicker: {
    backgroundColor: "#FFFFFF",
  },
});
