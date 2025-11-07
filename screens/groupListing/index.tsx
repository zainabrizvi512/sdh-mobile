import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
// If you're using Auth0 or your own token store, import your getter:
import { ApiGroup, getMyGroups } from "@/api/getMyGroups";
import CreateGroupModal from "@/components/createGroup";
import { useAuth0 } from "react-native-auth0"; // adjust if you use another auth source
import { T_GROUPLISTING } from "./types";

type Group = {
  id: string;
  name: string;
  members: number;
  avatar?: string; // remote url (optional)
};

const GroupListing: React.FC<T_GROUPLISTING> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loadCreateGroupModal, setLoadCreateGroupModal] = useState<boolean>(false);

  // Example token source — swap for your real one
  const { getCredentials } = useAuth0();

  const mapApiToUi = useCallback((api: ApiGroup): Group => {
    const count =
      typeof api.membersCount === "number"
        ? api.membersCount
        : Array.isArray(api.members)
          ? api.members.length
          : 0;

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
      console.log(res.status);
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
    } catch (e) {
      console.log("Refresh groups failed", e);
    } finally {
      setRefreshing(false);
    }
  }, [getCredentials, mapApiToUi]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter((g) => g.name.toLowerCase().includes(q));
  }, [query, groups]);

  const onBack = () => navigation?.goBack?.();

  const renderItem = ({ item }: { item: Group }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.itemRow}
      onPress={() => { navigation?.navigate?.("GroupChat", { id: item.id, avatar: item.avatar || "", name: item.name, members: item.members }) }}
    >
      <Image
        style={styles.avatar}
        source={{
          uri:
            item.avatar ??
            "https://images.unsplash.com/photo-1557053910-d9eadeed1c58?w=200&h=200&fit=crop",
        }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemSubtitle}>{item.members} Members</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#C3C7CD" />
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={[styles.container, { paddingTop: insets.top + 4 }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#101828" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>Groups</Text>
          <View style={styles.onlineRow}>
            <View style={styles.dot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => { setLoadCreateGroupModal(true) }}
          hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
        >
          <Ionicons name="person-add-outline" size={22} color="#101828" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search"
          placeholderTextColor="#C7C7C7"
          style={styles.searchInput}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color="#C7C7C7" />
          </TouchableOpacity>
        )}
      </View>

      {/* Loading state */}
      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(g) => g.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={{ padding: 32, alignItems: "center" }}>
              <Text style={{ color: "#6B7280" }}>
                {query ? "No groups match your search." : "No groups yet."}
              </Text>
            </View>
          }
        />
      )}
      <CreateGroupModal
        visible={loadCreateGroupModal}
        onClose={() => { setLoadCreateGroupModal(false) }}
        onAddMembers={() => { }}
      />
    </KeyboardAvoidingView>
  );
}

export default GroupListing;