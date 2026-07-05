import { getNotificationPreferences, NotificationPreferences } from "@/api/getNotificationPreferences";
import { patchNotificationPreferences } from "@/api/patchNotificationPreferences";
import BackButton from "@/components/backButton";
import { GREEN } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Switch, Text, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { styles } from "./styles";
import { T_PUSHNOTIFICATIONS } from "./types";

type PrefKey = "emergencyAlerts" | "news" | "chatMessages" | "donationUpdates";

const OPTIONS: { key: PrefKey; icon: keyof typeof Ionicons.glyphMap; title: string; meta: string }[] = [
    {
        key: "emergencyAlerts",
        icon: "alert-circle-outline",
        title: "Emergency Alerts",
        meta: "SOS signals and high-risk warnings near you",
    },
    {
        key: "news",
        icon: "newspaper-outline",
        title: "News & Updates",
        meta: "Verified news and platform announcements",
    },
    {
        key: "chatMessages",
        icon: "chatbubble-ellipses-outline",
        title: "Chat Messages",
        meta: "New messages in your groups",
    },
    {
        key: "donationUpdates",
        icon: "heart-outline",
        title: "Donation Updates",
        meta: "Campaign progress and NGO donation activity",
    },
];

const PushNotifications: React.FC<T_PUSHNOTIFICATIONS> = ({ navigation }) => {
    const { getCredentials } = useAuth0();
    const [loading, setLoading] = useState(true);
    const [savingKey, setSavingKey] = useState<PrefKey | null>(null);
    const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const { accessToken } = await getCredentials();
                const data = await getNotificationPreferences(accessToken);
                setPrefs(data);
            } catch (e) {
                console.log("PushNotifications load error", e);
                Alert.alert("Error", "Could not load your notification preferences.");
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onToggle = async (key: PrefKey, value: boolean) => {
        if (!prefs) return;
        const prev = prefs;
        setPrefs({ ...prefs, [key]: value });
        setSavingKey(key);
        try {
            const { accessToken } = await getCredentials();
            const updated = await patchNotificationPreferences(accessToken, { [key]: value });
            setPrefs(updated);
        } catch (e) {
            console.log("PushNotifications toggle error", e);
            setPrefs(prev);
            Alert.alert("Error", "Could not update this preference. Please try again.");
        } finally {
            setSavingKey(null);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
                <View style={styles.backBtnWrap}>
                    <BackButton onPress={() => navigation.goBack()} />
                </View>

                <Text style={styles.title}>Push Notifications</Text>
                <Text style={styles.subtitle}>
                    Choose what you want to be notified about. You can change these anytime.
                </Text>

                {loading || !prefs ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={GREEN} />
                    </View>
                ) : (
                    <View style={styles.card}>
                        {OPTIONS.map((opt, idx) => (
                            <React.Fragment key={opt.key}>
                                <View style={styles.row}>
                                    <View style={styles.rowIcon}>
                                        <Ionicons name={opt.icon} size={18} color={GREEN} />
                                    </View>
                                    <View style={{ flex: 1, marginRight: 10 }}>
                                        <Text style={styles.rowTitle}>{opt.title}</Text>
                                        <Text style={styles.rowMeta}>{opt.meta}</Text>
                                    </View>
                                    {savingKey === opt.key ? (
                                        <ActivityIndicator size="small" color={GREEN} />
                                    ) : (
                                        <Switch
                                            value={prefs[opt.key]}
                                            onValueChange={(v) => onToggle(opt.key, v)}
                                            trackColor={{ false: "#cbd5e1", true: GREEN }}
                                        />
                                    )}
                                </View>
                                {idx < OPTIONS.length - 1 ? <View style={styles.divider} /> : null}
                            </React.Fragment>
                        ))}
                    </View>
                )}

                <Text style={styles.note}>
                    <Text style={styles.noteHighlight}>Emergency Alerts</Text> are strongly recommended to keep enabled —
                    they carry time-critical SOS and hazard warnings for your area.
                </Text>
            </ScrollView>
        </View>
    );
};

export default PushNotifications;
