import { getGuide } from "@/api/getGuide";
import { SafetyGuide } from "@/api/getSafetyGuides";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import GuideDetailView from "./GuideDetailView";
import { T_SAFETYGUIDEDETAIL } from "./types";

const GREEN = "#0f4c3a";

const SafetyGuideDetail: React.FC<T_SAFETYGUIDEDETAIL> = ({ navigation, route }) => {
    const { id } = route.params;
    const [loading, setLoading] = useState(true);
    const [guide, setGuide] = useState<SafetyGuide | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(false);
            try {
                const g = await getGuide(id);
                setGuide(g);
            } catch (e) {
                console.log("SafetyGuideDetail load error", e);
                setError(true);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator color={GREEN} size="large" />
                <Text style={{ marginTop: 10, color: GREEN, fontWeight: '600' }}>Loading Guide...</Text>
            </View>
        );
    }

    if (error || !guide) {
        return (
            <View style={styles.loaderContainer}>
                <Ionicons name="alert-circle-outline" size={40} color="#CCC" />
                <Text style={{ marginTop: 10, color: '#999', fontWeight: '600' }}>Couldn't load this guide.</Text>
                <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
                    <Text style={{ color: GREEN, fontWeight: '700' }}>Go Back</Text>
                </Pressable>
            </View>
        );
    }

    return <GuideDetailView guide={guide} onBack={() => navigation.goBack()} />;
};

const styles = StyleSheet.create({
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
});

export default SafetyGuideDetail;
