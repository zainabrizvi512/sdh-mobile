import { StyleSheet } from "react-native";

const GREEN = "#0E5A2F";
const CARD = "#FFFFFF";
const TEXT = "#1A1A1A";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  /* Alert */
  alertCard: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    alignItems: "flex-start",
  },
  alertIcon: { marginRight: 10, marginTop: 2 },
  alertTitle: { color: "#FFFFFF", fontWeight: "800", fontSize: 13, marginBottom: 2 },
  alertBody: { color: "#FFECEC", fontSize: 12, lineHeight: 16 },
  alertMeta: { color: "#FFF", fontWeight: "700" },

  /* Profile */
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    backgroundColor: CARD,
    borderRadius: 12,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 10 },
  name: { color: TEXT, fontSize: 16, fontWeight: "700" },
  location: { color: "#6B7280", fontSize: 12, marginTop: 2 },
  headerIconBtn: { marginLeft: 8 },

  /* Section headers */
  sectionHeaderRow: {
    marginTop: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { color: TEXT, fontSize: 15, fontWeight: "800" },
  linkText: { color: "#1D4ED8", fontWeight: "600", fontSize: 12 },

  /* Emergency */
  emergencyRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  emergencyCard: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC2626",
  },
  emRed: { backgroundColor: "#DC2626" },
  emLabel: { color: "#fff", marginTop: 6, fontSize: 12, fontWeight: "700" },
  emNumber: { color: "#fff", fontWeight: "900", marginTop: 2, fontSize: 13 },

  /* Guides */
  guideCard: {
    width: 150,
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  guideThumb: {
    height: 80,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    marginBottom: 8,
  },
  guideTitle: { color: TEXT, fontSize: 13, fontWeight: "700" },

  /* News */
  newsCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  newsThumb: { width: 56, height: 40, borderRadius: 8, backgroundColor: "#E5E7EB" },
  newsTitle: { color: TEXT, fontWeight: "800", fontSize: 13, marginBottom: 3 },
  newsBody: { color: "#4B5563", fontSize: 12, lineHeight: 16 },

  /* Bottom Tab (static) */
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
