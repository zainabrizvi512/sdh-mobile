import ScreenWrapper from "@/components/screenWrapper";
import { clearTokens } from "@/storage/tokenStorage";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { T_PROFILESETTINGS } from "./types";

const ProfileSettings: React.FC<T_PROFILESETTINGS> = ({ navigation, route }) => {

    const handleLogout = async () => {
        Alert.alert("Logout", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    await clearTokens(); // clear stored token
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "LoginSignupStack" as never }],
                    });
                },
            },
        ]);
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.profileCard}>
                    <Ionicons
                        name="person-circle-outline"
                        size={80}
                        color="#9ca3af"
                        style={{ marginBottom: 8 }}
                    />
                    <Text style={styles.email}>zain@yopmail.com</Text>
                    <Text style={styles.city}>G-13, Islamabad</Text>
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#fff" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
}


export default ProfileSettings;