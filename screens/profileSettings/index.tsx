import { deleteRegisterPushToken } from "@/api/deleteRegisterPushToken";
import { getLoggedInUser, IUser } from "@/api/getLoggedInUser";
import FancyAppHeader from "@/components/fancyAppHeader";
import { getExpoPushTokenSilently } from "@/hooks/usePushNotifications";
import { clearTokens } from "@/storage/tokenStorage";
import { getAddressFromCoords } from "@/utils/getAddressFromCoords";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { T_PROFILESETTINGS } from "./types";

// --- THEME ---
const GREEN = "#0f4c3a";
const BG_LIGHT = "#F4F7F4";
const RED_ALERT = "#DC2626";

const ProfileSettings: React.FC<T_PROFILESETTINGS> = ({ navigation, route }) => {
    const [user, setUser] = useState<IUser>();
    const { getCredentials } = useAuth0();
    const [address, setAddress] = useState<string>("Locating...");

    useEffect(() => {
        fetchData();
    }, [getCredentials]);

    const fetchData = async () => {
        const { accessToken } = await getCredentials();
        const user = await getLoggedInUser(accessToken);
        if (user.location) {
            const addr = await getAddressFromCoords(user.location.x, user.location.y);
            setAddress(addr?.full || "Islamabad, Pakistan");
        }
        setUser(user);
    }

    const handleLogout = async () => {
        Alert.alert("Logout", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    try {
                        const { accessToken } = await getCredentials();
                        const pushToken = await getExpoPushTokenSilently();
                        if (accessToken && pushToken) {
                            await deleteRegisterPushToken(accessToken, pushToken);
                        }
                    } catch (e) {
                        console.log("Failed to unregister push token on logout", e);
                    }
                    await clearTokens();
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "LoginSignupStack" as never }],
                    });
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f4c3a" />
            
            <FancyAppHeader
                title="My Profile"
                subtitle={address}
                badge={{ icon: "person-circle", label: "ACCOUNT SETTINGS" }}
                onBack={() => navigation.goBack()}
                footer={
                    <View style={styles.profileSection}>
                        <View style={styles.avatarWrapper}>
                            <Image
                                source={{ uri: user?.picture || "https://dummyimage.com/100/ffffff/1f3d18&text=User" }}
                                style={styles.avatar}
                            />
                            <TouchableOpacity style={styles.editBadge}>
                                <Ionicons name="camera" size={14} color={GREEN} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.userName}>{user?.name || "Rescue Link User"}</Text>
                    </View>
                }
            />

            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
                
                {/* --- ACCOUNT SETTINGS --- */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>
                    <View style={styles.titleLine} />
                </View>

                <View style={styles.card}>
                    <ProfileOption
                        icon="person-outline"
                        label="Edit Personal Info"
                        onPress={() => navigation.navigate("EditPersonalInfo", {})}
                    />
                    <View style={styles.divider} />
                    <ProfileOption
                        icon="shield-checkmark-outline"
                        label="Security & Privacy"
                        onPress={() => navigation.navigate("DataBackupSecurity", {})}
                    />
                    <View style={styles.divider} />
                    <ProfileOption
                        icon="notifications-outline"
                        label="Push Notifications"
                        onPress={() => navigation.navigate("PushNotifications", {})}
                    />
                </View>

                {/* --- APP INFO --- */}
                <View style={[styles.sectionHeader, { marginTop: 25 }]}>
                    <Text style={styles.sectionTitle}>APP INFORMATION</Text>
                    <View style={styles.titleLine} />
                </View>

                <View style={styles.card}>
                    <ProfileOption
                        icon="help-circle-outline"
                        label="Help Center"
                        onPress={() => navigation.navigate("HelpCenter", {})}
                    />
                    <View style={styles.divider} />
                    <ProfileOption
                        icon="document-text-outline"
                        label="Terms of Service"
                        onPress={() => navigation.navigate("TermsOfService", {})}
                    />
                    <View style={styles.divider} />
                    <View style={styles.versionRow}>
                        <Ionicons name="information-circle-outline" size={22} color="#666" />
                        <Text style={styles.optionLabel}>App Version</Text>
                        <Text style={styles.versionText}>v1.0.4 (Stable)</Text>
                    </View>
                </View>

                {/* --- LOGOUT BUTTON --- */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color="#FFF" />
                    <Text style={styles.logoutText}>Secure Logout</Text>
                </TouchableOpacity>

                <Text style={styles.footerBranding}>RESCUE LINK • EMERGENCY COORDINATION</Text>
            </ScrollView>
        </View>
    );
}

// --- SUB-COMPONENTS ---
const ProfileOption = ({ icon, label, onPress }: any) => (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
        <Ionicons name={icon} size={22} color="#444" />
        <Text style={styles.optionLabel}>{label}</Text>
        <Ionicons name="chevron-forward" size={18} color="#CCC" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG_LIGHT },

    profileSection: { alignItems: 'center' },
    avatarWrapper: { position: 'relative', borderRadius: 35, padding: 4, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 15 },
    avatar: { width: 90, height: 90, borderRadius: 30 },
    editBadge: { position: 'absolute', bottom: 5, right: -5, backgroundColor: '#FFF', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', elevation: 5 },
    userName: { fontSize: 18, fontWeight: '800', color: '#FFF', marginTop: 8 },

    scrollBody: { padding: 25, paddingBottom: 60 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 11, fontWeight: '900', color: GREEN, letterSpacing: 1.5 },
    titleLine: { flex: 1, height: 1, backgroundColor: GREEN, opacity: 0.1, marginLeft: 10 },

    card: { backgroundColor: '#FFF', borderRadius: 24, paddingHorizontal: 20, elevation: 2, borderWidth: 1, borderColor: '#EEF2EE' },
    optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
    optionLabel: { flex: 1, marginLeft: 15, fontSize: 15, fontWeight: '600', color: '#333' },
    
    versionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
    versionText: { fontSize: 13, color: '#999', fontWeight: '700' },

    divider: { height: 1, backgroundColor: '#F5F5F5' },

    logoutBtn: { 
        backgroundColor: GREEN, flexDirection: 'row', alignItems: 'center', 
        justifyContent: 'center', padding: 18, borderRadius: 20, marginTop: 30, elevation: 4 
    },
    logoutText: { color: '#FFF', fontSize: 16, fontWeight: '800', marginLeft: 10 },
    footerBranding: { textAlign: 'center', marginTop: 30, fontSize: 10, color: '#BBB', fontWeight: '800', letterSpacing: 1 }
});

export default ProfileSettings;