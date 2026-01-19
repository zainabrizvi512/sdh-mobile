import { GREEN } from "@/constants/theme";
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F3F5F7" },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "ios" ? 54 : 18,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E9EDF2",
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#111", paddingLeft: 10 },
  headerTabs: { marginTop: 12, flexDirection: "row", gap: 10 },
  topTab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, backgroundColor: "#F2F4F7" },
  topTabActive: { backgroundColor: "#111" },
  topTabText: { color: "#111", fontWeight: "600" },
  topTabTextActive: { color: "#FFF" },
  content: { padding: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: 'space-between' },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "#EDF1F5", elevation: 3, marginBottom: 16 },
  cardTitle: { fontSize: 14, fontWeight: "800", marginBottom: 12, color: "#111" },
  sosCenter: { alignItems: "center", gap: 12 },
  sosIconBox: { width: 92, height: 92, borderRadius: 22, backgroundColor: "#4C8DFF", alignItems: "center", justifyContent: "center" },
  sosIcon: { fontSize: 42 },
  primaryBtn: { backgroundColor: "#4C8DFF", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 12 },
  primaryBtnText: { color: "#FFF", fontWeight: "800" },
  table: { borderWidth: 1, borderColor: "#EEF2F6", borderRadius: 12, overflow: "hidden" },
  tableRow: { flexDirection: "row", justifyContent: "space-between", padding: 12, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  td: { fontWeight: "600", color: "#111" },
  footerNote: { marginTop: 10, fontSize: 12, color: "#6B7280", textAlign: 'center' },
  // Reporting & Tracking Styles
  requestRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 12, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: "#F0F0F0" },
  requestChip: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, marginRight: 12 },
  requestChipText: { fontSize: 10, fontWeight: "800" },
  requestMeta: { flex: 1 },
  progressTrack: { height: 8, backgroundColor: "#E5E7EB", borderRadius: 4, width: "100%", marginBottom: 8, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#4C8DFF", borderRadius: 4 },
  stageRow: { flexDirection: "row", justifyContent: "space-between" },
  stageText: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500'
  },
  activeStage: {
    color: GREEN,
    fontWeight: '800'
  },
});