import { getLoggedInUser } from "@/api/getLoggedInUser";
import ScreenWrapper from "@/components/screenWrapper";
import { getAccessToken } from "@/storage/tokenStorage";
import { useEffect } from "react";
import { Text } from "react-native";
import { T_DASHBOARD } from "./types";

const Dashboard: React.FC<T_DASHBOARD> = ({ navigation, route }) => {
    useEffect(() => {
        loadUserInfo()
    }, []);

    const loadUserInfo = async () => {
        const accessToken = await getAccessToken();
        if (accessToken) {
            const response = await getLoggedInUser(accessToken);
        }
    }

    return (
        <ScreenWrapper>
            <Text style={{ color: "black" }}>Dashboard</Text>
        </ScreenWrapper>
    );
};

export default Dashboard;