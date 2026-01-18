import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet,
  Text, TouchableOpacity, useWindowDimensions, View
} from "react-native";
import ReportingTab from './ReportingTab';
import TrackingTab from './TrackingTab';

const GREEN = "#1f3d18";
const RED_ALERT = "#d32f2f";
const OFF_WHITE = "#F5F7F5";
const BASE_URL = "http://192.168.10.5:3000/emergency-aid";

const EmergencyAidNetwork = ({ navigation }: any) => {
  const [tab, setTab] = useState("alerts");
  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState([]);
  const { width } = useWindowDimensions();
  const itemWidth = width > 600 ? (width - 60) / 2 : width - 40;

  useEffect(() => { if (tab === "alerts") fetchStock(); }, [tab]);

  const fetchStock = async () => {
    try {
      const response = await fetch(`${BASE_URL}/volunteer-stock?city=Islamabad`);
      const data = await response.json();
      setStock(data);
    } catch (error) { console.error(error); }
  };

  const tabs = [
    { id: 'alerts', label: 'Alerts', icon: 'notifications-outline' },
    { id: 'reporting', label: 'Reporting', icon: 'document-text-outline' },
    { id: 'tracking', label: 'Tracking', icon: 'navigate-outline' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={26} color="#FFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Emergency Aid Network</Text>
            <Text style={styles.headerSubtitle}>Active Response Unit</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
            {tabs.map((t) => (
                <TouchableOpacity key={t.id} onPress={() => setTab(t.id)} 
                    style={[styles.tabItem, tab === t.id && styles.activeTabItem]}>
                    <Ionicons name={t.icon as any} size={16} color={tab === t.id ? GREEN : "#FFF"} />
                    <Text style={[styles.tabText, tab === t.id && styles.activeTabText]}>{t.label}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      <View style={{ flex: 1 }}>
        {tab === "alerts" && (
            <ScrollView contentContainerStyle={styles.contentScroll}>
                <View style={styles.gridContainer}>
                    <View style={[styles.card, { width: itemWidth }]}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="warning-outline" size={20} color={RED_ALERT} />
                            <Text style={styles.cardTitle}>SOS DISPATCH</Text>
                        </View>
                        <View style={styles.sosActionZone}>
                            <View style={styles.sosRing}>
                                {loading ? <ActivityIndicator size="large" color={RED_ALERT} /> : <Ionicons name="notifications" size={32} color={RED_ALERT} />}
                            </View>
                            <TouchableOpacity style={styles.sosBtn} onPress={() => Alert.alert("SOS Sent")}>
                                <Text style={styles.sosBtnText}>INITIATE SOS</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.card, { width: itemWidth }]}>
                        <View style={styles.cardHeader}><Ionicons name="cube-outline" size={20} color={GREEN} /><Text style={styles.cardTitle}>LIVE INVENTORY</Text></View>
                        {stock.map((s: any, i) => (
                            <View key={i} style={styles.stockRow}>
                                <Text style={styles.stockName}>{s.item}</Text>
                                <Text style={styles.stockVal}>{s.available}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        )}
        {tab === "reporting" && <ReportingTab baseUrl={BASE_URL} />}
        {tab === "tracking" && <TrackingTab />}
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
  contentScroll: { padding: 20 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 20, elevation: 4 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderColor: '#F0F0F0', paddingBottom: 10 },
  cardTitle: { fontSize: 13, fontWeight: '900', color: '#444', marginLeft: 8 },
  sosActionZone: { alignItems: 'center' },
  sosRing: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: '#EEE', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  sosBtn: { backgroundColor: RED_ALERT, width: '100%', padding: 14, borderRadius: 12, alignItems: 'center' },
  sosBtnText: { color: '#FFF', fontWeight: '900' },
  stockRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F9F9F9' },
  stockName: { fontSize: 13, color: '#666' },
  stockVal: { fontWeight: 'bold', color: GREEN }
});

export default EmergencyAidNetwork;