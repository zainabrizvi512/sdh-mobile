import { StyleSheet } from "react-native";

const GREEN = "#1f3d18";
const BG_LIGHT = "#F4F7F4";
const RED_ALERT = "#d32f2f";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_LIGHT },
  
  /* HEADER */
  headerContainer: { 
    backgroundColor: GREEN, 
    paddingTop: 60, 
    paddingBottom: 35, 
    borderBottomLeftRadius: 35, 
    borderBottomRightRadius: 35, 
    elevation: 12 
  },
  profileRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, marginBottom: 25 },
  avatarWrapper: { borderRadius: 18, padding: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  avatar: { width: 50, height: 50, borderRadius: 16 },
  greetingText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600' },
  nameText: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  headerActions: { flexDirection: 'row', gap: 10 },
  headerIconBtn: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 10, borderRadius: 12 },
  notifDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: RED_ALERT, borderWidth: 1.5, borderColor: GREEN },

  locationCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', 
    marginHorizontal: 25, padding: 14, borderRadius: 20, elevation: 5 
  },
  locationText: { flex: 1, marginLeft: 8, fontSize: 13, color: '#333', fontWeight: '600' },
  statusBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { color: GREEN, fontSize: 10, fontWeight: '900' },

  scrollBody: { paddingBottom: 40 },

  /* ALERTS */
  alertCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', 
    marginHorizontal: 20, marginTop: 20, padding: 18, borderRadius: 24, 
    borderWidth: 1, borderColor: '#FFE5E5', elevation: 3 
  },
  alertIconBg: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#FFF0F0', justifyContent: 'center', alignItems: 'center' },
  alertTitle: { fontSize: 15, fontWeight: '800', color: '#1A1A1A' },
  alertBody: { fontSize: 12, color: '#666', marginTop: 2 },

  /* SECTIONS */
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, marginTop: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  linkText: { color: GREEN, fontWeight: '700', fontSize: 13 },

  /* EMERGENCY GRID */
  emergencyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  emCard: { width: '30%', backgroundColor: '#FFF', borderRadius: 22, padding: 15, alignItems: 'center', elevation: 4, borderLeftWidth: 4 },
  emIconCircle: { width: 40, height: 40, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  emNumber: { fontSize: 16, fontWeight: '900', color: '#333' },
  emLabel: { fontSize: 10, fontWeight: '700', color: '#999', textTransform: 'uppercase' },

  /* GUIDES */
  guideCard: { width: 150, backgroundColor: '#FFF', borderRadius: 24, padding: 18, marginRight: 12, elevation: 3, borderWidth: 1, borderColor: '#EEE' },
  guideIconCircle: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  guideTitle: { fontSize: 14, fontWeight: '700', color: '#333', lineHeight: 20 },

  /* NEWS */
  newsCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 24, padding: 12, marginBottom: 12, elevation: 2, borderWidth: 1, borderColor: '#F0F0F0' },
  newsThumb: { width: 80, height: 80, borderRadius: 18, backgroundColor: '#F9F9F9' },
  newsCardTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', lineHeight: 20 },
  newsCardBody: { fontSize: 12, color: '#777', marginTop: 4 },
  newsMeta: { fontSize: 10, color: GREEN, fontWeight: '700', marginTop: 6, textTransform: 'uppercase' },

  /* --- MODAL STYLES --- */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, height: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: GREEN },
  modalSubtitle: { fontSize: 13, color: '#666', marginBottom: 20 },
  ngoItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 16, backgroundColor: '#F9F9F9', marginBottom: 10, borderWidth: 1, borderColor: '#EEE' },
  ngoIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  ngoName: { fontSize: 16, fontWeight: '700', color: '#333' },
  ngoType: { fontSize: 12, color: '#777' }
});