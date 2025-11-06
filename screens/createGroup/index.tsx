import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";
import { GroupType, T_CREATEGROUP } from "./types";

const CreateGroup: React.FC<T_CREATEGROUP> = ({ navigation, route }) => {
const { visible, onClose, onAddMembers } = route.params;
  const [type, setType] = useState<GroupType>("Public");
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return; // optionally show toast/validation
    onAddMembers({ type, name: name.trim() });
    // keep modal open so user selects members on next screen
  };

  const Tab = ({ v }: { v: GroupType }) => {
    const active = type === v;
    return (
      <Pressable
        onPress={() => setType(v)}
        style={[styles.tab, active && styles.tabActive]}
      >
        <Text style={[styles.tabText, active && styles.tabTextActive]}>{v}</Text>
      </Pressable>
    );
  };

  return (
    <Modal animationType="fade" transparent visible={visible || true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.card}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>New Group</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}>
              <Ionicons name="close" size={20} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* Type */}
          <Text style={styles.label}>Type</Text>
          <View style={styles.tabsWrap}>
            <Tab v="Public" />
            <Tab v="Private" />
            <Tab v="Password" />
          </View>

          {/* Name */}
          <Text style={[styles.label, { marginTop: 12 }]}>Name</Text>
          <TextInput
            placeholder="Enter the group name"
            placeholderTextColor="#C7C7C7"
            value={name}
            onChangeText={setName}
            style={styles.input}
            returnKeyType="done"
          />

          {/* CTA */}
          <TouchableOpacity
            onPress={handleAdd}
            activeOpacity={0.9}
            style={[styles.primaryBtn, { opacity: name.trim() ? 1 : 0.6 }]}
          >
            <Text style={styles.primaryBtnText}>Add Members</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default CreateGroup;
