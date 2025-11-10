import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
    FlatList,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
import { T_DASHBOARD } from "./types";

const guides = [
  { id: "g1", title: "Before Disaster-\nGet Ready" },
  { id: "g2", title: "During Disaster-\nStay Safe" },
  { id: "g3", title: "After Disaster-\nRecover Fast" },
];

const news = [
  {
    id: "n1",
    title: "Flash Floods Hit Islamabad:",
    body: "E-11 & F-10 areas waterlogged; residents urged to stay indoors.",
  },
  {
    id: "n2",
    title: "Rescue Teams on Alert:",
    body: "NDMA and CDA clear debris, assist stranded families.",
  },
];

const Dashboard: React.FC<T_DASHBOARD> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Red Alert Banner */}
        <View style={styles.alertCard}>
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
        </View>

        {/* Profile Row */}
        <View style={styles.profileRow}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop" }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Jamie</Text>
            <Text style={styles.location}>G-13, Islamabad</Text>
          </View>

          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="notifications-outline" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="person-circle-outline" size={22} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <TouchableOpacity>
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
          <TouchableOpacity>
            <Text style={styles.linkText}>Read More</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={guides}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.guideCard}>
              <View style={styles.guideThumb} />
              <Text style={styles.guideTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Related News */}
        <View style={[styles.sectionHeaderRow, { marginTop: 16 }]}>
          <Text style={styles.sectionTitle}>RELATED NEWS</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Read More</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          {news.map((n) => (
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

      {/* Bottom Tab (static mock) */}
      <View style={styles.bottomTabWrap}>
        <View style={styles.bottomTab}>
          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="home" size={20} color="#FFFFFF" />
            <Text style={styles.tabText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="people" size={20} color="#FFFFFF" />
            <Text style={styles.tabText}>Groups</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="notifications" size={20} color="#FFFFFF" />
            <Text style={styles.tabText}>Notifications</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default Dashboard;
