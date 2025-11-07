// CreateGroupModal.tsx
import { createGroup } from "@/api/postCreateGroup";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import { styles } from "./styles";
import { CreateGroupParams, GroupType } from "./types";

// Map UI tabs to backend enum
const TABS: { label: string; value: GroupType }[] = [
    { label: "Family", value: "family" },
    { label: "Friends", value: "friends" },
    { label: "Team", value: "team" },
    { label: "Other", value: "other" },
];

const CreateGroupModal: React.FC<CreateGroupParams> = ({ visible, onAddMembers, onClose }) => {
    const [type, setType] = useState<GroupType>("other");
    const [name, setName] = useState("");
    const [image, setImage] = useState<{ uri: string } | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const { getCredentials } = useAuth0();

    const canSubmit = useMemo(() => name.trim().length > 0 && !submitting, [name, submitting]);
    console.log("canSubmit", canSubmit)

    const requestMediaPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            throw new Error("Permission to access media library was denied");
        }
    };

    const handlePickImage = async () => {
        try {
            await requestMediaPermission();
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1], // crop square for nice circle preview
                quality: 0.9,
            });

            if (!result.canceled && result.assets?.[0]?.uri) {
                setImage({ uri: result.assets[0].uri });
            }
        } catch (e) {
            console.warn(e);
        }
    };

    const handleCreate = async () => {
        console.log(canSubmit)
        if (!canSubmit) return;
        setSubmitting(true);
        try {
            console.log(name, type, image?.uri)
            const creds = await getCredentials();
            const token = creds?.accessToken || "";
            const created = await createGroup({
                name: name.trim(),
                type,
                image: image ? { uri: image.uri } : undefined,
            }, token);

            // Hand off to your next step (e.g., navigate to member selection)
            //   onAddMembers({
            //     id: created?.id,
            //     name: created?.name ?? name.trim(),
            //     type: created?.type ?? type,
            //     picture: created?.picture,
            //   });
        } catch (err: any) {
            console.warn(err?.message || err);
            // TODO: show a toast/snackbar for UX
        } finally {
            setSubmitting(false);
        }
    };

    const Tab = ({ label, value }: { label: string; value: GroupType }) => {
        const active = type === value;
        return (
            <Pressable onPress={() => setType(value)} style={[styles.tab, active && styles.tabActive]}>
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
            </Pressable>
        );
    };

    return (
        <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
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

                    {/* Image + Pick */}
                    <View style={styles.imageRow}>
                        <Pressable onPress={handlePickImage} style={styles.avatarWrapper}>
                            {image?.uri ? (
                                <Image source={{ uri: image.uri }} style={styles.avatar} />
                            ) : (
                                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                    <Ionicons name="camera" size={20} color="#6B7280" />
                                </View>
                            )}
                        </Pressable>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Group Picture</Text>
                            <Text style={styles.subtleText}>PNG/JPG/WEBP, up to 10MB</Text>
                            <TouchableOpacity onPress={handlePickImage} style={styles.secondaryBtn}>
                                <Text style={styles.secondaryBtnText}>Choose Image</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Type */}
                    <Text style={[styles.label, { marginTop: 4 }]}>Type</Text>
                    <View style={styles.tabsWrap}>
                        {TABS.map(t => (
                            <Tab key={t.value} label={t.label} value={t.value} />
                        ))}
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
                        onSubmitEditing={handleCreate}
                    />

                    {/* CTA */}
                    <TouchableOpacity
                        onPress={handleCreate}
                        disabled={!canSubmit}
                        activeOpacity={0.9}
                        style={[styles.primaryBtn, { opacity: canSubmit ? 1 : 0.6 }]}
                    >
                        {submitting ? (
                            <ActivityIndicator />
                        ) : (
                            <Text style={styles.primaryBtnText}>Create & Add Members</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default CreateGroupModal;
