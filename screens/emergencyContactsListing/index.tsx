import FancyAppHeader from "@/components/fancyAppHeader";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// --- THEME ---
const GREEN = "#0f4c3a";
const BG_LIGHT = "#F4F7F4";
const RED_ALERT = "#d32f2f";
export const FAV_KEY = "fav_contacts_v1";

const EmergencyContactsListing = ({ navigation }: any) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [favContacts, setFavContacts] = useState<any[]>([]);

  // -------- SecureStore & Logic ----------
  const loadFavs = useCallback(async () => {
    try {
      const stored = await SecureStore.getItemAsync(FAV_KEY);
      if (stored) setFavContacts(JSON.parse(stored).slice(0, 3));
    } catch (e) { console.warn(e); }
  }, []);

  const saveFavs = useCallback(async (list: any[]) => {
    setFavContacts(list);
    try { await SecureStore.setItemAsync(FAV_KEY, JSON.stringify(list)); } catch (e) { console.warn(e); }
  }, []);

  useEffect(() => { loadFavs(); }, []);

  const quickCall = (label: string, number: string) => {
    Alert.alert(label, `Dial ${number}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Call", onPress: () => Linking.openURL(`tel:${number}`) },
    ]);
  };

  const renderFav = (c: any) => (
    <View key={c.id} style={styles.favCard}>
      <Image source={{ uri: c.avatar || "https://dummyimage.com/100/1f3d18/ffffff&text=" + c.name[0] }} style={styles.favAvatar} />
      <Text style={styles.favName} numberOfLines={1}>{c.name}</Text>
      <TouchableOpacity style={styles.favCallBtn} onPress={() => quickCall(c.name, c.phone)}>
        <Ionicons name="call" size={12} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f4c3a" />
      
      <FancyAppHeader
        title="Emergency Contacts"
        subtitle="Instant rescue links & favourite dial list"
        badge={{ icon: "call", label: "RESCUE LINKS" }}
        onBack={() => navigation.goBack()}
        footer={
          <>
            <View style={styles.quickActionRow}>
              <EmergencyPill label="Police" num="15" icon="local-police" color={RED_ALERT} onPress={() => quickCall("Police", "15")} />
              <EmergencyPill label="Rescue" num="1122" icon="local-hospital" color="#E67E22" onPress={() => quickCall("Rescue", "1122")} />
              <EmergencyPill label="Fire" num="16" icon="local-fire-department" color="#C0392B" onPress={() => quickCall("Fire", "16")} />
            </View>
            <View style={styles.searchBarContainer}>
              <Ionicons name="search" size={18} color="rgba(255,255,255,0.6)" />
              <TextInput
                placeholder="Search contacts..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={styles.searchInput}
                value={query}
                onChangeText={setQuery}
              />
            </View>
          </>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        
        {/* --- FAVOURITES SECTION --- */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>FAVOURITE CONTACTS</Text>
            <View style={styles.titleLine} />
        </View>
        
        <View style={styles.favRow}>
          {favContacts.length === 0 ? (
            <View style={styles.emptyFav}>
               <Text style={styles.emptyText}>Tap "+" on contacts to add here.</Text>
            </View>
          ) : (
            favContacts.map(renderFav)
          )}
        </View>

        {/* --- ALL CONTACTS SECTION --- */}
        <View style={[styles.sectionHeader, { marginTop: 25 }]}>
            <Text style={styles.sectionTitle}>ALL CONTACTS</Text>
            <View style={styles.titleLine} />
        </View>

        <View style={styles.contactListCard}>
             <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={40} color="#CCC" />
                <Text style={styles.emptyText}>Contacts will appear here after sync...</Text>
             </View>
        </View>

      </ScrollView>
    </View>
  );
};

// --- SUB-COMPONENTS ---
const EmergencyPill = ({ label, num, icon, color, onPress }: any) => (
    <TouchableOpacity style={[styles.quickCard, { backgroundColor: color }]} onPress={onPress}>
        <MaterialIcons name={icon} size={22} color="#FFF" />
        <Text style={styles.quickNum}>{num}</Text>
        <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
);

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_LIGHT },

  quickActionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  quickCard: { width: '30%', padding: 15, borderRadius: 20, alignItems: 'center', elevation: 5 },
  quickNum: { color: '#FFF', fontSize: 16, fontWeight: '900', marginTop: 4 },
  quickLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },

  searchBarContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 15, alignItems: 'center' },
  searchInput: { flex: 1, marginLeft: 10, color: '#FFF', fontSize: 14, fontWeight: '600' },

  scrollBody: { padding: 25, paddingBottom: 50 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 11, fontWeight: '900', color: GREEN, letterSpacing: 1.5 },
  titleLine: { flex: 1, height: 1, backgroundColor: GREEN, opacity: 0.1, marginLeft: 10 },

  favRow: { flexDirection: 'row', gap: 10 },
  favCard: { 
    backgroundColor: '#FFF', width: '31.5%', padding: 12, borderRadius: 24, 
    alignItems: 'center', elevation: 3, borderWidth: 1, borderColor: '#EEF2EE' 
  },
  favAvatar: { width: 44, height: 44, borderRadius: 18, marginBottom: 8, backgroundColor: '#F0F4F0' },
  favName: { fontSize: 11, fontWeight: '700', color: '#333' },
  favCallBtn: { 
    backgroundColor: GREEN, width: 26, height: 26, borderRadius: 13, 
    justifyContent: 'center', alignItems: 'center', marginTop: 10 
  },

  contactListCard: { backgroundColor: '#FFF', borderRadius: 28, padding: 20, minHeight: 150, justifyContent: 'center', elevation: 2 },
  emptyState: { alignItems: 'center' },
  emptyFav: { backgroundColor: 'rgba(0,0,0,0.03)', padding: 20, borderRadius: 20, width: '100%', borderStyle: 'dashed', borderWidth: 1, borderColor: '#CCC' },
  emptyText: { color: '#999', fontSize: 12, textAlign: 'center', marginTop: 10 }
});

export default EmergencyContactsListing;