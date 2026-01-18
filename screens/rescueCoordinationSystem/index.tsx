import { getRescueAllocations } from "@/api/getRescueAllocations";
import { getRescueAnalytics } from "@/api/getResourceAnalytics";
import { postRescueFeedback } from "@/api/postRescueFeedback";
import { postRescueRequest } from "@/api/postRescueRequest";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth0 } from "react-native-auth0";

const GREEN = "#1f3d18";
const OFF_WHITE = "#F4F7F4";

const RescueCoordinationSystem = ({ navigation }: any) => {
  const [tab, setTab] = useState("requests");
  const [isLoading, setIsLoading] = useState(false);
  // Data States
  const [allocations, setAllocations] = useState<any[]>([]);
  const [token, setToken] = useState<string>("");
  const [stats, setStats] = useState({ aidSent: 0, successRate: 0 });

  const { getCredentials } = useAuth0();

  const tabs = [
    { id: "requests", label: "Requests", icon: "document-text-outline" },
    { id: "allocation", label: "Allocation", icon: "git-network-outline" },
    { id: "tracking", label: "Tracking", icon: "location-outline" },
    { id: "feedback", label: "Feedback", icon: "star-outline" },
    { id: "analytics", label: "Analytics", icon: "stats-chart-outline" },
  ];

  useEffect(() => {
    const run  = async() => {
      const { accessToken } = await getCredentials();
      setToken(accessToken);
    };
    run();
  }, [getCredentials])

  // Fetch data when tab changes
  useEffect(() => {
    if (tab === "allocation") fetchAllocations();
    if (tab === "analytics") fetchAnalytics();
  }, [tab]);

  const fetchAllocations = async () => {
    setIsLoading(true);
    try {
      const { accessToken } = await getCredentials();
      const data = await getRescueAllocations(accessToken);
      setAllocations(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load allocations");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setIsLoading(true);
    const { accessToken } = await getCredentials();
    try {
      const data = await getRescueAnalytics(accessToken);
      setStats(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* --- HEADER --- */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={26} color="#FFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Rescue Coordination</Text>
            <Text style={styles.headerSubtitle}>Field Operations</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {tabs.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => setTab(item.id)} 
              style={[styles.tabItem, tab === item.id && styles.activeTabItem]}>
              <Ionicons name={item.icon as any} size={16} color={tab === item.id ? GREEN : "#FFF"} />
              <Text style={[styles.tabText, tab === item.id && styles.activeTabText]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* --- MAIN CONTENT --- */}
      <ScrollView contentContainerStyle={styles.mainContent} showsVerticalScrollIndicator={false}>
        {isLoading ? (
            <ActivityIndicator size="large" color={GREEN} style={{ marginTop: 50 }} />
        ) : (
            <>
                {tab === "requests" && <CrisisRequestView token={token} />}
                {tab === "allocation" && <NGOAllocationPanel data={allocations} />}
                {tab === "tracking" && <LiveTrackingView />}
                {tab === "feedback" && <FeedbackView token={token} />}
                {tab === "analytics" && <AnalyticsView data={stats} />}
            </>
        )}
      </ScrollView>
    </View>
  );
};

// --- SUB-COMPONENTS ---

const CrisisRequestView = ({ token }: { token: string }) => {
    const [type, setType] = useState("");
    const [qty, setQty] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!type || !qty) return Alert.alert("Validation", "Please fill all fields");
        setSubmitting(true);
        try {
            await postRescueRequest(token, { resourceType: type, quantity: Number(qty) });
            Alert.alert("Success", "Request submitted successfully");
            setType("");
            setQty("");
        } catch (e) {
            Alert.alert("Error", "Could not submit request");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.cardHeaderLabel}>NEW REQUEST</Text>
            <TextInput 
                style={styles.fancyInput} 
                placeholder="Resource Type (e.g. Boats)" 
                placeholderTextColor="#999" 
                value={type}
                onChangeText={setType}
            />
            <TextInput 
                style={styles.fancyInput} 
                placeholder="Quantity" 
                keyboardType="numeric" 
                placeholderTextColor="#999" 
                value={qty}
                onChangeText={setQty}
            />
            <TouchableOpacity 
                style={[styles.submitBtn, submitting && { opacity: 0.7 }]} 
                onPress={handleSubmit}
                disabled={submitting}
            >
                <Text style={styles.submitBtnText}>{submitting ? "SENDING..." : "SUBMIT REQUEST"}</Text>
                {!submitting && <Ionicons name="send-outline" size={18} color="#FFF" />}
            </TouchableOpacity>
        </View>
    );
};

const NGOAllocationPanel = ({ data }: { data: any[] }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>NGO Distribution</Text>
      {data.length === 0 ? (
          <Text style={{ color: '#999', fontStyle: 'italic' }}>No active allocations found.</Text>
      ) : (
        data.map((item, i) => (
            <View key={i} style={styles.listRow}>
            <View style={styles.iconCircle}><Ionicons name="business" size={20} color={GREEN} /></View>
            <View style={{ flex: 1 }}>
                {/* Adjust property names based on your actual backend response structure */}
                <Text style={styles.rowMainText}>{item.vehicleDetails || "Unknown Resource"}</Text>
                <Text style={styles.rowSubText}>{item.provider?.username || "Provider"}</Text>
            </View>
            <View style={styles.badge}><Text style={styles.badgeText}>{item.status || "ACTIVE"}</Text></View>
            </View>
        ))
      )}
    </View>
);

const AnalyticsView = ({ data }: { data: { aidSent: number, successRate: number } }) => (
    <View style={styles.statGrid}>
      <View style={[styles.statCard, { backgroundColor: GREEN }]}>
          <Text style={styles.statVal}>{data.aidSent}</Text>
          <Text style={styles.statDesc}>Aid Sent</Text>
      </View>
      <View style={[styles.statCard, { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD' }]}>
          <Text style={[styles.statVal, {color: GREEN}]}>{data.successRate}%</Text>
          <Text style={styles.statDesc}>Success</Text>
      </View>
    </View>
);

const FeedbackView = ({ token }: { token: string }) => {
    const [obs, setObs] = useState("");
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!obs) return;
        setSending(true);
        try {
            await postRescueFeedback(token, { observation: obs });
            Alert.alert("Thank You", "Feedback sent successfully");
            setObs("");
        } catch (e) {
            Alert.alert("Error", "Could not send feedback");
        } finally {
            setSending(false);
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Feedback</Text>
            <TextInput 
                style={styles.textArea} 
                placeholder="Enter observations..." 
                multiline 
                value={obs}
                onChangeText={setObs}
            />
            <TouchableOpacity 
                style={[styles.submitBtn, sending && { opacity: 0.7 }]} 
                onPress={handleSend}
                disabled={sending}
            >
                <Text style={styles.submitBtnText}>{sending ? "SENDING..." : "SEND"}</Text>
            </TouchableOpacity>
        </View>
    );
};

const LiveTrackingView = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Live Map</Text>
      <View style={styles.mapVisual}><Ionicons name="map-outline" size={40} color={GREEN} opacity={0.3} /></View>
    </View>
);

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: OFF_WHITE },
  headerContainer: { backgroundColor: GREEN, paddingTop: 50, paddingBottom: 25, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  backButton: { marginRight: 15, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  headerSubtitle: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 'bold' },
  tabScroll: { paddingHorizontal: 20 },
  tabItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 10, backgroundColor: 'rgba(255,255,255,0.1)' },
  activeTabItem: { backgroundColor: '#FFF' },
  tabText: { color: 'rgba(255,255,255,0.7)', fontWeight: '700', fontSize: 12, marginLeft: 6 },
  activeTabText: { color: GREEN },
  mainContent: { padding: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, elevation: 4, marginBottom: 15 },
  cardTitle: { fontSize: 16, fontWeight: '800', marginBottom: 15 },
  cardHeaderLabel: { fontSize: 11, fontWeight: '900', color: GREEN, marginBottom: 20, letterSpacing: 1 },
  fancyInput: { borderBottomWidth: 1.5, borderColor: '#EEE', paddingVertical: 12, fontSize: 16, marginBottom: 20, color: '#000' },
  submitBtn: { backgroundColor: GREEN, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 16 },
  submitBtnText: { color: '#FFF', fontWeight: '800', marginRight: 10 },
  listRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 10 },
  iconCircle: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rowMainText: { fontWeight: '700', fontSize: 14 }, 
  rowSubText: { fontSize: 12, color: '#888' },
  badge: { backgroundColor: '#E8F5E9', padding: 5, borderRadius: 8 },
  badgeText: { fontSize: 10, color: GREEN, fontWeight: 'bold' },
  mapVisual: { height: 150, backgroundColor: '#F9F9F9', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  statGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { width: '48%', padding: 20, borderRadius: 20, alignItems: 'center' },
  statVal: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  statDesc: { fontSize: 11, color: '#666' },
  textArea: { backgroundColor: '#F9F9F9', borderRadius: 12, padding: 15, height: 100, textAlignVertical: 'top', marginBottom: 15, color: '#000' }
});

export default RescueCoordinationSystem;