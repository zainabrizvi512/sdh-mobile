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

type Role = "Owner" | "Admin" | "Moderator" | null;

type Member = {
  id: string;
  name: string;
  avatar: string;
  role: Role;
};

const MEMBERS: Member[] = [
  { id: "1", name: "Alex Mason",   role: "Owner",     avatar: "https://randomuser.me/api/portraits/men/11.jpg" },
  { id: "2", name: "Andrew Joseph",role: "Admin",     avatar: "https://randomuser.me/api/portraits/men/12.jpg" },
  { id: "3", name: "Avery Quinn",  role: "Moderator", avatar: "https://randomuser.me/api/portraits/women/13.jpg" },
  { id: "4", name: "Brian Michael",role: null,        avatar: "https://randomuser.me/api/portraits/men/14.jpg" },
  { id: "5", name: "Cameron Lee",  role: null,        avatar: "https://randomuser.me/api/portraits/men/15.jpg" },
  { id: "6", name: "Charles Dean", role: null,        avatar: "https://randomuser.me/api/portraits/men/16.jpg" },
  { id: "7", name: "Dana Cooper",  role: null,        avatar: "https://randomuser.me/api/portraits/women/17.jpg" },
  { id: "8", name: "Emily",        role: null,        avatar: "https://randomuser.me/api/portraits/women/18.jpg" },
];

export default function GroupMemberListing({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MEMBERS;
    return MEMBERS.filter(m => m.name.toLowerCase().includes(q));
  }, [query]);

  const renderBadge = (role: Role) => {
    if (!role) return null;
    const roleStyle =
      role === "Owner" ? styles.badgeOwner :
      role === "Admin" ? styles.badgeAdmin :
      styles.badgeModerator;

    const roleTextStyle =
      role === "Owner" ? styles.badgeOwnerText :
      role === "Admin" ? styles.badgeAdminText :
      styles.badgeModeratorText;

    return (
      <View style={[styles.badge, roleStyle]}>
        <Text style={[styles.badgeText, roleTextStyle]}>{role}</Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Member }) => (
    <View style={styles.row}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
      <View style={{ flex: 1 }} />
      {renderBadge(item.role)}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Members</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
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

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
}
