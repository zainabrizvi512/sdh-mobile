import { StyleSheet } from "react-native";

const GREEN = "#175B34";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F5F6" },

  header: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },

  /* quick emergency */
  quickRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  quickCard: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  quickRed: { backgroundColor: "#E94C4C" },
  quickLabel: { color: "#fff", fontWeight: "700", fontSize: 12, marginTop: 6 },
  quickNum: { color: "#fff", fontWeight: "900", fontSize: 13, marginTop: 2 },

  /* sections */
  sectionHeading: {
    marginTop: 14,
    marginBottom: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: "800",
    color: "#1F2937",
  },

  /* favourites */
  favRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  favItem: { width: "30%", alignItems: "center" },
  favAvatar: { width: 64, height: 64, borderRadius: 32, marginBottom: 6 },
  favName: { fontSize: 13, color: "#111827", fontWeight: "600", marginBottom: 6 },

  callPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: GREEN,
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 16,
  },
  callPillText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  /* list rows */
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  rowAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  rowName: { fontSize: 16, fontWeight: "600", color: "#111827" },
  rowPhone: { fontSize: 12, color: "#6B7280", marginTop: 2 },

  iconBtn: { paddingHorizontal: 8 },

  separator: {
    height: 1,
    backgroundColor: "#E9EDF1",
    marginLeft: 72,
  },

  /* bottom tab mock */
  bottomTabWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
  },
  bottomTab: {
    width: "100%",
    backgroundColor: GREEN,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
  },
  tabItem: { alignItems: "center", gap: 4 },
  tabText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
});
