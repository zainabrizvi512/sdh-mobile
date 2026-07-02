import { envConfig } from "@/config/envConfig";
import { BOTTOM_NAV_SCROLL_PADDING } from "@/components/bottomNav/styles";
import FancyAppHeader from "@/components/fancyAppHeader";
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location'; // Assuming you use expo-location
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet,
  Text, TouchableOpacity, useWindowDimensions, View
} from "react-native";
import { useAuth0 } from "react-native-auth0"; // Added Auth0
import ReportingTab from './ReportingTab';
import TrackingTab from './TrackingTab';

const GREEN = "#1f3d18";
const RED_ALERT = "#d32f2f";
const OFF_WHITE = "#F5F7F5";
// Updated to match the backend controller path '/emergency'
const API_URL = `${envConfig.EXPO_PUBLIC_BASE_URL}/emergency`;

const EmergencyAidNetwork = ({ navigation }: any) => {
  const [tab, setTab] = useState("alerts");
  const [loading, setLoading] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);
  const [token, setToken] = useState("");

  const [stock, setStock] = useState<any[]>([]); // Initialize empty
  const [stockLoading, setStockLoading] = useState(false);

  const { width } = useWindowDimensions();
  const { getCredentials } = useAuth0();
  const itemWidth = width > 600 ? (width - 60) / 2 : width - 40;

  // 1. Fetch Stock Logic
  const fetchStock = async () => {
    setStockLoading(true);
    try {
      // Calls our new NestJS endpoint
      const creds = await getCredentials();
      const response = await fetch(`${API_URL}/inventory?city=Islamabad`, {
        headers: {
          'Authorization': `Bearer ${creds.accessToken}`
        },
      });
      const data = await response.json();
      console.log(data);
      setStock(data);
    } catch (error) {
      console.error("Error fetching stock:", error);
    } finally {
      setStockLoading(false);
    }
  };

  // 2. Trigger fetch on mount or tab change
  useEffect(() => {
    if (tab === "alerts") fetchStock();
  }, [tab]);

  // 1. Get Token on Mount
  useEffect(() => {
    const getToken = async () => {
      const creds = await getCredentials();
      if (creds?.accessToken) setToken(creds.accessToken);
    };
    getToken();
  }, []);

  // 2. SOS Functionality (Integrated)
  const handleSOS = async () => {
    setSosLoading(true);
    try {
      // Get current location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location is required for SOS.');
        setSosLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});

      // Call API
      const response = await fetch(`${API_URL}/sos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          lat: location.coords.latitude,
          long: location.coords.longitude
        })
      });

      if (response.ok) {
        Alert.alert("SOS SENT", "Rescue teams have been alerted with your location.");
      } else {
        console.log(response);
        Alert.alert("Error", "Failed to send SOS.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Network error.");
    } finally {
      setSosLoading(false);
    }
  };

  const tabs = [
    { id: 'alerts', label: 'Alerts', icon: 'notifications-outline' },
    { id: 'reporting', label: 'Reporting', icon: 'document-text-outline' },
    { id: 'tracking', label: 'Tracking', icon: 'navigate-outline' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FancyAppHeader
        title="Emergency Aid"
        subtitle="Active response unit & SOS dispatch"
        badge={{ icon: "alert-circle", label: "ACTIVE RESPONSE" }}
        rightIcon="warning-outline"
        rightIconColor="#fca5a5"
        onBack={() => navigation.goBack()}
        tabs={tabs.map((t) => ({ id: t.id, label: t.label.toUpperCase(), icon: t.icon as any }))}
        activeTab={tab}
        onTabChange={setTab}
      />

      <View style={{ flex: 1 }}>
        {tab === "alerts" && (
          <ScrollView contentContainerStyle={styles.contentScroll}>
            <View style={styles.gridContainer}>
              {/* SOS CARD */}
              <View style={[styles.card, { width: itemWidth }]}>
                <View style={styles.cardHeader}>
                  <Ionicons name="warning-outline" size={20} color={RED_ALERT} />
                  <Text style={styles.cardTitle}>SOS DISPATCH</Text>
                </View>
                <View style={styles.sosActionZone}>
                  <View style={styles.sosRing}>
                    {sosLoading ? <ActivityIndicator size="large" color={RED_ALERT} /> : <Ionicons name="notifications" size={32} color={RED_ALERT} />}
                  </View>
                  <TouchableOpacity style={styles.sosBtn} onPress={handleSOS} disabled={sosLoading}>
                    <Text style={styles.sosBtnText}>{sosLoading ? "SENDING..." : "INITIATE SOS"}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* LIVE INVENTORY CARD */}
              <View style={[styles.card, { width: itemWidth }]}>
                <View style={styles.cardHeader}>
                  <Ionicons name="cube-outline" size={20} color={GREEN} />
                  <Text style={styles.cardTitle}>LIVE INVENTORY</Text>
                </View>

                {stockLoading ? (
                  <ActivityIndicator size="small" color={GREEN} />
                ) : stock.length === 0 ? (
                  <Text style={{ color: '#999', fontSize: 12, fontStyle: 'italic' }}>No stock data available.</Text>
                ) : (
                  <View style={styles.stockListContainer}>
                    {stock.map((s, i) => (
                      <View key={i} style={styles.stockRow}>
                        <View style={styles.stockInfo}>
                          {/* Optional: Add a small dot or icon for polish */}
                          <View style={styles.stockDot} />
                          <Text style={styles.stockName}>{s.item}</Text>
                        </View>
                        <View style={styles.stockBadge}>
                          <Text style={styles.stockVal}>
                            {Number(s.available).toLocaleString()}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        )}

        {/* Pass Token and Base URL to Tabs */}
        {tab === "reporting" && <ReportingTab token={token} baseUrl={API_URL} />}
        {tab === "tracking" && <TrackingTab token={token} baseUrl={API_URL} />}
      </View>
    </View>
  );
};

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
  contentScroll: { padding: 20, paddingBottom: BOTTOM_NAV_SCROLL_PADDING },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 20, elevation: 4 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderColor: '#F0F0F0', paddingBottom: 10 },
  cardTitle: { fontSize: 13, fontWeight: '900', color: '#444', marginLeft: 8 },
  sosActionZone: { alignItems: 'center' },
  sosRing: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: '#EEE', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  sosBtn: { backgroundColor: RED_ALERT, width: '100%', padding: 14, borderRadius: 12, alignItems: 'center' },
  sosBtnText: { color: '#FFF', fontWeight: '900' },
  // stockRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F9F9F9' },
  // stockName: { fontSize: 13, color: '#666' },
  // stockVal: { fontWeight: 'bold', color: GREEN },
  stockListContainer: {
    marginTop: 5,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,         // More breathing room
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0', // Light separator line
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DDD',
    marginRight: 10,
  },
  stockName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  stockBadge: {
    backgroundColor: '#E8F5E9', // Light Green background for the number
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  stockVal: {
    fontSize: 13,
    fontWeight: '800',
    color: GREEN,               // Dark Green text
  }
});

export default EmergencyAidNetwork;