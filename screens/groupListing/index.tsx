import { ApiGroup, getMyGroups } from "@/api/getMyGroups";
import CreateGroupModal from "@/components/createGroup";
import { BOTTOM_NAV_SCROLL_PADDING } from "@/components/bottomNav/styles";
import FancyAppHeader, { fancyHeaderStyles } from "@/components/fancyAppHeader";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { T_GROUPLISTING } from "./types";

const GREEN = "#0f4c3a";
const BG_LIGHT = "#F4F7F4";

const GroupListing: React.FC<T_GROUPLISTING> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [loadCreateGroupModal, setLoadCreateGroupModal] = useState<boolean>(false);

  const { getCredentials } = useAuth0();

  const mapApiToUi = useCallback((api: ApiGroup) => {
    const count = typeof api.membersCount === "number" ? api.membersCount : 
                  Array.isArray(api.members) ? api.members.length : 0;
    return {
      id: api.id,
      name: api.name,
      members: count,
      avatar: api.picture || undefined,
    };
  }, []);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const creds = await getCredentials();
      const token = creds?.accessToken || "";
      const res = await getMyGroups(token);
      const apiGroups: ApiGroup[] = Array.isArray(res.data) ? res.data : [];
      setGroups(apiGroups.map(mapApiToUi));
    } catch (e) {
      console.log("Failed to load groups", e);
    } finally {
      setLoading(false);
    }
  }, [getCredentials, mapApiToUi]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const creds = await getCredentials();
      const token = creds?.accessToken || "";
      const res = await getMyGroups(token);
      const apiGroups: ApiGroup[] = Array.isArray(res.data) ? res.data : [];
      setGroups(apiGroups.map(mapApiToUi));
    } finally {
      setRefreshing(false);
    }
  }, [getCredentials, mapApiToUi]);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  const filteredData = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter((g) => g.name.toLowerCase().includes(q));
  }, [query, groups]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.groupCard}
      onPress={() => { navigation?.navigate?.("GroupChat", { id: item.id, avatar: item.avatar || "", name: item.name, members: item.members }) }}
    >
      <View style={styles.avatarWrapper}>
        <Image
          style={styles.avatar}
          source={{ uri: item.avatar ?? "https://dummyimage.com/100/1f3d18/ffffff&text=" + item.name[0] }}
        />
        <View style={styles.onlineDot} />
      </View>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemSubtitle}>{item.members} Members active</Text>
      </View>
      <View style={styles.arrowBg}>
        <Ionicons name="chevron-forward" size={16} color={GREEN} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f4c3a" />
      
      <FancyAppHeader
        title="Groups"
        subtitle="Rescue coordination communities & chat hubs"
        badge={{ icon: "people", label: "COORDINATION HUB" }}
        onBack={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity onPress={() => setLoadCreateGroupModal(true)} style={fancyHeaderStyles.backBtn}>
            <Ionicons name="add" size={22} color="#FFF" />
          </TouchableOpacity>
        }
        footer={
          <View style={styles.searchWrapper}>
            <Ionicons name="search" size={18} color="rgba(255,255,255,0.6)" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search communities..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.searchInput}
            />
          </View>
        }
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {loading ? (
          <View style={styles.centerLoader}>
            <ActivityIndicator size="large" color={GREEN} />
            <Text style={styles.loaderText}>Syncing Communities...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(g) => g.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listPadding}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={GREEN} />
            }
            ListHeaderComponent={
                <View style={styles.listHeader}>
                    <Text style={styles.listHeaderText}>ACTIVE GROUPS ({filteredData.length})</Text>
                    <View style={styles.headerLine} />
                </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={50} color="#CCC" />
                <Text style={styles.emptyText}>
                  {query ? "No groups match your search." : "You haven't joined any groups yet."}
                </Text>
              </View>
            }
          />
        )}
      </KeyboardAvoidingView>

      <CreateGroupModal
        visible={loadCreateGroupModal}
        onClose={() => { setLoadCreateGroupModal(false) }}
        onAddMembers={() => {
          setLoadCreateGroupModal(false);
          fetchGroups();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_LIGHT },

  searchWrapper: { 
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', 
    paddingHorizontal: 15, paddingVertical: 12, borderRadius: 15, alignItems: 'center' 
  },
  searchInput: { flex: 1, marginLeft: 10, color: '#FFF', fontSize: 14, fontWeight: '600' },

  listPadding: { paddingHorizontal: 20, paddingBottom: BOTTOM_NAV_SCROLL_PADDING },
  listHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 25, marginBottom: 15, paddingHorizontal: 5 },
  listHeaderText: { fontSize: 10, fontWeight: '900', color: GREEN, letterSpacing: 1.5 },
  headerLine: { flex: 1, height: 1, backgroundColor: GREEN, opacity: 0.1, marginLeft: 10 },

  groupCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', 
    borderRadius: 24, padding: 14, marginBottom: 12, elevation: 3, 
    borderWidth: 1, borderColor: '#EEF2EE' 
  },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 55, height: 55, borderRadius: 18, backgroundColor: '#F0F4F0' },
  onlineDot: { 
    position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, 
    borderRadius: 7, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#FFF' 
  },
  itemTitle: { fontSize: 16, fontWeight: '800', color: '#333' },
  itemSubtitle: { fontSize: 12, color: '#999', marginTop: 2, fontWeight: '600' },
  arrowBg: { 
    width: 32, height: 32, borderRadius: 10, 
    backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center' 
  },

  centerLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 15, color: GREEN, fontWeight: '700', fontSize: 13 },
  emptyContainer: { padding: 60, alignItems: 'center' },
  emptyText: { color: '#999', marginTop: 15, fontSize: 14, textAlign: 'center', lineHeight: 20 }
});

export default GroupListing;