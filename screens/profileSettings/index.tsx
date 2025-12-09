import { getLoggedInUser, IUser } from "@/api/getLoggedInUser";
import ScreenWrapper from "@/components/screenWrapper";
import { clearTokens } from "@/storage/tokenStorage";
import { getAddressFromCoords } from "@/utils/getAddressFromCoords";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { styles } from "./styles";
import { T_PROFILESETTINGS } from "./types";

const ProfileSettings: React.FC<T_PROFILESETTINGS> = ({ navigation, route }) => {
    const [user, setUser] = useState<IUser>();
    const { getCredentials } = useAuth0();
    const [address, setAddress] = useState<string>("");

    useEffect(() => {
        fetchData();
    }, [getCredentials]);

    const fetchData = async () => {
        const { accessToken } = await getCredentials();
        const user = await getLoggedInUser(accessToken);
        if (user.location) {
            const address = await getAddressFromCoords(user.location.x, user.location.y);
            setAddress(address?.full || "");
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
            {user ? (
                <View style={styles.container}>

                    {/* 🔙 BACK BUTTON + TITLE */}
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: "600", marginLeft: 10 }}>
                            Profile Settings
                        </Text>
                    </View>

                    <View style={styles.profileCard}>
                        <Image
                            source={{ uri: user?.picture }}
                            style={{ width: 80, height: 80, borderRadius: 50 }}
                        />
                        <Text style={styles.email}>{user.name}</Text>
                        <Text style={styles.city}>{address}</Text>
                    </View>

                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color="#fff" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>

                </View>
            ) : null}
        </ScreenWrapper>
    );
}


export default ProfileSettings;