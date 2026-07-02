import FancyAppHeader, { fancyHeaderStyles } from "@/components/fancyAppHeader";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
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
const GREEN = "#1f3d18";
const BG_LIGHT = "#F4F7F4";

type NewsDetailsParams = {
  title?: string;
  sourceName?: string;
  timeAgo?: string;
  imageUrl?: string;
  body?: string;
};

const NewsDetails: React.FC<T_NEWSDETAILS> = ({ navigation, route }) => {
  const {
    title = "Flash Floods Hit Islamabad: E-11 & F-10 Areas Waterlogged",
    sourceName = "Geo News",
    timeAgo = "1 day ago",
    imageUrl = "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=900&h=600&fit=crop",
    body = [
      "Heavy rainfall lashed parts of Islamabad on [insert date], triggering flash floods in the E-11 and F-10 sectors. Streets quickly filled with rainwater, disrupting traffic and flooding several residential areas.",
      "Videos shared on social media showed vehicles stranded in ankle-deep water while rescue teams assisted families trapped in basements. Authorities have urged residents to avoid low-lying areas and stay indoors until conditions improve.",
      "The Capital Development Authority (CDA) and NDMA have deployed emergency response units to clear drainage channels and restore access in affected zones. Commuters are advised to monitor weather alerts and use alternate routes.",
    ].join("\n\n"),
  } = (route?.params as NewsDetailsParams) ?? {};

  const onShare = async () => {
    try {
      await Share.share({ message: `${title}\n\nRead more on Rescue Link.` });
    } catch (error) { console.log(error); }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <FancyAppHeader
        title="News Details"
        subtitle="Emergency briefing & verified report"
        badge={{ icon: "megaphone", label: "URGENT UPDATE" }}
        onBack={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity onPress={onShare} style={fancyHeaderStyles.backBtn}>
            <Ionicons name="share-social-outline" size={18} color="#FFF" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        {/* News Badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>URGENT UPDATE</Text>
        </View>

        {/* Title */}
        <Text style={styles.mainTitle}>{title}</Text>

        {/* Enhanced Meta Row */}
        <View style={styles.metaRow}>
          <View style={styles.sourceInfo}>
            <View style={styles.sourceAvatar}>
              <Text style={styles.sourceInitial}>{sourceName[0]}</Text>
            </View>
            <View>
              <Text style={styles.sourceNameText}>{sourceName}</Text>
              <Text style={styles.timeText}>{timeAgo} • 4 min read</Text>
            </View>
          </View>
        </View>

        {/* Cover Image with Radius & Shadow */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUrl }} style={styles.coverImage} />
        </View>

        {/* Content Body */}
        <View style={styles.contentContainer}>
          <Text style={styles.bodyText}>{body}</Text>
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
  categoryBadge: { backgroundColor: '#F0F4F0', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#E0E8E0' },
  categoryText: { color: GREEN, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  
  mainTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', lineHeight: 32, marginBottom: 20 },
  
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  sourceInfo: { flexDirection: 'row', alignItems: 'center' },
  sourceAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: GREEN, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  sourceInitial: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  sourceNameText: { fontSize: 16, fontWeight: '700', color: '#333' },
  timeText: { fontSize: 12, color: '#999', marginTop: 2 },

  imageWrapper: { elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, marginBottom: 25 },
  coverImage: { width: '100%', height: 220, borderRadius: 24 },

  contentContainer: { marginBottom: 30 },
  bodyText: { fontSize: 16, color: '#444', lineHeight: 26, fontWeight: '400', textAlign: 'justify' },

  disclaimerCard: { 
    flexDirection: 'row', backgroundColor: '#FFF', padding: 20, borderRadius: 20, 
    alignItems: 'center', borderWidth: 1, borderColor: '#EEE', marginTop: 10
  },
  disclaimerText: { flex: 1, marginLeft: 12, fontSize: 12, color: '#666', lineHeight: 18, fontWeight: '500' }
});

export default NewsDetails;