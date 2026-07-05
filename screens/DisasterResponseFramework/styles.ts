import { Platform, StyleSheet } from "react-native";

const DARK_GREEN = "#0f4c3a";
const CRISIS_RED = "#991b1b";

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F7F4" },
  
  // --- COMMAND HEADER ---
  header: {
    backgroundColor: DARK_GREEN,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: "900", color: "#FFF", letterSpacing: 1 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: CRISIS_RED, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 5, alignSelf: 'flex-start' },
  liveText: { color: '#FFF', fontSize: 10, fontWeight: '900' },

  headerTabs: { marginTop: 15 },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8, marginRight: 8, backgroundColor: 'rgba(255,255,255,0.05)' },
  tabBtnActive: { backgroundColor: '#FFF' },
  tabText: { color: 'rgba(255,255,255,0.6)', fontWeight: '700', fontSize: 11 },
  tabTextActive: { color: DARK_GREEN },

  content: { padding: 15 },

  // --- MULTILAYER DASHBOARD ---
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  miniCard: { width: '48%', backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: '#E2E8E2' },
  
  // --- COMMUNICATION CONSOLE ---
  msgBox: { backgroundColor: '#FFF', borderRadius: 15, padding: 12, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#4C8DFF' },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8E2",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#111",
    marginBottom: 10,
  },
  row: { flexDirection: "row", alignItems: "center" },
  actionBtn: {
    backgroundColor: DARK_GREEN,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: { color: "#FFF", fontWeight: "800", fontSize: 11 },
  
  // --- TASK CARDS ---
  taskCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  priorityTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  emptyText: { color: "#6b7280", fontSize: 12, fontStyle: "italic", marginBottom: 10 },
  sectionTitle: { fontSize: 12, fontWeight: "900", marginBottom: 8 },

  // --- TIMELINE ---
  timelinePoint: { flexDirection: 'row', marginBottom: 20 },
  timeLineLeft: { alignItems: 'center', marginRight: 15 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: DARK_GREEN },
  line: { width: 2, flex: 1, backgroundColor: '#DDD' },

  fieldLabel: { fontSize: 10, fontWeight: "900", color: "#666", marginBottom: 6, letterSpacing: 0.5 },
  dropdownTrigger: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8E2",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownTriggerText: { flex: 1, fontWeight: "700", color: "#111", fontSize: 14, marginRight: 8 },
  pickerModalRoot: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  pickerModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  pickerSheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: "75%",
    paddingBottom: Platform.OS === "ios" ? 28 : 16,
  },
  pickerSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8E2",
  },
  pickerSheetTitle: { fontSize: 16, fontWeight: "900", color: DARK_GREEN },
  pickerRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4F0",
  },
  pickerRowTitle: { fontSize: 15, fontWeight: "800", color: "#111" },
  pickerRowMeta: { fontSize: 11, color: "#6b7280", marginTop: 4 },
});