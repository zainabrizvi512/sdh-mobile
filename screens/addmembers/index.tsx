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

type Person = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

type Props = {
  navigation: any;
  route?: any;
};

const PEOPLE: Person[] = [
  { id: "1", name: "Alex Mason", email: "alexmason@gmail.com", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: "2", name: "Alex Mason", email: "alexmason@gmail.com", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
  { id: "3", name: "Diana Jane", email: "dianajane@gmail.com", avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
  { id: "4", name: "Alex Mason", email: "alexmason@gmail.com", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
  { id: "5", name: "Alex Mason", email: "alexmason@gmail.com", avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
  { id: "6", name: "Alex Mason", email: "alexmason@gmail.com", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
  { id: "7", name: "Alex Mason", email: "alexmason@gmail.com", avatar: "https://randomuser.me/api/portraits/men/7.jpg" },
  { id: "8", name: "Alex Mason", email: "alexmason@gmail.com", avatar: "https://randomuser.me/api/portraits/men/8.jpg" },
  { id: "9", name: "Alex Mason", email: "alexmason@gmail.com", avatar: "https://randomuser.me/api/portraits/men/9.jpg" },
  { id: "10", name: "Alex Mason", email: "alexmason@gmail.com", avatar: "https://randomuser.me/api/portraits/men/10.jpg" },
];

export default function AddMembers({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({
    // seed some pre-checked like the mock
    "1": true,
    "3": true,
    "5": true,
    "8": true,
    "10": true,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PEOPLE;
    return PEOPLE.filter(
      p => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
    );
  }, [query]);

  const count = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected]
  );

  const toggle = (id: string) => {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const onAdd = () => {
    const members = PEOPLE.filter(p => selected[p.id]);
    // TODO: handle result (navigate back or forward)
    navigation.goBack();
    // navigation.navigate("GroupReview", { members });
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

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={({ item }) => <Row item={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Sticky bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          onPress={onAdd}
          disabled={count === 0}
          activeOpacity={0.9}
          style={[styles.primaryBtn, { opacity: count > 0 ? 1 : 0.6 }]}
        >
          <Text style={styles.primaryBtnText}>
            Add {count} Member{count === 1 ? "" : "s"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
