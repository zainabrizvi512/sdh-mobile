import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  card: {
    width: "86%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  label: { fontSize: 13, color: "#6B7280", marginBottom: 6 },

  tabsWrap: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    padding: 4,
    gap: 6,
  },
  tab: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  tabText: { fontSize: 13, color: "#6B7280", fontWeight: "600" },
  tabTextActive: { color: "#111827" },

  input: {
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F5F6F8",
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#EEF0F3",
  },

  primaryBtn: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "#1F6F3D", // deep green to match your mock
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
