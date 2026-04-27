import { getAllNews } from "@/api/getAllNews";
import { getAllNgos, NGO } from "@/api/getAllNgos";
import { getLoggedInUser, IUser } from "@/api/getLoggedInUser";
import { getSafetyGuides, SafetyGuide } from "@/api/getSafetyGuides";
import { postJoinNgo } from "@/api/postJoinNgo";
import { getAddressFromCoords } from "@/utils/getAddressFromCoords";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import { styles } from "./styles";
import { T_DASHBOARD } from "./types";

const GREEN = "#1f3d18";
const RED_ALERT = "#d32f2f";

const Dashboard: React.FC<T_DASHBOARD> = ({ navigation }) => {
  const [token, setToken] = useState<string | null>(null);
  const { getCredentials } = useAuth0();
  const [user, setUser] = useState<IUser>();
  const [address, setAddress] = useState<string>("Detecting address...");
  const [safetyGuides, setSafetyGuides] = useState<SafetyGuide[]>([]);
  const [news, setNews] = useState([]);

  // --- NGO JOIN STATES ---
  const [isNgoModalVisible, setNgoModalVisible] = useState(false);
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [isLoadingNgos, setIsLoadingNgos] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

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
  };

  // --- HANDLERS FOR NGO JOIN ---
  const openNgoModal = async () => {
    setNgoModalVisible(true);
    if (ngos.length === 0) {
      setIsLoadingNgos(true);
      const data = await getAllNgos(token || "");
      setNgos(data);
      setIsLoadingNgos(false);
    }
  };

  const handleJoinNgo = async (ngoId: string, ngoName: string) => {
    setIsJoining(true);
    try {
      await postJoinNgo(token || "", ngoId);
      Alert.alert("Success", `You have successfully joined ${ngoName}!`);
      setNgoModalVisible(false);
      const updatedUser = await getLoggedInUser(token || "");
      setUser(updatedUser);
    } catch (error) {
      Alert.alert("Error", "Failed to join NGO. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* --- HEADER --- */}
      <View style={styles.headerContainer}>
        <View style={styles.profileRow}>
          <TouchableOpacity onPress={() => navigation.navigate("ProfileSettings", {})} style={styles.avatarWrapper}>
            <Image source={{ uri: user?.picture || "https://dummyimage.com/100/ffffff/1f3d18&text=User" }} style={styles.avatar} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.greetingText}>Welcome back,</Text>
            <Text style={styles.nameText}>{user?.name || "Rescue User"}</Text>
            <Text style={[styles.nameText, { fontSize: 12 }]}>{user?.ngo?.name}</Text>
          </View>
          <View style={styles.headerActions}>
            {/* JOIN NGO BUTTON */}
            <TouchableOpacity style={styles.headerIconBtn} onPress={openNgoModal}>
                <Ionicons name="people-outline" size={20} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.navigate("InteractiveDonationNetwork", {})}>
              <Ionicons name="notifications-outline" size={20} color="#FFF" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>

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

      {/* --- NGO SELECTION MODAL --- */}
      <Modal
        visible={isNgoModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setNgoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Join an NGO</Text>
                    <TouchableOpacity onPress={() => setNgoModalVisible(false)}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.modalSubtitle}>Select an organization to volunteer with:</Text>
                
                {isLoadingNgos ? (
                    <ActivityIndicator size="large" color={GREEN} style={{ marginVertical: 30 }} />
                ) : (
                    <FlatList
                        data={ngos}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingVertical: 10 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={styles.ngoItem} 
                                onPress={() => handleJoinNgo(item.id, item.name)}
                                disabled={isJoining}
                            >
                                <View style={styles.ngoIcon}>
                                    <Ionicons name="business" size={20} color={GREEN} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.ngoName}>{item.name}</Text>
                                    <Text style={styles.ngoType}>{item.type}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#CCC" />
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </View>
      </Modal>

    </View>
  );
}

// Subcomponent for Emergency Buttons
const EmergencyBtn = ({ label, num, icon, color, onPress }: any) => (
    <TouchableOpacity style={[styles.emCard, { borderLeftColor: color }]} onPress={onPress}>
        <View style={[styles.emIconCircle, { backgroundColor: color + '15' }]}>
            <MaterialIcons name={icon} size={20} color={color} />
        </View>
        <Text style={styles.emNumber}>{num}</Text>
        <Text style={styles.emLabel}>{label}</Text>
    </TouchableOpacity>
);

export default Dashboard;