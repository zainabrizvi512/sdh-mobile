import { getAllNews } from "@/api/getAllNews";
import { getLoggedInUser } from "@/api/getLoggedInUser";
import { getSafetyGuides, SafetyGuide } from "@/api/getSafetyGuides";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
import { T_DASHBOARD } from "./types";

const Dashboard: React.FC<T_DASHBOARD> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [token, setToken] = useState<string | null>(null);
  const { getCredentials, user } = useAuth0();
  const [safetyGuides, setSafetyGuides] = useState<SafetyGuide[]>([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const creds = await getCredentials();
        if (mounted) setToken(creds?.accessToken ?? null);
      } catch {
        setToken(null);
      }
    })();
    return () => { mounted = false; };
  }, [getCredentials]);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    const safetyGuidesResponse = await getSafetyGuides({});
    await getLoggedInUser(token || "");
    const newsResponse = await getAllNews(token || "");
    setSafetyGuides(safetyGuidesResponse);
    setNews(newsResponse.data.items.slice(0, 3));
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Red Alert Banner */}
        <TouchableOpacity onPress={() => { navigation.navigate("RiskLevels", {}) }} style={styles.alertCard}>
          <MaterialCommunityIcons name="alert" size={22} color="#1A1A1A" style={styles.alertIcon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>
              Flood Alert: Danger Level 3 in Isb Zone E-11 & F-10.
            </Text>
            <Text style={styles.alertBody}>
              Avoid driving near nullahs and low-lying areas.{"\n"}
              <Text style={styles.alertMeta}>Updated 9:40 PM — NDMA.</Text>
            </Text>
          </View>
        </TouchableOpacity>

        {/* Profile Row */}
        <View style={styles.profileRow}>
          <Image
            source={{ uri: user?.picture }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.location}>G-13, Islamabad</Text>
          </View>

          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="notifications-outline" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => { navigation.navigate("ProfileSettings", {}) }}>
            <Ionicons name="person-circle-outline" size={22} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <TouchableOpacity onPress={() => { navigation.navigate("EmergencyContactsListing", {}) }}>
            <Text style={styles.linkText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emergencyRow}>
          <TouchableOpacity style={[styles.emergencyCard, styles.emRed]}>
            <MaterialIcons name="local-police" size={22} color="#fff" />
            <Text style={styles.emLabel}>Police</Text>
            <Text style={styles.emNumber}>15</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.emergencyCard, styles.emRed]}>
            <MaterialIcons name="local-hospital" size={22} color="#fff" />
            <Text style={styles.emLabel}>Ambulance</Text>
            <Text style={styles.emNumber}>108</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.emergencyCard, styles.emRed]}>
            <MaterialIcons name="local-fire-department" size={22} color="#fff" />
            <Text style={styles.emLabel}>Fire</Text>
            <Text style={styles.emNumber}>911</Text>
          </TouchableOpacity>
        </View>

        {/* Interactive Safety Guides */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Interactive Safety Guides</Text>
          <TouchableOpacity onPress={() => { navigation.navigate("SafetyGuides", {}) }}>
            <Text style={styles.linkText}>Read More</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={safetyGuides}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.guideCard} onPress={() => navigation.navigate("SafetyGuideDetail", { id: item.id, title: item.title })}>
              <Text style={styles.guideTitle} numberOfLines={1}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Related News */}
        <View style={[styles.sectionHeaderRow, { marginTop: 16 }]}>
          <Text style={styles.sectionTitle}>Related News</Text>
          <TouchableOpacity onPress={() => { navigation.navigate("NewsListing", {}) }}>
            <Text style={styles.linkText}>Read More</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          {news.map((n: any) => (
            <View key={n.id} style={styles.newsCard}>
              <View style={styles.newsThumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.newsTitle}>{n.title}</Text>
                <Text style={styles.newsBody}>{n.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default Dashboard;
