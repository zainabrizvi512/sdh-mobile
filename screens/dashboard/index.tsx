import { getAllNews } from "@/api/getAllNews";
import { getLoggedInUser, IUser } from "@/api/getLoggedInUser";
import { getSafetyGuides, SafetyGuide } from "@/api/getSafetyGuides";
import { getAddressFromCoords } from "@/utils/getAddressFromCoords";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth0 } from "react-native-auth0";

const GREEN = "#1f3d18";
const BG_LIGHT = "#F4F7F4";
const RED_ALERT = "#d32f2f";

const Dashboard: React.FC<any> = ({ navigation }) => {
  const [token, setToken] = useState<string | null>(null);
  const { getCredentials } = useAuth0();
  const [user, setUser] = useState<IUser>();
  const [address, setAddress] = useState<string>("Detecting address...");
  const [safetyGuides, setSafetyGuides] = useState<SafetyGuide[]>([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const creds = await getCredentials();
        if (mounted) setToken(creds?.accessToken ?? null);
      } catch { setToken(null); }
    })();
    return () => { mounted = false; };
  }, [getCredentials]);

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const loadData = async () => {
    const safetyGuidesResponse = await getSafetyGuides({});
    const response = await getLoggedInUser(token || "");
    setUser(response);
    if (response?.location) {
      const addr = await getAddressFromCoords(response.location.x, response.location.y);
      setAddress(addr?.full || "Islamabad, Pakistan");
    }
    const newsResponse = await getAllNews(token || "");
    setSafetyGuides(safetyGuidesResponse);
    setNews(newsResponse.data.items.slice(0, 3));
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* --- PREMIUM CURVED HEADER --- */}
      <View style={styles.headerContainer}>
        <View style={styles.profileRow}>
          <TouchableOpacity onPress={() => navigation.navigate("ProfileSettings", {})} style={styles.avatarWrapper}>
            <Image source={{ uri: user?.picture || "https://dummyimage.com/100/ffffff/1f3d18&text=User" }} style={styles.avatar} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.greetingText}>Welcome back,</Text>
            <Text style={styles.nameText}>{user?.name || "Rescue User"}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.navigate("RescueCoordinationSystem", {})}>
              <Ionicons name="notifications-outline" size={20} color="#FFF" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Location Card inside Header for "Fuller" look */}
        <View style={styles.locationCard}>
          <Ionicons name="location" size={16} color={GREEN} />
          <Text style={styles.locationText} numberOfLines={1}>{address}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>SAFE</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        
        {/* Urgent Alert Banner */}
        <TouchableOpacity onPress={() => navigation.navigate("RiskLevels", {})} style={styles.alertCard}>
            <View style={styles.alertIconBg}>
                <MaterialCommunityIcons name="alert-decagram" size={24} color={RED_ALERT} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.alertTitle}>Flood Alert: Danger Level 3</Text>
                <Text style={styles.alertBody}>Isb Zone E-11 & F-10. Avoid low-lying areas.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#CCC" />
        </TouchableOpacity>

        {/* Emergency Grid */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Emergency Dispatch</Text>
          <TouchableOpacity onPress={() => navigation.navigate("EmergencyContactsListing", {})}>
            <Text style={styles.linkText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emergencyRow}>
          <EmergencyBtn label="Police" num="15" icon="local-police" color={GREEN} onPress={() => {}} />
          <EmergencyBtn label="Ambulance" num="1122" icon="local-hospital" color="#E67E22" onPress={() => {}} />
          <EmergencyBtn label="Fire" num="16" icon="local-fire-department" color="#C0392B" onPress={() => {}} />
        </View>

        {/* Safety Guides Horizontal Scroll */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Interactive Safety Guides</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SafetyGuides", {})}>
            <Text style={styles.linkText}>Browse</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={safetyGuides}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 10, paddingBottom: 10 }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.guideCard} onPress={() => navigation.navigate("SafetyGuideDetail", { id: item.id, title: item.title })}>
              <View style={styles.guideIconCircle}>
                 <Ionicons name="shield-checkmark" size={20} color={GREEN} />
              </View>
              <Text style={styles.guideTitle} numberOfLines={2}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Latest Verified News */}
        <View style={[styles.sectionHeaderRow, { marginTop: 15 }]}>
          <Text style={styles.sectionTitle}>Verified News</Text>
          <TouchableOpacity onPress={() => navigation.navigate("NewsListing", {})}>
            <Text style={styles.linkText}>More Updates</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {news.map((n: any) => (
            <TouchableOpacity key={n.id} style={styles.newsCard} onPress={() => navigation.navigate("NewsDetails", { title: n.title })}>
              <Image source={{ uri: n.url || "https://dummyimage.com/200/F0F4F0/1f3d18&text=News" }} style={styles.newsThumb} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.newsCardTitle} numberOfLines={2}>{n.title}</Text>
                <Text style={styles.newsCardBody} numberOfLines={1}>{n.description}</Text>
                <Text style={styles.newsMeta}>2 hours ago • Local Update</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// --- SUB COMPONENTS ---
const EmergencyBtn = ({ label, num, icon, color, onPress }: any) => (
    <TouchableOpacity style={[styles.emCard, { borderLeftColor: color }]} onPress={onPress}>
        <View style={[styles.emIconCircle, { backgroundColor: color + '15' }]}>
            <MaterialIcons name={icon} size={20} color={color} />
        </View>
        <Text style={styles.emNumber}>{num}</Text>
        <Text style={styles.emLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_LIGHT },
  headerContainer: { 
    backgroundColor: GREEN, paddingTop: 60, paddingBottom: 35, 
    borderBottomLeftRadius: 35, borderBottomRightRadius: 35, elevation: 12 
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
  alertCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', 
    marginHorizontal: 20, marginTop: 20, padding: 18, borderRadius: 24, 
    borderWidth: 1, borderColor: '#FFE5E5', elevation: 3 
  },
  alertIconBg: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#FFF0F0', justifyContent: 'center', alignItems: 'center' },
  alertTitle: { fontSize: 15, fontWeight: '800', color: '#1A1A1A' },
  alertBody: { fontSize: 12, color: '#666', marginTop: 2 },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, marginTop: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  linkText: { color: GREEN, fontWeight: '700', fontSize: 13 },

  emergencyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  emCard: { width: '30%', backgroundColor: '#FFF', borderRadius: 22, padding: 15, alignItems: 'center', elevation: 4, borderLeftWidth: 4 },
  emIconCircle: { width: 40, height: 40, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  emNumber: { fontSize: 16, fontWeight: '900', color: '#333' },
  emLabel: { fontSize: 10, fontWeight: '700', color: '#999', textTransform: 'uppercase' },

  guideCard: { width: 150, backgroundColor: '#FFF', borderRadius: 24, padding: 18, marginRight: 12, elevation: 3, borderWidth: 1, borderColor: '#EEE' },
  guideIconCircle: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  guideTitle: { fontSize: 14, fontWeight: '700', color: '#333', lineHeight: 20 },

  newsCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 24, padding: 12, marginBottom: 12, elevation: 2, borderWidth: 1, borderColor: '#F0F0F0' },
  newsThumb: { width: 80, height: 80, borderRadius: 18, backgroundColor: '#F9F9F9' },
  newsCardTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', lineHeight: 20 },
  newsCardBody: { fontSize: 12, color: '#777', marginTop: 4 },
  newsMeta: { fontSize: 10, color: GREEN, fontWeight: '700', marginTop: 6, textTransform: 'uppercase' }
});

export default Dashboard;