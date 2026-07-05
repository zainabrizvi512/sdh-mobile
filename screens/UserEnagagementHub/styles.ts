import { Platform, StyleSheet } from "react-native";

const GREEN = "#0f4c3a";
const LIGHT_GREEN = "#E8F0E8";
const GOLD = "#D4AF37";

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FDFDFD" },
  
  // --- PREMIUM HEADER ---
  header: {
    backgroundColor: GREEN,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
  },
  navRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginBottom: 15
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#FFF", letterSpacing: 0.8 },
  headerSub: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: "700", marginTop: -2 },

  // --- TABS SCROLL ---
  headerTabs: { marginTop: 20 },
  topTab: { 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 15, 
    backgroundColor: 'rgba(255,255,255,0.08)', 
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  topTabActive: { backgroundColor: "#FFF", elevation: 5 },
  topTabText: { color: "rgba(255,255,255,0.7)", fontWeight: "800", fontSize: 10 },
  topTabTextActive: { color: GREEN },

  content: { padding: 20 },

  // --- FANCY DASHBOARD CARD ---
  premiumCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 28, 
    padding: 22,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: '#0f4c3a',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  xpLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  xpMainText: { fontSize: 11, fontWeight: '900', color: '#666' },
  xpPercentage: { fontSize: 11, fontWeight: '900', color: GREEN },
  xpTrack: { height: 10, backgroundColor: LIGHT_GREEN, borderRadius: 10, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: GREEN, borderRadius: 10 },

  // --- STATS GRID ---
  statGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { 
    width: '47%', 
    backgroundColor: '#FFF', 
    borderRadius: 22, 
    padding: 18, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F2F2F2'
  },
  statValue: { fontSize: 24, fontWeight: '900', color: GREEN, marginTop: 8 },
  statLabel: { fontSize: 9, fontWeight: '800', color: '#999', letterSpacing: 1 },

  // --- TIMELINE ITEMS ---
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 22,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F5F5F5'
  },
  iconCircle: { 
    width: 45, height: 45, borderRadius: 15, 
    backgroundColor: LIGHT_GREEN, justifyContent: 'center', alignItems: 'center', marginRight: 15 
  },
  itemTitle: { fontSize: 14, fontWeight: '800', color: '#333' },
  itemDate: { fontSize: 10, color: '#AAA', fontWeight: '600', marginTop: 2 },
  xpBadge: { fontWeight: '900', color: GREEN, fontSize: 13 },

  // --- BUTTONS ---
  actionBtn: { 
    backgroundColor: GREEN, 
    paddingVertical: 16, 
    borderRadius: 18, 
    alignItems: 'center', 
    shadowColor: GREEN,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6
  },
  actionBtnText: { color: "#FFF", fontWeight: "900", fontSize: 14, letterSpacing: 1.2 },

  input: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#111",
    marginBottom: 10,
    fontSize: 14,
  },
  emptyText: { color: "#888", fontSize: 12, fontStyle: "italic", marginBottom: 12, textAlign: "center" },
  sectionTitle: { fontSize: 12, fontWeight: "900", color: "#666", marginBottom: 10 },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F5F5F5",
  },
  secondaryBtn: {
    backgroundColor: LIGHT_GREEN,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  secondaryBtnText: { color: GREEN, fontWeight: "800", fontSize: 11 },
});