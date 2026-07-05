import { getAllNews } from "@/api/getAllNews";
import { getAllNgos, NGO } from "@/api/getAllNgos";
import { getLatestRisk } from "@/api/getLatestRisk";
import { getLoggedInUser, IUser } from "@/api/getLoggedInUser";
import { getSafetyGuides, SafetyGuide } from "@/api/getSafetyGuides";
import { getUnreadNotificationCount } from "@/api/getUnreadNotificationCount";
import { postJoinNgo } from "@/api/postJoinNgo";
import FancyAppHeader from "@/components/fancyAppHeader";
import { getAddressFromCoords } from "@/utils/getAddressFromCoords";
import { getNewsCategoryStyle, STATIC_NEWS_FEED } from "@/utils/newsDisplay";
import { regionFromLatLng } from "@/utils/regionFromLocation";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
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

const GREEN = "#0f4c3a";
const RED_ALERT = "#d32f2f";
const RISK_THRESHOLD = 40; // matches decisions.service.ts: score >= 40 is "medium"/"high", else "low"

type DisplayGuide = {
  id: string;
  title: string;
  meta: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
};

const GUIDE_ICON_BY_SLUG: Record<string, { icon: keyof typeof Ionicons.glyphMap; tint: string }> = {
  flood: { icon: "water", tint: "#2563EB" },
  earthquake: { icon: "warning", tint: "#B45309" },
  fire: { icon: "flame", tint: "#C0392B" },
  "first-aid": { icon: "medkit", tint: "#0D9488" },
};

const STATIC_SAFETY_GUIDES: DisplayGuide[] = [
  { id: "static-flood", title: "Flood Safety: Before, During & After", meta: "6 steps", icon: "water", tint: "#2563EB" },
  { id: "static-earthquake", title: "Earthquake Response: Drop, Cover, Hold", meta: "5 steps", icon: "warning", tint: "#B45309" },
  { id: "static-fire", title: "Fire Emergency: Evacuation Basics", meta: "4 steps", icon: "flame", tint: "#C0392B" },
  { id: "static-firstaid", title: "First Aid Basics: CPR & Wound Care", meta: "7 steps", icon: "medkit", tint: "#0D9488" },
  { id: "static-kit", title: "Emergency Kit: What to Pack", meta: "8 items", icon: "bag-handle", tint: GREEN },
];

const mapGuideToDisplay = (g: SafetyGuide): DisplayGuide => {
  const preset = GUIDE_ICON_BY_SLUG[g.disasterType?.slug] ?? { icon: "shield-checkmark" as const, tint: GREEN };
  return {
    id: g.id,
    title: g.title,
    meta: `${g.steps?.length ?? 0} steps`,
    icon: preset.icon,
    tint: preset.tint,
  };
};

type DisplayNews = {
  id: string;
  title: string;
  description: string;
  category: string;
  meta: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
};

const STATIC_NEWS: DisplayNews[] = STATIC_NEWS_FEED.slice(0, 3).map((item, index) => {
  const preset = getNewsCategoryStyle(index);
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    meta: item.meta,
    category: preset.category,
    icon: preset.icon,
    tint: preset.tint,
  };
});

const mapNewsToDisplay = (n: any, index: number): DisplayNews => {
  const preset = getNewsCategoryStyle(index);
  return {
    id: n.id,
    title: n.title,
    description: n.description,
    category: preset.category,
    meta: "Recently",
    icon: preset.icon,
    tint: preset.tint,
  };
};

const Dashboard: React.FC<T_DASHBOARD> = ({ navigation }) => {
  const [token, setToken] = useState<string | null>(null);
  const { getCredentials } = useAuth0();
  const [user, setUser] = useState<IUser>();
  const [address, setAddress] = useState<string>("Detecting address...");
  const [safetyGuides, setSafetyGuides] = useState<SafetyGuide[]>([]);
  const [news, setNews] = useState([]);
  const [activeAlert, setActiveAlert] = useState<{ title: string; body: string } | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

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

  useFocusEffect(
    useCallback(() => {
      if (!token) return;
      getUnreadNotificationCount(token).then(setUnreadCount).catch(() => {});
    }, [token])
  );

  const loadData = async () => {
    const safetyGuidesResponse = await getSafetyGuides({});
    const response = await getLoggedInUser(token || "");
    setUser(response);
    if (response?.location) {
      const addr = await getAddressFromCoords(response.location.y, response.location.x);
      setAddress(addr?.full || "Islamabad, Pakistan");
    }
    if (response?.latitude && response?.longitude) {
      const region = regionFromLatLng(response.latitude, response.longitude);
      try {
        const risks = await getLatestRisk(region);
        const topRisk = risks.reduce<typeof risks[number] | null>(
          (max, r) => (r.score > (max?.score ?? -1) ? r : max),
          null
        );
        if (topRisk && topRisk.score >= RISK_THRESHOLD) {
          const level = topRisk.score >= 70 ? "High" : "Elevated";
          setActiveAlert({
            title: `${topRisk.disasterName ?? "Risk"} Alert: ${level} Risk`,
            body: `Risk score ${topRisk.score}/100 in your area. Stay alert and follow safety guidance.`,
          });
        } else {
          setActiveAlert(null);
        }
      } catch {
        setActiveAlert(null);
      }
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

  const displayGuides: DisplayGuide[] =
    safetyGuides.length > 0 ? safetyGuides.map(mapGuideToDisplay) : STATIC_SAFETY_GUIDES;

  const displayNews: DisplayNews[] =
    news.length > 0 ? news.map(mapNewsToDisplay) : STATIC_NEWS;

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
      <StatusBar barStyle="light-content" backgroundColor="#0f4c3a" />
      
      <FancyAppHeader
        showBack={false}
        headerContent={
          <View style={styles.profileRow}>
            <TouchableOpacity onPress={() => navigation.navigate("ProfileSettings", {})} style={styles.avatarWrapper}>
              <Image source={{ uri: user?.picture || "https://dummyimage.com/100/ffffff/0f4c3a&text=User" }} style={styles.avatar} />
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.greetingText}>Welcome back,</Text>
              <Text style={styles.nameText}>{user?.name || "Rescue User"}</Text>
              <Text style={[styles.nameText, { fontSize: 12 }]}>{user?.ngo?.name}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.navigate("Notifications", {})}>
                <Ionicons name="notifications-outline" size={20} color="#FFF" />
                {unreadCount > 0 && <View style={styles.notifDot} />}
              </TouchableOpacity>
            </View>
          </View>
        }
        badge={{ icon: "shield-checkmark", label: "SDH RESCUE PLATFORM" }}
        footer={
          <View style={styles.locationCard}>
            <Ionicons name="location" size={16} color={GREEN} />
            <Text style={styles.locationText} numberOfLines={1}>{address}</Text>
            <View style={[styles.statusBadge, activeAlert && styles.statusBadgeAlert]}>
              <Text style={[styles.statusText, activeAlert && styles.statusTextAlert]}>
                {activeAlert ? "AT RISK" : "SAFE"}
              </Text>
            </View>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* Urgent Alert Banner */}
        {activeAlert ? (
          <TouchableOpacity onPress={() => navigation.navigate("RiskLevels", {})} style={styles.alertCard}>
              <View style={styles.alertIconBg}>
                  <MaterialCommunityIcons name="alert-decagram" size={24} color={RED_ALERT} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.alertTitle}>{activeAlert.title}</Text>
                  <Text style={styles.alertBody}>{activeAlert.body}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CCC" />
          </TouchableOpacity>
        ) : null}

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

        {/* Quick Actions */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.quickActionRow}>
          <QuickActionBtn
            label="Engagement Hub"
            icon="trophy"
            color="#7C3AED"
            onPress={() => navigation.navigate("UserEnagagementHub", {})}
          />
          <QuickActionBtn
            label="Response Framework"
            icon="grid"
            color="#DC2626"
            onPress={() => navigation.navigate("DisasterResponseFramework", {})}
          />
          <QuickActionBtn
            label="Donation Network"
            icon="gift"
            color="#9333EA"
            onPress={() => navigation.navigate("InteractiveDonationNetwork", {})}
          />
        </View>

        <TouchableOpacity onPress={openNgoModal} style={styles.joinNgoCard}>
          <View style={styles.joinNgoIconBg}>
            <Ionicons name="people" size={22} color="#fff" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.joinNgoTitle}>Join an NGO</Text>
            <Text style={styles.joinNgoBody}>Volunteer with a verified rescue organization</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>

        {/* Safety Guides Horizontal Scroll */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Interactive Safety Guides</Text>
        </View>

        <FlatList
          horizontal
          data={displayGuides}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 10, paddingBottom: 10 }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.guideCard}
              onPress={() => {
                const staticKey = item.id.replace("static-", "");
                if (["flood", "earthquake", "fire"].includes(staticKey)) {
                  navigation.navigate("StaticGuideDetail", { guideKey: staticKey as "flood" | "earthquake" | "fire" });
                  return;
                }
                if (item.id.startsWith("static-")) {
                  Alert.alert(item.title, "The full step-by-step guide for this topic is coming soon.");
                  return;
                }
                navigation.navigate("SafetyGuideDetail", { id: item.id, title: item.title });
              }}
            >
              <View style={[styles.guideIconCircle, { backgroundColor: item.tint + "1F" }]}>
                 <Ionicons name={item.icon} size={20} color={item.tint} />
              </View>
              <Text style={styles.guideTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.guideMeta}>{item.meta}</Text>
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
          {displayNews.map((n) => (
            <TouchableOpacity
              key={n.id}
              style={styles.newsCard}
              onPress={() => navigation.navigate("NewsDetails", {
                title: n.title,
                body: n.description,
                timeAgo: n.meta,
                category: n.category,
                icon: n.icon,
                tint: n.tint,
              })}
            >
              <View style={[styles.newsThumb, styles.newsThumbIcon, { backgroundColor: n.tint + "1F" }]}>
                <Ionicons name={n.icon} size={26} color={n.tint} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={[styles.categoryChip, { backgroundColor: n.tint + "1F" }]}>
                  <Text style={[styles.categoryChipText, { color: n.tint }]}>{n.category.toUpperCase()}</Text>
                </View>
                <Text style={styles.newsCardTitle} numberOfLines={2}>{n.title}</Text>
                <Text style={styles.newsCardBody} numberOfLines={1}>{n.description}</Text>
                <Text style={styles.newsMeta}>{n.meta} • Local Update</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.sectionHeaderRow, { marginTop: 15 }]}>
          <Text style={styles.sectionTitle}>Wellbeing & Trust</Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity onPress={() => navigation.navigate("MentalHealthSupport", {})} style={styles.newsCard}>
            <View style={[styles.guideIconCircle, { marginBottom: 0 }]}>
              <Ionicons name="heart-half-outline" size={20} color={GREEN} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.newsCardTitle}>Mental Health Support</Text>
              <Text style={styles.newsCardBody}>Professional access, self-help resources, NGO connections.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#BBB" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("DataBackupSecurity", {})} style={styles.newsCard}>
            <View style={[styles.guideIconCircle, { marginBottom: 0 }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={GREEN} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.newsCardTitle}>Data Backup Security</Text>
              <Text style={styles.newsCardBody}>Encrypted storage, access control, sync, and recovery options.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#BBB" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("ReviewsFeedback", {})} style={styles.newsCard}>
            <View style={[styles.guideIconCircle, { marginBottom: 0 }]}>
              <Ionicons name="star-outline" size={20} color={GREEN} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.newsCardTitle}>Reviews and Feedback</Text>
              <Text style={styles.newsCardBody}>Star ratings, text/anonymous feedback, and admin review tracking.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#BBB" />
          </TouchableOpacity>
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

// Subcomponent for Quick Action Buttons
const QuickActionBtn = ({ label, icon, color, onPress }: { label: string; icon: keyof typeof Ionicons.glyphMap; color: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
        <View style={[styles.quickActionIconCircle, { backgroundColor: color + '15' }]}>
            <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={styles.quickActionLabel} numberOfLines={2}>{label}</Text>
    </TouchableOpacity>
);

export default Dashboard;