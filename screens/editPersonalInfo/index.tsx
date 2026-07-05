import { getLoggedInUser } from "@/api/getLoggedInUser";
import { UpdateProfileDto, updateProfile } from "@/api/patchUpdateProfile";
import { postUploadMyPicture } from "@/api/postUploadMyPicture";
import BackButton from "@/components/backButton";
import { GREEN, MUTED, TEXT } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import * as ImagePicker from "react-native-image-picker";
import { styles } from "./styles";
import { Gender, T_EDITPERSONALINFO } from "./types";

const isRemoteUrl = (uri?: string | null) =>
    !!uri && (uri.startsWith("http://") || uri.startsWith("https://"));

const EditPersonalInfo: React.FC<T_EDITPERSONALINFO> = ({ navigation }) => {
    const { getCredentials } = useAuth0();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showGenderModal, setShowGenderModal] = useState(false);

    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState<Gender | "">("");

    useEffect(() => {
        (async () => {
            try {
                const { accessToken } = await getCredentials();
                const user = await getLoggedInUser(accessToken);
                setPhotoUri(user?.picture || null);
                setFullName(user?.name || "");
                setPhone(user?.phone || "");
                setGender((user?.gender as Gender) || "");
            } catch (e) {
                console.log("EditPersonalInfo load error", e);
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pickImage = () => {
        ImagePicker.launchImageLibrary(
            { mediaType: "photo", selectionLimit: 1, quality: 0.8 },
            (resp) => {
                if (resp?.didCancel) return;
                const uri = resp?.assets?.[0]?.uri;
                if (uri) setPhotoUri(uri);
            }
        );
    };

    const phoneLooksValid = (v: string) => !v || /^(\+?\d{8,15}|03\d{2}-?\d{7})$/.test(v.trim());

    const onSave = async () => {
        if (!fullName.trim()) {
            Alert.alert("Full name is required");
            return;
        }
        if (!phoneLooksValid(phone)) {
            Alert.alert("Invalid phone format", "Expected 03xx-xxxxxxx or digits (8–15).");
            return;
        }

        setSubmitting(true);
        try {
            const { accessToken } = await getCredentials();
            if (!accessToken) throw new Error("Missing access token");

            let pictureUrl: string | undefined;
            if (photoUri && !isRemoteUrl(photoUri)) {
                const { imageUrl } = await postUploadMyPicture(accessToken, photoUri);
                pictureUrl = imageUrl;
            } else if (isRemoteUrl(photoUri || "")) {
                pictureUrl = photoUri as string;
            }

            const dto: UpdateProfileDto = {
                name: fullName.trim(),
                phone: phone.trim() || undefined,
                gender: (gender as UpdateProfileDto["gender"]) || undefined,
                picture: pictureUrl,
            };

            await updateProfile(accessToken, dto);
            Alert.alert("Saved", "Your personal info has been updated.");
            navigation.goBack();
        } catch (e: any) {
            const msg = e?.response?.data?.message || e?.message || "Failed to update profile.";
            Alert.alert("Error", Array.isArray(msg) ? msg.join("\n") : String(msg));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
                <ActivityIndicator size="large" color={GREEN} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView
                contentContainerStyle={[styles.scrollContainer, { paddingBottom: 120 }]}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.backBtnWrap}>
                    <BackButton onPress={() => navigation.goBack()} />
                </View>

                <Text style={styles.title}>Edit Personal Info</Text>
                <Text style={styles.subtitle}>Keep your profile up to date.</Text>

                <View style={styles.avatarWrapper}>
                    <TouchableOpacity onPress={pickImage}>
                        <View style={styles.avatar}>
                            {photoUri ? (
                                <Image source={{ uri: photoUri }} style={{ width: "100%", height: "100%" }} />
                            ) : (
                                <Ionicons name="person" size={40} color={MUTED} />
                            )}
                        </View>
                        <View style={styles.avatarEditBadge}>
                            <Ionicons name="camera" size={14} color="#fff" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 28 }}>
                    <Text style={styles.inputLabel}>Full name *</Text>
                    <TextInput
                        placeholder="Enter your full name"
                        value={fullName}
                        onChangeText={setFullName}
                        style={styles.input}
                        placeholderTextColor={MUTED}
                        autoCapitalize="words"
                    />
                </View>

                <View style={{ marginTop: 16 }}>
                    <Text style={styles.inputLabel}>Phone</Text>
                    <TextInput
                        placeholder="03xx-xxxxxxx"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                        style={styles.input}
                        placeholderTextColor={MUTED}
                        maxLength={15}
                    />
                </View>

                <View style={{ marginTop: 16 }}>
                    <Text style={styles.inputLabel}>Gender</Text>
                    <Pressable onPress={() => setShowGenderModal(true)} style={[styles.input, { justifyContent: "center" }]}>
                        <Text style={{ color: gender ? TEXT : MUTED }}>
                            {gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "Select gender"}
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={onSave}
                    activeOpacity={0.9}
                    disabled={submitting}
                    style={[styles.footerBtn, { backgroundColor: submitting ? MUTED : GREEN }]}
                >
                    {submitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 18 }}>Save Changes</Text>
                    )}
                </TouchableOpacity>
            </View>

            <Modal visible={showGenderModal} transparent animationType="fade" onRequestClose={() => setShowGenderModal(false)}>
                <Pressable style={styles.genderModalWrapper} onPress={() => setShowGenderModal(false)}>
                    <View style={styles.genderModalBox}>
                        {(["male", "female", "other"] as Gender[]).map((g) => (
                            <Pressable
                                key={g}
                                onPress={() => {
                                    setGender(g);
                                    setShowGenderModal(false);
                                }}
                                style={[styles.genderItem, { backgroundColor: gender === g ? "rgba(15, 76, 58,0.08)" : "transparent" }]}
                            >
                                <Text style={{ fontSize: 16, color: TEXT }}>{g.charAt(0).toUpperCase() + g.slice(1)}</Text>
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default EditPersonalInfo;
