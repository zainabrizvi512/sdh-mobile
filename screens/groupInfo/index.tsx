import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
import { T_GROUPINFO } from "./types";

const GroupInfo: React.FC<T_GROUPINFO> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const name = route?.params?.name ?? "Well Wave";
  const members = route?.params?.members ?? 5;
  const avatar =
    route?.params?.avatar ??
    "https://images.unsplash.com/photo-1514846326710-096e4a8035e1?w=400&h=400&fit=crop";

  const onAddMembers = () => {
    navigation.navigate("AddMembers", { id: route.params.id });
  }
  const onViewMembers = () => {
    navigation.navigate("GroupMemberListing", { id: route?.params?.id });
  }

  const onLeave = () => Alert.alert("Leave Group", "Are you sure you want to leave this group?", [
    { text: "Cancel", style: "cancel" },
    { text: "Leave", style: "destructive", onPress: () => navigation.goBack() },
  ]);

  const onDelete = () =>
    Alert.alert("Delete and Exit", "This will delete the group for everyone. Continue?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => navigation.goBack() },
    ]);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: 24 }}
      bounces={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Group Info</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Avatar + Name */}
      <View style={styles.centerWrap}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.subtitle}>{members} Members</Text>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionCard} activeOpacity={0.9} onPress={onAddMembers}>
          <Ionicons name="person-add-outline" size={22} color="#1F6F3D" />
          <Text style={styles.actionText}>Add Members</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} activeOpacity={0.9} onPress={onViewMembers}>
          <Ionicons name="people-outline" size={22} color="#1F6F3D" />
          <Text style={styles.actionText}>View Members</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Danger actions */}
      <TouchableOpacity style={styles.dangerRow} onPress={onLeave}>
        <Ionicons name="ban" size={18} color="#DC2626" />
        <Text style={styles.dangerText}>Leave</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dangerRow} onPress={onDelete}>
        <MaterialIcons name="delete-outline" size={18} color="#DC2626" />
        <Text style={styles.dangerText}>Delete and Exit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default GroupInfo;