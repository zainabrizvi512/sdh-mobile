import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  searchWrap: {
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.12)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, fontSize: 14, color: "#FFF", fontWeight: "600", paddingVertical: 0 },
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
