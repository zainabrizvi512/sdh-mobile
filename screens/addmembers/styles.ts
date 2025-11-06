import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },

  searchWrap: {
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 40,
    ...(Platform.OS === "ios"
      ? { shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }
      : { elevation: 1 }),
  },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, fontSize: 15, color: "#111827", paddingVertical: 8 },
  clearBtn: { paddingLeft: 6 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  rowCenter: { flex: 1 },
  name: { fontSize: 16, color: "#111827", fontWeight: "600" },
  email: { marginTop: 2, fontSize: 12, color: "#9CA3AF" },

  separator: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 72, // under text, not avatar
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: { backgroundColor: "#1F6F3D", borderColor: "#1F6F3D" },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: "transparent",
  },
  primaryBtn: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "#1F6F3D",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
