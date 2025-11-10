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
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },

  title: {
    paddingHorizontal: 16,
    marginTop: 6,
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 26,
  },

  sourceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 8,
    gap: 8,
  },
  sourceIcon: { width: 18, height: 18, borderRadius: 3, backgroundColor: "#E5E7EB" },
  sourceName: { fontSize: 12, color: "#374151", fontWeight: "700" },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#9CA3AF" },
  timeAgo: { fontSize: 12, color: "#6B7280" },

  cover: {
    height: 160,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
  },

  body: {
    paddingHorizontal: 16,
    marginTop: 12,
    color: "#374151",
    fontSize: 14,
    lineHeight: 20,
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
