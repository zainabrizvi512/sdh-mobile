import { ApiGroupMember, getGroupMembers } from "@/api/getGroupMembers";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
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
import { useAuth0 } from "react-native-auth0";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
import { T_GROUPMEMBERLISTING } from "./types";

type Role = "Owner" | "Admin" | "Moderator" | null;

type Member = {
  id: string;
  name: string;
  avatar: string;
  role: Role;
};

const FALLBACK_AVATAR =
  "https://ui-avatars.com/api/?background=EEE&color=111&name=?";

const GroupMemberListing: React.FC<T_GROUPMEMBERLISTING> = ({
  navigation,
  route,
}) => {
  // accept either id or groupId to be safe with existing navigations
  const groupId = route.params?.id;
  const insets = useSafeAreaInsets();
  const { getCredentials } = useAuth0();

  const [query, setQuery] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapApiToUi = (arr: ApiGroupMember[]): Member[] =>
    arr
      .map((m) => ({
        id: m.id,
        name: (m.username || m.email || "").trim(),
        avatar: m.picture || FALLBACK_AVATAR,
        role: m.isOwner ? ("Owner" as Role) : null, // extend here if backend adds roles
      }))
      .sort((a, b) => {
        if (a.role === "Owner" && b.role !== "Owner") return -1;
        if (b.role === "Owner" && a.role !== "Owner") return 1;
        return a.name.localeCompare(b.name);
      });

  const fetchMembers = async (signal?: AbortSignal) => {
    try {
      setError(null);
      const creds = await getCredentials();
      if (!creds?.accessToken) throw new Error("Missing access token.");
      // axios doesn't use AbortController directly; safe because our request is quick.
      const res = await getGroupMembers(creds.accessToken, groupId);
      const data: ApiGroupMember[] = res.data || [];
      setMembers(mapApiToUi(data));
    } catch (e: any) {
      setError(e?.message || "Failed to load members.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!groupId) {
      setError("Missing group id.");
      setLoading(false);
      return;
    }
    const ctrl = new AbortController();
    fetchMembers(ctrl.signal);
    return () => ctrl.abort();
  }, [groupId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMembers();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => m.name.toLowerCase().includes(q));
  }, [query, members]);

  const renderBadge = (role: Role) => {
    if (!role) return null;
    const roleStyle =
      role === "Owner"
        ? styles.badgeOwner
        : role === "Admin"
          ? styles.badgeAdmin
          : styles.badgeModerator;

    const roleTextStyle =
      role === "Owner"
        ? styles.badgeOwnerText
        : role === "Admin"
          ? styles.badgeAdminText
          : styles.badgeModeratorText;

    return (
      <View style={[styles.badge, roleStyle]}>
        <Text style={[styles.badgeText, roleTextStyle]}>{role}</Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Member }) => (
    <View style={styles.row}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
      <View style={{ flex: 1 }} />
      {renderBadge(item.role)}
    </View>
  );

  const ListEmpty = () => {
    if (loading) return null;
    return (
      <View style={{ padding: 24, alignItems: "center" }}>
        <Text style={{ color: "#6B7280" }}>
          {query ? "No matching members." : "No members to show."}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}
        >
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Members</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons
          name="search"
          size={18}
          color="#9CA3AF"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#C7C7C7"
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color="#C7C7C7" />
          </TouchableOpacity>
        )}
      </View>

      {/* Error */}
      {error && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <Text style={{ color: "#B91C1C" }}>
            {error.includes("403")
              ? "You are not a member of this group."
              : error.includes("404")
                ? "Group not found."
                : error}
          </Text>
        </View>
      )}

      {/* Loading / List */}
      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={<ListEmpty />}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default GroupMemberListing;
