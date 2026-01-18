import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// --- THEME COLORS ---
const GREEN = "#1f3d18";
const ACCENT_GREEN = "#2e5c24";
const OFF_WHITE = "#F8FAF8";
const BORDER_COLOR = "#E2E8E2";

import {
  QuickReply,
  RiskItem,
  Severity,
  SuggestedAction,
  T_PREDICVIVECOORDINATIONHUB
} from "./types";

const RISK_COLORS: Record<Severity, string> = {
  low: "#34D399",
  medium: "#FBBF24",
  high: "#FB923C",
  critical: "#EF4444",
};

const DATA_RISKS: RiskItem[] = [
  { hazard: "Flood", severity: "low" },
  { hazard: "Fire", severity: "medium" },
  { hazard: "Heatwave", severity: "high" },
  { hazard: "Building Collapse", severity: "critical" },
  { hazard: "Storm", severity: "high", badgeValue: "567" },
];

const SUGGESTED_ACTIONS: SuggestedAction[] = [
  { text: "Activate flood barriers" },
  { text: "Evacuate low-lying areas" },
  { text: "Issue public warnings" },
];

const QUICK_REPLIES: QuickReply[] = [
  { id: "q1", text: "The evacuation is complete.", prefix: "✔️" },
  { id: "q2", text: "Coordination ongoing", prefix: "⚠️" },
  { id: "q3", text: "Ready for deployment", avatar: "👩🏼‍💼" },
];

const PredictiveHubScreen: React.FC<T_PREDICVIVECOORDINATIONHUB> = ({ navigation }) => {
  const onQuickReply = (qr: QuickReply) => {
    Alert.alert("Dispatch Status", qr.text);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* --- PREMIUM HEADER --- */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={styles.headerIconCircle}
          >
            <Ionicons name="menu-outline" size={24} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Predictive Hub</Text>

          <TouchableOpacity style={styles.headerIconCircle}>
            <Ionicons name="notifications-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSub}>Real-time Predictive Intelligence</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- RISK PREDICTION SECTION --- */}
        <View style={styles.sectionHeader}>
            <Ionicons name="analytics" size={18} color={GREEN} />
            <Text style={styles.sectionTitle}>DATA-DRIVEN RISK PREDICTION</Text>
        </View>
        
        <View style={styles.glassCard}>
          {DATA_RISKS.map((r, idx) => (
            <View key={`${r.hazard}-${idx}`}>
              <View style={styles.riskRow}>
                <View style={styles.hazardInfo}>
                    <View style={[styles.statusDot, {backgroundColor: RISK_COLORS[r.severity]}]} />
                    <Text style={styles.hazardText}>{r.hazard}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: r.badgeValue ? '#EF4444' : RISK_COLORS[r.severity] + '20' }]}>
                  <Text style={[styles.badgeText, { color: r.badgeValue ? '#FFF' : RISK_COLORS[r.severity] }]}>
                    {r.badgeValue ?? r.severity.toUpperCase()}
                  </Text>
                </View>
              </View>
              {idx < DATA_RISKS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* --- SUGGESTED ACTIONS --- */}
        <Text style={styles.sectionTitleAlt}>SUGGESTED ACTIONS</Text>
        <View style={styles.actionsContainer}>
          {SUGGESTED_ACTIONS.map((a, i) => (
            <View key={i} style={styles.actionChip}>
              <Ionicons name="flash" size={16} color={GREEN} style={{marginRight: 8}} />
              <Text style={styles.actionText}>{a.text}</Text>
            </View>
          ))}
        </View>

        {/* --- QUICK DISPATCH / MESSAGING --- */}
        <Text style={styles.sectionTitleAlt}>QUICK DISPATCH</Text>
        <View style={styles.repliesContainer}>
          {QUICK_REPLIES.map((q) => (
            <Pressable
              key={q.id}
              onPress={() => onQuickReply(q)}
              style={styles.replyCard}
            >
              <View style={styles.replyContent}>
                <View style={styles.avatarCircle}>
                   <Text style={{fontSize: 14}}>{q.prefix || q.avatar}</Text>
                </View>
                <Text style={styles.replyText}>{q.text}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#CCC" />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: OFF_WHITE },
  
  // Header Styling
  header: {
    backgroundColor: GREEN,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerIconCircle: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 5, fontWeight: '600', letterSpacing: 0.5 },

  scrollContent: { padding: 20 },

  // Risk Table
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 12, fontWeight: '900', color: GREEN, marginLeft: 8, letterSpacing: 1 },
  sectionTitleAlt: { fontSize: 12, fontWeight: '900', color: '#666', marginTop: 25, marginBottom: 15, letterSpacing: 1 },
  
  glassCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 24, 
    padding: 15,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  riskRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
  hazardInfo: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  hazardText: { fontSize: 15, fontWeight: '700', color: '#333' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: '900' },
  divider: { height: 1, backgroundColor: '#F0F0F0', width: '100%' },

  // Suggested Actions
  actionsContainer: { gap: 10 },
  actionChip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 15, 
    borderLeftWidth: 4, 
    borderLeftColor: GREEN,
    elevation: 2,
  },
  actionText: { fontSize: 14, color: '#444', fontWeight: '600' },

  // Messaging/Replies
  repliesContainer: { gap: 12 },
  replyCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEE'
  },
  replyContent: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { 
    width: 34, 
    height: 34, 
    borderRadius: 17, 
    backgroundColor: '#F0F4F0', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  replyText: { fontSize: 14, color: '#333', fontWeight: '500' }
});

export default PredictiveHubScreen;