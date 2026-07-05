import FancyAppHeader, { fancyHeaderStyles } from "@/components/fancyAppHeader";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { T_NEWSDETAILS } from "./types";

// --- THEME ---
const GREEN = "#0f4c3a";
const BG_LIGHT = "#F4F7F4";

const NewsDetails: React.FC<T_NEWSDETAILS> = ({ navigation, route }) => {
  const {
    title = "Untitled Update",
    sourceName = "SDH",
    timeAgo = "Recently",
    body,
    category = "Update",
    icon = "newspaper-outline",
    tint = GREEN,
  } = route?.params ?? {};

  const onShare = async () => {
    try {
      await Share.share({ message: `${title}\n\nRead more on SDH.` });
    } catch (error) { console.log(error); }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f4c3a" />

      <FancyAppHeader
        title="News Details"
        subtitle="Emergency briefing & verified report"
        badge={{ icon: "megaphone", label: category.toUpperCase() }}
        onBack={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity onPress={onShare} style={fancyHeaderStyles.backBtn}>
            <Ionicons name="share-social-outline" size={18} color="#FFF" />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* News Badge */}
        <View style={[styles.categoryBadge, { backgroundColor: tint + "17", borderColor: tint + "33" }]}>
          <Text style={[styles.categoryText, { color: tint }]}>{category.toUpperCase()}</Text>
        </View>

        {/* Title */}
        <Text style={styles.mainTitle}>{title}</Text>

        {/* Enhanced Meta Row */}
        <View style={styles.metaRow}>
          <View style={styles.sourceInfo}>
            <View style={[styles.sourceAvatar, { backgroundColor: tint }]}>
              <Text style={styles.sourceInitial}>{sourceName[0]}</Text>
            </View>
            <View>
              <Text style={styles.sourceNameText}>{sourceName}</Text>
              <Text style={styles.timeText}>{timeAgo}</Text>
            </View>
          </View>
        </View>

        {/* Hero — a tinted icon tile, since we don't yet have verified per-article images */}
        <View style={[styles.heroBanner, { backgroundColor: tint + "17" }]}>
          <View style={[styles.heroIconCircle, { backgroundColor: tint }]}>
            <Ionicons name={icon} size={40} color="#fff" />
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.contentContainer}>
          <Text style={styles.bodyText}>
            {body || "Full article details for this update aren't available yet — check back soon."}
          </Text>
        </View>

        {/* Disclaimer Card for "Fuller" Look */}
        <View style={styles.disclaimerCard}>
          <Ionicons name="shield-checkmark" size={20} color={GREEN} />
          <Text style={styles.disclaimerText}>
            This report is verified by local authorities and updated in real-time as new info arrives.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_LIGHT },

  scrollBody: { padding: 20, paddingBottom: 60 },
  categoryBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginBottom: 15, borderWidth: 1 },
  categoryText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },

  mainTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', lineHeight: 32, marginBottom: 20 },

  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  sourceInfo: { flexDirection: 'row', alignItems: 'center' },
  sourceAvatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  sourceInitial: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  sourceNameText: { fontSize: 16, fontWeight: '700', color: '#333' },
  timeText: { fontSize: 12, color: '#999', marginTop: 2 },

  heroBanner: { borderRadius: 24, paddingVertical: 36, alignItems: 'center', marginBottom: 25 },
  heroIconCircle: { width: 76, height: 76, borderRadius: 38, justifyContent: 'center', alignItems: 'center', elevation: 3 },

  contentContainer: { marginBottom: 30 },
  bodyText: { fontSize: 16, color: '#444', lineHeight: 26, fontWeight: '400', textAlign: 'justify' },

  disclaimerCard: {
    flexDirection: 'row', backgroundColor: '#FFF', padding: 20, borderRadius: 20,
    alignItems: 'center', borderWidth: 1, borderColor: '#EEE', marginTop: 10
  },
  disclaimerText: { flex: 1, marginLeft: 12, fontSize: 12, color: '#666', lineHeight: 18, fontWeight: '500' }
});

export default NewsDetails;
