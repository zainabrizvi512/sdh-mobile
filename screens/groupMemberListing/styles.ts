import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  /* header */
  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },

  /* search */
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

  /* rows */
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  name: { fontSize: 16, fontWeight: "600", color: "#111827" },

  separator: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 72, // aligns under text, not avatar
  },

  /* badges */
  badge: {
    paddingHorizontal: 10,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 12, fontWeight: "700" },

  // role palettes
  badgeOwner: { backgroundColor: "#1F6F3D" },
  badgeOwnerText: { color: "#FFFFFF" },

  badgeAdmin: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#D1E4FF",
  },
  badgeAdminText: { color: "#1D4ED8" },

  badgeModerator: { backgroundColor: "#F1F0FF" },
  badgeModeratorText: { color: "#6D28D9" },
});
