import { Platform, StyleSheet } from "react-native";

const GREEN = "#1f3d18";
const GOLD = "#D4AF37";

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F9FAF9" },
  header: {
    backgroundColor: GREEN,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#FFF" },
  
  headerTabs: { marginTop: 20 },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, marginRight: 8, backgroundColor: 'rgba(255,255,255,0.08)' },
  tabBtnActive: { backgroundColor: GOLD },
  tabText: { color: 'rgba(255,255,255,0.6)', fontWeight: '800', fontSize: 11 },
  tabTextActive: { color: '#FFF' },

  content: { padding: 20 },

  // --- CAMPAIGN CARDS ---
  campaignCard: { backgroundColor: '#FFF', borderRadius: 20, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#EEE', elevation: 3 },
  campaignImg: { height: 140, backgroundColor: '#E2E8E2', justifyContent: 'center', alignItems: 'center' },
  campaignInfo: { padding: 15 },
  progTrack: { height: 6, backgroundColor: '#EEE', borderRadius: 3, marginVertical: 10, overflow: 'hidden' },
  progFill: { height: '100%', backgroundColor: GOLD },
  
  // --- CHAT/COMMUNICATION ---
  chatBubble: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: '#E9E9E9' },
  
  // --- STORY SHARING ---
  storyCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 25, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: GOLD },
  
  primaryBtn: { backgroundColor: GREEN, paddingVertical: 15, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  primaryBtnText: { color: "#FFF", fontWeight: "900", fontSize: 14, letterSpacing: 0.5 },

  input: {
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    fontWeight: "600",
    color: "#111",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  emptyText: { color: "#888", fontSize: 12, fontStyle: "italic", marginBottom: 12 },
  sectionTitle: { fontSize: 12, fontWeight: "900", color: "#1f3d18", marginBottom: 10 },
  portalCard: {
    backgroundColor: "#FFF",
    padding: 22,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  chatContainer: { flex: 1, paddingHorizontal: 20, paddingBottom: 16 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  contactChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#E8F0E8",
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E2E8E2",
  },
  contactChipActive: { backgroundColor: GREEN, borderColor: GREEN },
  contactChipText: { fontWeight: "800", fontSize: 12, color: GREEN },
  contactChipTextActive: { color: "#FFF" },
  messageBubble: {
    alignSelf: "flex-start",
    maxWidth: "85%",
    backgroundColor: "#F0F4F0",
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
  },
  messageMeta: { fontSize: 10, color: "#888", marginTop: 4 },
  chatInputRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  sendBtn: {
    backgroundColor: GOLD,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginLeft: 8,
  },
  sendBtnText: { fontWeight: "900", color: "#FFF", fontSize: 12 },
  amountChipsRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  amountChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    marginRight: 8,
    marginBottom: 8,
  },
  amountChipText: { fontWeight: "800", color: GREEN, fontSize: 12 },

  dropdownTrigger: {
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownTriggerText: { flex: 1, fontWeight: "600", color: "#111", fontSize: 14, marginRight: 8 },
  fieldLabel: { fontSize: 11, fontWeight: "800", color: "#666", marginBottom: 6, letterSpacing: 0.3 },
  pickerModalRoot: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  pickerModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  pickerSheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "72%",
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  pickerSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  pickerSheetTitle: { fontSize: 16, fontWeight: "900", color: GREEN },
  pickerRow: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F3F3",
  },
  pickerRowTitle: { fontSize: 15, fontWeight: "700", color: "#111" },
  pickerRowMeta: { fontSize: 11, color: "#888", marginTop: 4 },
});