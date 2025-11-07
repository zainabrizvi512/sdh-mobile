import { ApiUserSummary, getAllUsers, ListUsersResponse } from "@/api/getAllUsers";
import { postMembersToGroup } from "@/api/postMembersToGroup";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { T_ADDMEMBERS } from "./types";

type Person = { id: string; name: string; email: string; avatar: string; };
const FALLBACK_AVATAR = "https://ui-avatars.com/api/?background=EEE&color=111&name=?";

const AddMembers: React.FC<T_ADDMEMBERS> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { getCredentials } = useAuth0();
  const groupId: string | undefined = route?.params?.id;

  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Person[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [offset, setOffset] = useState(0);
  const [nextOffset, setNextOffset] = useState<number | null>(0);
  const [total, setTotal] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false); // <-- NEW
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setOffset(0);
      setNextOffset(0);
      setItems([]);
      fetchPage({ reset: true }).catch(() => { });
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, groupId]);

  const mapApiToPerson = (u: ApiUserSummary): Person => ({
    id: u.id,
    name: (u.username || u.email || "").trim(),
    email: u.email,
    avatar: u.picture || FALLBACK_AVATAR,
  });

  const fetchPage = useCallback(
    async ({ reset = false }: { reset?: boolean } = {}) => {
      try {
        setError(null);
        if (reset) setLoading(true);
        const { accessToken } = await getCredentials();
        const res = await getAllUsers(accessToken, {
          q: query || undefined,
          limit: 25,
          offset: reset ? 0 : nextOffset ?? 0,
          excludeGroupId: groupId,
          notInGroup: true,
          excludeSelf: true,
        });

        const data: ListUsersResponse = res.data;
        const newPeople = (data.items || []).map(mapApiToPerson);

        setItems((prev) => {
          const map = new Map(prev.map((p) => [p.id, p]));
          for (const p of newPeople) map.set(p.id, p);
          return Array.from(map.values());
        });

        setTotal(data.total);
        setOffset(reset ? 0 : nextOffset ?? 0);
        setNextOffset(data.nextOffset);
      } catch (e: any) {
        setError(e?.message || "Failed to load users.");
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [getCredentials, groupId, nextOffset, query]
  );

  useEffect(() => { fetchPage({ reset: true }).catch(() => { }); }, []); // initial

  const onRefresh = () => {
    setRefreshing(true);
    setItems([]);
    setOffset(0);
    setNextOffset(0);
    fetchPage({ reset: true }).catch(() => { });
  };

  const onEndReached = () => {
    if (loading || refreshing || loadingMore) return;
    if (nextOffset == null) return;
    setLoadingMore(true);
    fetchPage({ reset: false }).catch(() => { });
  };

  const toggle = (id: string) => setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  const count = useMemo(() => Object.values(selected).filter(Boolean).length, [selected]);

  const onAdd = async () => {
    if (!groupId) {
      setError("Missing group id.");
      return;
    }
    const memberIds = items.filter((p) => selected[p.id]).map((p) => p.id);
    if (memberIds.length === 0) return;

    try {
      setSubmitting(true);
      const { accessToken } = await getCredentials();
      await postMembersToGroup(accessToken, groupId, { memberIds });
      // Option A: go back and signal parent to refresh
      navigation.goBack();
      // Option B (alternative): navigation.navigate({ name: "GroupMembers", params: { refresh: true }, merge: true });
    } catch (e: any) {
      setError(e?.message || "Failed to add members.");
    } finally {
      setSubmitting(false);
    }
  };

  const Row = ({ item }: { item: Person }) => {
    const checked = !!selected[item.id];
    return (
      <TouchableOpacity style={styles.row} activeOpacity={0.9} onPress={() => toggle(item.id)}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.rowCenter}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.email} numberOfLines={1}>{item.email}</Text>
        </View>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Members</Text>
        <View style={{ width: 24 }} />
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

      {/* Error */}
      {error && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <Text style={{ color: "#B91C1C" }}>{error}</Text>
        </View>
      )}

      {/* List */}
      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => <Row item={item} />}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.4}
            onEndReached={onEndReached}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListFooterComponent={
              loadingMore ? (
                <View style={{ paddingVertical: 12 }}>
                  <ActivityIndicator />
                </View>
              ) : null
            }
            ListEmptyComponent={
              !loading && (
                <View style={{ padding: 24, alignItems: "center" }}>
                  <Text style={{ color: "#6B7280" }}>
                    {query ? "No matching users." : "No users to show."}
                  </Text>
                </View>
              )
            }
          />

          {/* Sticky bottom CTA */}
          <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <TouchableOpacity
              onPress={onAdd}
              disabled={count === 0 || submitting}
              activeOpacity={0.9}
              style={[styles.primaryBtn, { opacity: count > 0 && !submitting ? 1 : 0.6 }]}
            >
              <Text style={styles.primaryBtnText}>
                {submitting ? "Adding..." : `Add ${count} Member${count === 1 ? "" : "s"}`}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default AddMembers;
