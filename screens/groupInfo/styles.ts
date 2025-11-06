import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  /* header */
  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },

  /* avatar + name */
  centerWrap: { alignItems: "center", marginTop: 12, paddingHorizontal: 16 },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 10 },
  title: { fontSize: 20, fontWeight: "700", color: "#111827" },
  subtitle: { marginTop: 2, fontSize: 12, color: "#9CA3AF" },

  /* action buttons */
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  actionCard: {
    flex: 1,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  actionText: { fontSize: 13, color: "#1F2937", fontWeight: "600" },

  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 16,
    marginVertical: 18,
  },

  /* danger */
  dangerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dangerText: { color: "#DC2626", fontSize: 15, fontWeight: "600" },
});
