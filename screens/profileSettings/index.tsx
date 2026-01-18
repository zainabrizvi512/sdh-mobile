import { getLoggedInUser, IUser } from "@/api/getLoggedInUser";
import { clearTokens } from "@/storage/tokenStorage";
import { getAddressFromCoords } from "@/utils/getAddressFromCoords";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { T_PROFILESETTINGS } from "./types";

// --- THEME ---
const GREEN = "#1f3d18";
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
            <StatusBar barStyle="light-content" />
            
            {/* --- PREMIUM CURVED HEADER --- */}
            <View style={styles.headerContainer}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={26} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Profile</Text>
                    <View style={{ width: 40 }} /> 
                </View>

                {/* Profile Identity Section */}
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
                    <Text style={styles.userLocation}>{address}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
                
                {/* --- ACCOUNT SETTINGS --- */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>
                    <View style={styles.titleLine} />
                </View>

                <View style={styles.card}>
                    <ProfileOption icon="person-outline" label="Edit Personal Info" />
                    <View style={styles.divider} />
                    <ProfileOption icon="shield-checkmark-outline" label="Security & Privacy" />
                    <View style={styles.divider} />
                    <ProfileOption icon="notifications-outline" label="Push Notifications" />
                </View>

                {/* --- APP INFO --- */}
                <View style={[styles.sectionHeader, { marginTop: 25 }]}>
                    <Text style={styles.sectionTitle}>APP INFORMATION</Text>
                    <View style={styles.titleLine} />
                </View>

                <View style={styles.card}>
                    <ProfileOption icon="help-circle-outline" label="Help Center" />
                    <View style={styles.divider} />
                    <ProfileOption icon="document-text-outline" label="Terms of Service" />
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
const ProfileOption = ({ icon, label }: any) => (
    <TouchableOpacity style={styles.optionRow}>
        <Ionicons name={icon} size={22} color="#444" />
        <Text style={styles.optionLabel}>{label}</Text>
        <Ionicons name="chevron-forward" size={18} color="#CCC" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG_LIGHT },
    headerContainer: { 
        backgroundColor: GREEN, paddingTop: 60, paddingBottom: 40, 
        borderBottomLeftRadius: 35, borderBottomRightRadius: 35, elevation: 12 
    },
    headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, justifyContent: 'space-between' },
    backButton: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 8 },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },

    profileSection: { alignItems: 'center', marginTop: 20 },
    avatarWrapper: { position: 'relative', borderRadius: 35, padding: 4, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 15 },
    avatar: { width: 90, height: 90, borderRadius: 30 },
    editBadge: { position: 'absolute', bottom: 5, right: -5, backgroundColor: '#FFF', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', elevation: 5 },
    userName: { fontSize: 22, fontWeight: '800', color: '#FFF' },
    userLocation: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '600', marginTop: 4, paddingHorizontal: 40, textAlign: 'center' },

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