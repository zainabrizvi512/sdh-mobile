import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Linking,
  NativeModules,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
import { T_EMERGENCYCONTACTSLISTING } from "./types";

type Contact = {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  fav?: boolean;
};

const FAV_KEY = "fav_contacts_v1";

const { ContactPicker } = NativeModules as {
  ContactPicker: {
    getContacts: (
      page: number,
      pageSize: number,
      query?: string | null
    ) => Promise<{
      data: Contact[];
      meta: { total: number; page: number; pageSize: number; hasNextPage: boolean };
    }>;
  };
};

async function ensureContactsPermission() {
  if (Platform.OS !== "android") return true;
  const res = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_CONTACTS
  );
  return res === PermissionsAndroid.RESULTS.GRANTED;
}

function normalizePhone(raw: string) {
  const trimmed = raw.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  const digits = trimmed.replace(/[^\d]/g, "");
  return plus + digits;
}

async function callNumber(number: string) {
  try {
    const n = normalizePhone(number);
    const url = `tel:${n}`;
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert("Cannot place call", "Your device cannot handle phone calls.");
      return;
    }
    await Linking.openURL(url);
  } catch {
    Alert.alert("Call failed", "Something went wrong while starting the call.");
  }
}

const PAGE_SIZE = 200;

const EmergencyContactsListing: React.FC<T_EMERGENCYCONTACTSLISTING> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [favContacts, setFavContacts] = useState<Contact[]>([]);

  // -------- SecureStore helpers ----------
  const loadFavs = useCallback(async () => {
    try {
      const stored = await SecureStore.getItemAsync(FAV_KEY);
      if (stored) {
        const parsed: Contact[] = JSON.parse(stored);
        setFavContacts(parsed.slice(0, 3));
      }
    } catch (e) {
      console.warn("Failed to load favourites:", e);
    }
  }, []);

  const saveFavs = useCallback(async (list: Contact[]) => {
    setFavContacts(list);
    try {
      await SecureStore.setItemAsync(FAV_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to save favourites:", e);
    }
  }, []);

  const isInFavs = useCallback(
    (c: Contact) =>
      favContacts.some(
        (f) => f.id === c.id || normalizePhone(f.phone) === normalizePhone(c.phone)
      ),
    [favContacts]
  );

  const addToFavs = useCallback(
    (c: Contact) => {
      if (isInFavs(c)) {
        Alert.alert("Already a favourite", `${c.name} is already in favourites.`);
        return;
      }
      if (favContacts.length >= 3) {
        Alert.alert(
          "Limit reached",
          "You can only keep 3 favourite contacts. Remove one to add a new favourite."
        );
        return;
      }
      const next = [...favContacts, { ...c, fav: true }];
      saveFavs(next);
    },
    [favContacts, isInFavs, saveFavs]
  );

  const promptToggleFav = useCallback(
    (c: Contact) => {
      if (isInFavs(c)) {
        Alert.alert("Remove favourite", `Remove ${c.name}?`, [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              const next = favContacts.filter(
                (f) =>
                  !(
                    f.id === c.id ||
                    normalizePhone(f.phone) === normalizePhone(c.phone)
                  )
              );
              saveFavs(next);
            },
          },
        ]);
      } else {
        addToFavs(c);
      }
    },
    [favContacts, isInFavs, addToFavs, saveFavs]
  );

  // -------- Load contacts ----------
  const loadPage = useCallback(
    async (reset = false) => {
      if (loading) return;
      const ok = await ensureContactsPermission();
      if (!ok) {
        Alert.alert("Permission needed", "Contacts permission is required.");
        return;
      }
      setLoading(true);
      try {
        const next = reset ? 0 : page;
        const res = await ContactPicker.getContacts(next, PAGE_SIZE, query.trim() || null);
        setContacts((prev) => (reset ? res.data : [...prev, ...res.data]));
        setHasNext(res.meta?.hasNextPage ?? false);
        setPage(next + 1);
      } finally {
        setLoading(false);
      }
    },
    [loading, page, query]
  );

  useEffect(() => {
    loadPage(true);
    loadFavs();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => loadPage(true), 250);
    return () => clearTimeout(t);
  }, [query]);

  const quickCall = (label: string, number: string) => {
    Alert.alert(label, `Dial ${number}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Call", onPress: () => callNumber(number) },
    ]);
  };

  const renderFav = (c: Contact) => (
    <View key={`${c.id}-${c.phone}`} style={styles.favItem}>
      <Image
        source={{
          uri: c.avatar || "https://dummyimage.com/100x100/edf2f7/475569&text=%20",
        }}
        style={styles.favAvatar}
      />
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

  const renderRow = ({ item }: { item: Contact }) => {
    const fav = isInFavs(item);
    return (
      <View style={styles.row}>
        <Image
          source={{
            uri: item.avatar || "https://dummyimage.com/100x100/edf2f7/475569&text=%20",
          }}
          style={styles.rowAvatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.rowName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.rowPhone}>{item.phone}</Text>
        </View>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => promptToggleFav(item)}
        >
          <Ionicons
            name={fav ? "checkmark-circle" : "add-circle"}
            size={22}
            color="#175B34"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => quickCall(item.name, item.phone)}
        >
          <Ionicons name="call-outline" size={22} color="#175B34" />
        </TouchableOpacity>
      </View>
    );
  };

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
        <View style={styles.favRow}>
          {favContacts.length === 0 ? (
            <Text style={{ color: "#6b7280", marginLeft: 16 }}>
              No favourites yet. Tap “+” on a contact to add.
            </Text>
          ) : (
            favContacts.map(renderFav)
          )}
        </View>

        {/* All Contacts */}
        <Text style={[styles.sectionHeading, { marginTop: 8 }]}>
          All Contacts
        </Text>
        <FlatList
          data={contacts}
          keyExtractor={(i) => i.id}
          renderItem={renderRow}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          ListEmptyComponent={
            <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
              <Text style={{ color: "#6b7280" }}>
                {loading ? "Loading contacts…" : "No contacts found."}
              </Text>
            </View>
          }
          ListFooterComponent={
            hasNext ? (
              <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                <TouchableOpacity
                  onPress={() => loadPage(false)}
                  disabled={loading}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    backgroundColor: loading ? "#f3f4f6" : "#fff",
                  }}
                >
                  <Text style={{ color: "#111827" }}>
                    {loading ? "Loading…" : "Load more"}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      </ScrollView>
    </View>
  );
};

export default EmergencyContactsListing;
