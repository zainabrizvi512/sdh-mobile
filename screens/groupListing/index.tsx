import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

type Group = {
  id: string;
  name: string;
  members: number;
  avatar?: string; // remote url (optional)
};

const GROUPS: Group[] = [
  { id: "1", name: "Family", members: 12 },
  { id: "2", name: "Office", members: 4 },
  { id: "3", name: "Gym Buddies", members: 5 },
  { id: "4", name: "School Mates", members: 16 },
  { id: "5", name: "Artistic Design", members: 24 },
];

export default function GroupListing({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROUPS;
    return GROUPS.filter(g => g.name.toLowerCase().includes(q));
  }, [query]);

  const onBack = () => navigation?.goBack?.();

  const renderItem = ({ item }: { item: Group }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.itemRow}
      onPress={() => navigation?.navigate?.("GroupDetails", { id: item.id })}
    >
      <Image
        style={styles.avatar}
        // fallback demo avatar
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
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}>
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
          onPress={() => navigation?.navigate?.("CreateGroup")}
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

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(g) => g.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
}
