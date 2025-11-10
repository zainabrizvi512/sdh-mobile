import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
    Alert,
    FlatList,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
import { T_EMERGENCYCONTACTSLISTING } from "./types";

type Contact = {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  fav?: boolean;
};

const FAVS: Contact[] = [
  {
    id: "f1",
    name: "Mom",
    phone: "+923001234567",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop",
    fav: true,
  },
  {
    id: "f2",
    name: "Dad",
    phone: "+923001234568",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop",
    fav: true,
  },
  {
    id: "f3",
    name: "Sister",
    phone: "+923001234569",
    avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=300&h=300&fit=crop",
    fav: true,
  },
];

const ALL_CONTACTS: Contact[] = [
  { id: "1", name: "Emma", phone: "+92354867967", avatar: "https://images.unsplash.com/photo-1544005313-ffaf79a3f1b8?w=300&h=300&fit=crop" },
  { id: "2", name: "Emma", phone: "+92354867967", avatar: "https://images.unsplash.com/photo-1544005313-4dc12f03d5d2?w=300&h=300&fit=crop" },
  { id: "3", name: "Emma", phone: "+92354867967", avatar: "https://images.unsplash.com/photo-1544005313-3b3b0063f3c0?w=300&h=300&fit=crop" },
  { id: "4", name: "Emma", phone: "+92354867967", avatar: "https://images.unsplash.com/photo-1544005310-7c30f3f1d17a?w=300&h=300&fit=crop" },
  { id: "5", name: "Emma", phone: "+92354867967", avatar: "https://images.unsplash.com/photo-1544005311-94ddf0286df2?w=300&h=300&fit=crop" },
];

const EmergencyContactsListing: React.FC<T_EMERGENCYCONTACTSLISTING> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
//EmergencyContactsListing
  const quickCall = (label: string, number: string) => {
    Alert.alert(label, `Dial ${number}?`);
    // Linking.openURL(`tel:${number}`)
  };

  const renderFav = (c: Contact) => (
    <View key={c.id} style={styles.favItem}>
      <Image source={{ uri: c.avatar }} style={styles.favAvatar} />
      <Text style={styles.favName} numberOfLines={1}>
        {c.name}
      </Text>
      <TouchableOpacity
        style={styles.callPill}
        onPress={() => quickCall(c.name, c.phone)}
      >
        <Ionicons name="call" size={14} color="#fff" />
        <Text style={styles.callPillText}>Call</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRow = ({ item }: { item: Contact }) => (
    <View style={styles.row}>
      <Image source={{ uri: item.avatar }} style={styles.rowAvatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.rowPhone}>{item.phone}</Text>
      </View>
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => Alert.alert("Add to favourites", `Add ${item.name}?`)}
      >
        <Ionicons name="add-circle" size={22} color="#175B34" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => quickCall(item.name, item.phone)}
      >
        <Ionicons name="call-outline" size={22} color="#175B34" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emergency Contacts</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Quick Emergency Cards */}
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={[styles.quickCard, styles.quickRed]}
            onPress={() => quickCall("Police", "15")}
          >
            <MaterialIcons name="local-police" size={22} color="#fff" />
            <Text style={styles.quickLabel}>Police</Text>
            <Text style={styles.quickNum}>15</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCard, styles.quickRed]}
            onPress={() => quickCall("Ambulance", "108")}
          >
            <MaterialIcons name="local-hospital" size={22} color="#fff" />
            <Text style={styles.quickLabel}>Ambulance</Text>
            <Text style={styles.quickNum}>108</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCard, styles.quickRed]}
            onPress={() => quickCall("Fire", "911")}
          >
            <MaterialIcons name="local-fire-department" size={22} color="#fff" />
            <Text style={styles.quickLabel}>Fire</Text>
            <Text style={styles.quickNum}>911</Text>
          </TouchableOpacity>
        </View>

        {/* Favourites */}
        <Text style={styles.sectionHeading}>Favourite Contacts</Text>
        <View style={styles.favRow}>{FAVS.map(renderFav)}</View>

        {/* All Contacts */}
        <Text style={[styles.sectionHeading, { marginTop: 8 }]}>All Contacts</Text>
        <FlatList
          data={ALL_CONTACTS}
          keyExtractor={(i) => i.id}
          renderItem={renderRow}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </ScrollView>

      {/* Bottom Tab (static mock to match your UI) */}
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

export default EmergencyContactsListing