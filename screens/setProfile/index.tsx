import { UpdateProfileDto, updateProfile } from "@/api/patchUpdateProfile";
import { postUploadMyPicture } from "@/api/postUploadMyPicture";
import { RootStackParamList } from "@/navigation/types";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import * as ImagePicker from "react-native-image-picker";
import { PRIMARY, styles } from "./styles";
import { Gender, ProfileFormState, T_SETPROFILE } from "./types";

const isRemoteUrl = (uri?: string | null) =>
  !!uri && (uri.startsWith("http://") || uri.startsWith("https://"));

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SetProfile: React.FC<T_SETPROFILE> = ({ navigation, route }) => {
  const navigationObj = useNavigation<Nav>();
  const { getCredentials } = useAuth0();
  const handleContinue = () => {
    navigationObj.reset({
      index: 0,
      routes: [
        {
          name: "DashboardStack",
          params: { screen: "Dashboard" }, // 👈 inner screen
        },
      ],
    });
  };

  const email = route?.params?.email ?? "";

  const [state, setState] = useState<ProfileFormState>({
    photoUri: null,
    fullName: "",
    phone: "",
    gender: "",
    dob: null,
    city: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [iosDobTemp, setIosDobTemp] = useState<Date>(state.dob ?? new Date(2000, 0, 1));

  const canContinue = useMemo(
    () =>
      state.fullName.trim().length >= 3 &&
      state.phone.trim().length >= 8 &&
      !!state.gender,
    [state]
  );

  const updateField = (key: keyof ProfileFormState, value: any) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        selectionLimit: 1,
        quality: 0.8,
      },
      (resp) => {
        if (resp?.didCancel) return;
        const uri = resp?.assets?.[0]?.uri;
        if (uri) updateField("photoUri", uri);
      }
    );
  };

  const phoneLooksValid = (v: string) => /^(\+?\d{8,15}|03\d{2}-?\d{7})$/.test(v.trim());

  const onContinue = async () => {
    const { accessToken } = await getCredentials();

    if (!canContinue) {
      Alert.alert("Please fill required fields");
      return;
    }
    if (!accessToken) {
      Alert.alert("Not signed in", "Missing access token.");
      return;
    }
    if (state.phone && !phoneLooksValid(state.phone)) {
      Alert.alert("Invalid phone format", "Expected 03xx-xxxxxxx or digits (8–15).");
      return;
    }

    setSubmitting(true);
    try {
      // 1) If photo is a local uri, upload first and get imageUrl
      let pictureUrl: string | undefined = undefined;
      if (state.photoUri && !isRemoteUrl(state.photoUri)) {
        const { imageUrl } = await postUploadMyPicture(accessToken, state.photoUri);
        pictureUrl = imageUrl;
      } else if (isRemoteUrl(state.photoUri || "")) {
        pictureUrl = state.photoUri as string;
      }

      // 2) Now call update profile with the URL (if any)
      const dto: UpdateProfileDto = {
        name: state.fullName?.trim() || undefined,
        phone: state.phone?.trim() || undefined,
        gender: (state.gender as UpdateProfileDto["gender"]) || undefined,
        dob: state.dob ? state.dob.toISOString().slice(0, 10) : undefined,
        picture: pictureUrl,
      };

      await updateProfile(accessToken, dto);

      Alert.alert("Profile updated", "Your profile has been saved.");
      handleContinue();
    } catch (e: any) {
      console.log(e);
      const msg = e?.response?.data?.message || e?.message || "Failed to update profile.";
      Alert.alert("Error", Array.isArray(msg) ? msg.join("\n") : String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: 120 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={{ fontSize: 28, color: PRIMARY }}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Set up your profile</Text>
        <Text style={styles.subtitle}>Complete your details to continue.</Text>

        {/* Photo */}
        <View style={styles.avatarWrapper}>
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.avatar}>
              {state.photoUri ? (
                <Image
                  source={{ uri: state.photoUri }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <Text style={{ color: "#9CA3AF" }}>Add photo</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Email (read-only if provided) */}
        {email ? (
          <View style={{ marginTop: 24 }}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.input}>
              <Text style={{ color: "#6B7280" }}>{email}</Text>
            </View>
          </View>
        ) : null}

        {/* Full Name */}
        <View style={{ marginTop: 16 }}>
          <Text style={styles.inputLabel}>Full name *</Text>
          <TextInput
            placeholder="Enter your full name"
            value={state.fullName}
            onChangeText={(v) => updateField("fullName", v)}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
          />
        </View>

        {/* Phone */}
        <View style={{ marginTop: 16 }}>
          <Text style={styles.inputLabel}>Phone *</Text>
          <TextInput
            placeholder="03xx-xxxxxxx"
            keyboardType="phone-pad"
            value={state.phone}
            onChangeText={(v) => updateField("phone", v)}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
            maxLength={15}
          />
        </View>

        {/* Gender */}
        <View style={{ marginTop: 16 }}>
          <Text style={styles.inputLabel}>Gender *</Text>
          <Pressable
            onPress={() => setShowGenderModal(true)}
            style={[styles.input, { justifyContent: "center" }]}
          >
            <Text style={{ color: state.gender ? "#111827" : "#9CA3AF" }}>
              {state.gender
                ? state.gender.charAt(0).toUpperCase() + state.gender.slice(1)
                : "Select gender"}
            </Text>
          </Pressable>
        </View>

        {/* DOB */}
        <View style={{ marginTop: 16 }}>
          <Text style={styles.inputLabel}>Date of birth</Text>
          <Pressable
            onPress={() => {
              setIosDobTemp(state.dob ?? new Date(2000, 0, 1));
              setShowDobPicker(true);
            }}
            style={[styles.input, { justifyContent: "center" }]}
          >
            <Text style={{ color: state.dob ? "#111827" : "#9CA3AF" }}>
              {state.dob ? state.dob.toDateString() : "Select date"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={onContinue}
          activeOpacity={0.9}
          disabled={!canContinue || submitting}
          style={[styles.footerBtn, { backgroundColor: canContinue ? PRIMARY : "#9CA3AF" }]}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "white", fontWeight: "700", fontSize: 18 }}>
              Continue
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Gender Modal */}
      <Modal
        visible={showGenderModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <Pressable
          style={styles.genderModalWrapper}
          onPress={() => setShowGenderModal(false)}
        >
          <View style={styles.genderModalBox}>
            {(["male", "female", "other"] as Gender[]).map((g) => (
              <Pressable
                key={g}
                onPress={() => {
                  updateField("gender", g);
                  setShowGenderModal(false);
                }}
                style={[
                  styles.genderItem,
                  {
                    backgroundColor:
                      state.gender === g ? "#EEF2FF" : "transparent",
                  },
                ]}
              >
                <Text style={{ fontSize: 16 }}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* DOB Picker (platform-specific) */}
      {Platform.OS === "android" && showDobPicker && (
        <DateTimePicker
          value={state.dob ?? new Date(2000, 0, 1)}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(event: DateTimePickerEvent, date?: Date) => {
            if (event.type === "set" && date) {
              updateField("dob", date);
            }
            setShowDobPicker(false);
          }}
        />
      )}

      {Platform.OS === "ios" && (
        <Modal
          visible={showDobPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDobPicker(false)}
        >
          <Pressable
            style={styles.iosSheetBackdrop}
            onPress={() => setShowDobPicker(false)}
          />
          <View style={styles.iosSheet}>
            <View style={styles.iosSheetHeader}>
              <TouchableOpacity onPress={() => setShowDobPicker(false)} style={styles.iosSheetBtn}>
                <Text style={styles.iosSheetBtnText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.iosSheetTitle}>Select date of birth</Text>
              <TouchableOpacity
                onPress={() => {
                  updateField("dob", iosDobTemp);
                  setShowDobPicker(false);
                }}
                style={styles.iosSheetBtn}
              >
                <Text style={[styles.iosSheetBtnText, { fontWeight: "700", color: PRIMARY }]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            <DateTimePicker
              value={iosDobTemp}
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              onChange={(_, date) => {
                if (date) setIosDobTemp(date);
              }}
              themeVariant="light"
              style={styles.iosPicker}
            />
            <View style={{ height: 20 }} />
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
};

export default SetProfile;
