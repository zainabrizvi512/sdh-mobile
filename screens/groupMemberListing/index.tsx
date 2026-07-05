import { ApiGroupMember, getGroupMembers } from "@/api/getGroupMembers";
import FancyAppHeader from "@/components/fancyAppHeader";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
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
import { T_GROUPMEMBERLISTING } from "./types";

const GREEN = "#0f4c3a";
const BG_LIGHT = "#F4F7F4";
const FALLBACK_AVATAR = "https://ui-avatars.com/api/?background=F0F4F0&color=1f3d18&bold=true&name=";

const GroupMemberListing: React.FC<T_GROUPMEMBERLISTING> = ({ navigation, route }) => {
  const groupId = route.params?.id;
  const insets = useSafeAreaInsets();
  const { getCredentials } = useAuth0();

  const [query, setQuery] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapApiToUi = (arr: ApiGroupMember[]) =>
    arr.map((m) => ({
        id: m.id,
        name: (m.username || m.email || "Unknown").trim(),
        avatar: m.picture || (FALLBACK_AVATAR + (m.username || m.email || "?")),
        role: m.isOwner ? "Owner" : null,
      }))
      .sort((a, b) => {
        if (a.role === "Owner") return -1;
        if (b.role === "Owner") return 1;
        return a.name.localeCompare(b.name);
      });

  const fetchMembers = async () => {
    try {
      setError(null);
      const creds = await getCredentials();
      const res = await getGroupMembers(creds?.accessToken || "", groupId);
      setMembers(mapApiToUi(res.data || []));
    } catch (e: any) {
      setError(e?.message || "Failed to load members.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!groupId) { setError("Missing group id."); setLoading(false); return; }
    fetchMembers();
  }, [groupId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => m.name.toLowerCase().includes(q));
  }, [query, members]);

  const renderBadge = (role: string | null) => {
    if (!role) return null;
    return (
      <View style={[styles.roleBadge, role === "Owner" ? styles.ownerBadge : styles.adminBadge]}>
        <Text style={styles.roleText}>{role.toUpperCase()}</Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.memberCard}>
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.role === "Owner" && (
            <View style={styles.crownContainer}>
                <Ionicons name="ribbon" size={10} color="#FFF" />
            </View>
        )}
      </View>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={styles.memberName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.memberStatus}>{item.role === "Owner" ? "Group Creator" : "Member"}</Text>
      </View>
      {renderBadge(item.role)}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f4c3a" />
      
      <FancyAppHeader
        title="Members"
        subtitle={`${members.length} people joined this group`}
        badge={{ icon: "ribbon", label: "GROUP DIRECTORY" }}
        onBack={() => navigation.goBack()}
        footer={
          <View style={styles.searchWrapper}>
            <Ionicons name="search" size={18} color="rgba(255,255,255,0.6)" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search member name..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.searchInput}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Ionicons name="close-circle" size={18} color="#FFF" />
              </TouchableOpacity>
            )}
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
            <Text style={styles.loaderText}>Syncing Directory...</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(m) => m.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listPadding}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchMembers(); }} tintColor={GREEN} />
            }
            ListHeaderComponent={
                <View style={styles.listHeader}>
                    <Text style={styles.listHeaderText}>DIRECTORY LISTING</Text>
                    <View style={styles.headerLine} />
                </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={50} color="#CCC" />
                <Text style={styles.emptyText}>{query ? "No matching members found." : "No members found."}</Text>
              </View>
            }
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_LIGHT },

  searchWrapper: { 
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', 
    paddingHorizontal: 15, paddingVertical: 12, borderRadius: 15, alignItems: 'center' 
  },
  searchInput: { flex: 1, marginLeft: 10, color: '#FFF', fontSize: 14, fontWeight: '600' },

  listPadding: { paddingHorizontal: 20, paddingBottom: 40 },
  listHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 25, marginBottom: 15, paddingHorizontal: 5 },
  listHeaderText: { fontSize: 10, fontWeight: '900', color: GREEN, letterSpacing: 1.5 },
  headerLine: { flex: 1, height: 1, backgroundColor: GREEN, opacity: 0.1, marginLeft: 10 },

  memberCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', 
    borderRadius: 24, padding: 14, marginBottom: 12, elevation: 3, 
    borderWidth: 1, borderColor: '#EEF2EE' 
  },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 50, height: 50, borderRadius: 16, backgroundColor: '#F0F4F0' },
  crownContainer: { 
    position: 'absolute', top: -5, right: -5, width: 20, height: 20, 
    borderRadius: 10, backgroundColor: '#FFD700', justifyContent: 'center', 
    alignItems: 'center', borderWidth: 2, borderColor: '#FFF' 
  },
  memberName: { fontSize: 16, fontWeight: '700', color: '#333' },
  memberStatus: { fontSize: 11, color: '#999', marginTop: 2, fontWeight: '600' },
  
  roleBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  ownerBadge: { backgroundColor: '#FFF4E5' },
  adminBadge: { backgroundColor: '#F0F4F0' },
  roleText: { fontSize: 9, fontWeight: '900', color: GREEN },

  centerLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 15, color: GREEN, fontWeight: '700', fontSize: 13 },
  emptyContainer: { padding: 60, alignItems: 'center' },
  emptyText: { color: '#999', marginTop: 15, fontSize: 14, textAlign: 'center' }
});

export default GroupMemberListing;