import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
import { T_NEWSDETAILS } from "./types";

type NewsDetailsParams = {
  title?: string;
  sourceName?: string;
  timeAgo?: string;   // e.g., "1 day ago"
  imageUrl?: string;
  body?: string;
};

const NewsDetails: React.FC<T_NEWSDETAILS> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();

  const {
    title = "Flash Floods Hit Islamabad: E-11 & F-10 Areas Waterlogged",
    sourceName = "Geo News",
    timeAgo = "1 day ago",
    imageUrl = "https://images.unsplash.com/photo-1507361219785-4852946b8835?w=900&h=600&fit=crop",
    body = [
      "Heavy rainfall lashed parts of Islamabad on [insert date], triggering flash floods in the E-11 and F-10 sectors. Streets quickly filled with rainwater, disrupting traffic and flooding several residential areas.",
      "Videos shared on social media showed vehicles stranded in ankle-deep water while rescue teams assisted families trapped in basements. Authorities have urged residents to avoid low-lying areas and stay indoors until conditions improve.",
      "The Capital Development Authority (CDA) and NDMA have deployed emergency response units to clear drainage channels and restore access in affected zones. Commuters are advised to monitor weather alerts and use alternate routes.",
    ].join("\n\n"),
  } = (route?.params as NewsDetailsParams) ?? {};

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>News Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Source row */}
        <View style={styles.sourceRow}>
          <Image
            source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Globe_icon.svg" }}
            style={styles.sourceIcon}
          />
          <Text style={styles.sourceName}>{sourceName}</Text>
          <View style={styles.dot} />
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>

        {/* Cover image */}
        <Image source={{ uri: imageUrl }} style={styles.cover} />

        {/* Body */}
        <Text style={styles.body}>{body}</Text>
      </ScrollView>
    </View>
  );
};

export default NewsDetails;
