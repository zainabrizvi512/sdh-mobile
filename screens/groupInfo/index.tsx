import FancyAppHeader, { fancyHeaderStyles } from "@/components/fancyAppHeader";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { T_GROUPINFO } from "./types";

// --- THEME ---
const GREEN = "#0f4c3a";
const BG_LIGHT = "#F4F7F4";
const RED_ALERT = "#DC2626";

const GroupInfo: React.FC<T_GROUPINFO> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const name = route?.params?.name ?? "Well Wave";
  const members = route?.params?.members ?? 5;
  const avatar = route?.params?.avatar ?? "https://images.unsplash.com/photo-1514846326710-096e4a8035e1?w=400&h=400&fit=crop";

  const onAddMembers = () => navigation.navigate("AddMembers", { id: route.params.id });
  const onViewMembers = () => navigation.navigate("GroupMemberListing", { id: route?.params?.id });

  const onLeave = () => Alert.alert("Leave Group", "Are you sure you want to leave this group?", [
    { text: "Cancel", style: "cancel" },
    { text: "Leave", style: "destructive", onPress: () => navigation.goBack() },
  ]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f4c3a" />
      
      <FancyAppHeader
        title="Group Info"
        subtitle={`${members} active members • coordination hub`}
        badge={{ icon: "chatbubbles", label: "GROUP PROFILE" }}
        onBack={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity style={fancyHeaderStyles.backBtn}>
            <Ionicons name="create-outline" size={18} color="#FFF" />
          </TouchableOpacity>
        }
        footer={
          <View style={styles.profileSection}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: avatar }} style={styles.avatar} />
            </View>
            <Text style={styles.groupName}>{name}</Text>
          </View>
        }
      />

      <ScrollView 
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        {/* --- DESCRIPTION SECTION --- */}
        <View style={styles.card}>
            <Text style={styles.cardLabel}>GROUP DESCRIPTION</Text>
            <Text style={styles.descriptionText}>
              Emergency coordination and resource management group for {name} sector. 
              Authorized personnel only.
            </Text>
        </View>

        {/* --- QUICK ACTIONS --- */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={onAddMembers}>
            <View style={[styles.iconCircle, {backgroundColor: '#F0F4F0'}]}>
                <Ionicons name="person-add" size={20} color={GREEN} />
            </View>
            <Text style={styles.actionLabelText}>Add</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={onViewMembers}>
            <View style={[styles.iconCircle, {backgroundColor: '#F0F4F0'}]}>
                <Ionicons name="people" size={20} color={GREEN} />
            </View>
            <Text style={styles.actionLabelText}>Members</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.iconCircle, {backgroundColor: '#F0F4F0'}]}>
                <Ionicons name="images" size={20} color={GREEN} />
            </View>
            <Text style={styles.actionLabelText}>Media</Text>
          </TouchableOpacity>
        </View>

        {/* --- SETTINGS LIST --- */}
        <View style={styles.listCard}>
            <SettingRow icon="notifications-outline" label="Mute Notifications" toggle />
            <View style={styles.divider} />
            <SettingRow icon="lock-closed-outline" label="Encryption" value="End-to-end" />
            <View style={styles.divider} />
            <SettingRow icon="star-outline" label="Starred Messages" />
        </View>

        {/* --- DANGER ZONE --- */}
        <View style={[styles.listCard, {marginTop: 20}]}>
            <TouchableOpacity style={styles.dangerRow} onPress={onLeave}>
                <Ionicons name="log-out-outline" size={20} color={RED_ALERT} />
                <Text style={styles.dangerText}>Exit Group</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.dangerRow}>
                <Ionicons name="alert-circle-outline" size={20} color={RED_ALERT} />
                <Text style={styles.dangerText}>Report Group</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// --- SUB-COMPONENTS ---
const SettingRow = ({ icon, label, toggle, value }: any) => (
    <TouchableOpacity style={styles.settingRow}>
        <Ionicons name={icon} size={20} color="#666" />
        <Text style={styles.settingLabel}>{label}</Text>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        <Ionicons name="chevron-forward" size={16} color="#CCC" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_LIGHT },

  profileSection: { alignItems: 'center' },
  avatarWrapper: { borderRadius: 30, padding: 4, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 10 },
  avatar: { width: 80, height: 80, borderRadius: 22 },
  groupName: { fontSize: 18, fontWeight: '800', color: '#FFF' },

  scrollBody: { padding: 20, paddingBottom: 40 },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, elevation: 3, marginBottom: 20 },
  cardLabel: { fontSize: 10, fontWeight: '900', color: GREEN, letterSpacing: 1.5, marginBottom: 10 },
  descriptionText: { fontSize: 14, color: '#666', lineHeight: 20 },

  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  actionCard: { width: '30%', backgroundColor: '#FFF', borderRadius: 20, padding: 15, alignItems: 'center', elevation: 2 },
  iconCircle: { width: 44, height: 44, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionLabelText: { fontSize: 12, fontWeight: '700', color: '#333' },

  listCard: { backgroundColor: '#FFF', borderRadius: 24, paddingHorizontal: 20, elevation: 2 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
  settingLabel: { flex: 1, marginLeft: 15, fontSize: 15, fontWeight: '600', color: '#333' },
  settingValue: { fontSize: 13, color: GREEN, fontWeight: '700', marginRight: 10 },

  dangerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
  dangerText: { marginLeft: 15, fontSize: 15, fontWeight: '700', color: RED_ALERT },

  divider: { height: 1, backgroundColor: '#F5F5F5' }
});

export default GroupInfo;