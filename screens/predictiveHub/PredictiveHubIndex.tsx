import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePredictiveHub } from '../../store/predictiveHub.store';
import { regionFromLatLng } from '../../utils/regionFromLocation';
import DecisionsPanel from './DecisionsPanel';
import MembersPanel from './MembersPanel';
import ReportIncident from './ReportIncident';
import RiskDashboard from './RiskDashboard';
import VolunteerHubChat from './VolunteerHubChat';

const GREEN = "#1f3d18";

export default function PredictiveHubIndex() {
    const navigation = useNavigation();
    const [tab, setTab] = useState('dashboard');
    const region = usePredictiveHub(s => s.region);
    const setRegion = usePredictiveHub(s => s.setRegion);
    const loadInitial = usePredictiveHub(s => s.loadInitial);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') { setRegion('PK-ISB'); await loadInitial('PK-ISB'); return; }
            const loc = await Location.getCurrentPositionAsync({});
            const reg = regionFromLatLng(loc.coords.latitude, loc.coords.longitude);
            setRegion(reg);
            await loadInitial(reg);
        })();
    }, []);

    const tabs = [
        { id: 'dashboard', icon: 'analytics', label: 'Risk' },
        { id: 'decisions', icon: 'git-network', label: 'Action' },
        { id: 'chat', icon: 'chatbubbles', label: 'Intel' },
        { id: 'members', icon: 'people', label: 'Team' },
        { id: 'report', icon: 'alert-circle', label: 'Alert' },
    ];

    return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.headerTitle}>Prediction Hub</Text>
                            <Text style={styles.headerSubtitle}>{region || 'Detecting Location...'}</Text>
                        </View>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
                        {tabs.map((t) => (
                            <TouchableOpacity key={t.id} onPress={() => setTab(t.id)} style={[styles.tabItem, tab === t.id && styles.activeTabItem]}>
                                <Ionicons name={t.icon as any} size={16} color={tab === t.id ? GREEN : "#FFF"} />
                                <Text style={[styles.tabText, tab === t.id && styles.activeTabText]}>{t.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                    {tab === 'dashboard' && (
                        <View>
                            <View style={styles.riskCard}>
                                <Text style={styles.cardInfoLabel}>CURRENT RISK STATUS</Text>
                                <Text style={styles.riskLevel}>High Alert (78%)</Text>
                                <View style={styles.progressBg}><View style={[styles.progressFill, {width: '78%'}]} /></View>
                                <Text style={styles.riskDesc}>Preemptive measures recommended in Northern sectors.</Text>
                            </View>
                            <RiskDashboard />
                        </View>
                    )}
                    {tab === 'decisions' && <DecisionsPanel />}
                    {tab === 'chat' && <VolunteerHubChat />}
                    {tab === 'members' && <MembersPanel />}
                    {tab === "report" && <ReportIncident />}
                </ScrollView>
            </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F4F7F4" },
    headerContainer: { backgroundColor: GREEN, paddingTop: 60, paddingBottom: 25, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
    backButton: { marginRight: 12, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: 6 },
    headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFF' },
    headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 },
    tabScroll: { paddingHorizontal: 20 },
    tabItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 10, backgroundColor: 'rgba(255,255,255,0.1)' },
    activeTabItem: { backgroundColor: '#FFF' },
    tabText: { color: 'rgba(255,255,255,0.7)', fontWeight: '700', fontSize: 12, marginLeft: 6 },
    activeTabText: { color: GREEN },
    body: { flex: 1, padding: 20 },
    riskCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 15, elevation: 4 },
    cardInfoLabel: { fontSize: 10, fontWeight: '900', color: GREEN, marginBottom: 10 },
    riskLevel: { fontSize: 22, fontWeight: '800', color: '#333' },
    progressBg: { height: 8, backgroundColor: '#EEE', borderRadius: 4, marginVertical: 12 },
    progressFill: { height: 8, backgroundColor: '#D32F2F', borderRadius: 4 },
    riskDesc: { fontSize: 12, color: '#666' }
});