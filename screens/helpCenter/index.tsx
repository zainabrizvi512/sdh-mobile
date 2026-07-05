import BackButton from "@/components/backButton";
import { GREEN } from "@/constants/theme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Linking, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { T_HELPCENTER } from "./types";

const FAQS = [
    {
        q: "How do I send an SOS alert?",
        a: "From the main Dashboard, use the Emergency Dispatch numbers, or open the Emergency Aid Network / Rescue Coordination tab from the bottom bar to raise an SOS with your live location attached.",
    },
    {
        q: "How do I join an NGO?",
        a: "On the Dashboard, tap the people icon in the top header to browse verified NGOs and request to join one.",
    },
    {
        q: "Why does the app need my location?",
        a: "Your location is used to show your position on the risk map, route responders to you during an SOS, and personalize the risk alerts for your area. You can manage location access from your device settings at any time.",
    },
    {
        q: "How do I share my live location with a group?",
        a: "Open a group chat and tap the location pin icon next to the message box to start or stop sharing your live location with that group.",
    },
    {
        q: "What do the risk levels in Predictive Hub mean?",
        a: "Each region gets a 0–100 risk score calculated from signals like rainfall, wind, river level, and citizen hazard reports. Higher scores mean higher urgency — check the Decisions tab for recommended actions.",
    },
    {
        q: "How do I report a hazard I've noticed?",
        a: "Open Predictive Hub and use the Report tab to submit a hazard report with your location — it feeds directly into the regional risk score.",
    },
    {
        q: "Is my data secure?",
        a: "Visit Profile > Security & Privacy to review encrypted storage, access control, and sync settings for your account.",
    },
];

const HelpCenter: React.FC<T_HELPCENTER> = ({ navigation }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const call = (number: string) => Linking.openURL(`tel:${number}`);
    const emailSupport = () =>
        Linking.openURL("mailto:support@sdh-rescue.app?subject=SDH%20App%20Support");

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
                    <View style={styles.backBtnWrap}>
                        <BackButton variant="solid" onPress={() => { console.log("back"); navigation.goBack() }} />
                    </View>

                    <Text style={styles.title}>Help Center</Text>
                    <Text style={styles.subtitle}>Quick answers, or reach a real person if you're stuck.</Text>

                    <Text style={styles.sectionTitle}>IN AN EMERGENCY</Text>
                    <View style={styles.quickRow}>
                        <TouchableOpacity style={styles.quickCard} onPress={() => call("15")}>
                            <View style={styles.quickIcon}>
                                <MaterialIcons name="local-police" size={18} color={GREEN} />
                            </View>
                            <Text style={styles.quickLabel}>Police</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickCard} onPress={() => call("1122")}>
                            <View style={styles.quickIcon}>
                                <MaterialIcons name="local-hospital" size={18} color={GREEN} />
                            </View>
                            <Text style={styles.quickLabel}>Ambulance</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickCard} onPress={() => call("16")}>
                            <View style={styles.quickIcon}>
                                <MaterialIcons name="local-fire-department" size={18} color={GREEN} />
                            </View>
                            <Text style={styles.quickLabel}>Fire</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>
                    <View style={styles.card}>
                        {FAQS.map((item, idx) => {
                            const isOpen = openIndex === idx;
                            return (
                                <React.Fragment key={item.q}>
                                    <TouchableOpacity
                                        style={styles.faqRow}
                                        onPress={() => setOpenIndex(isOpen ? null : idx)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.faqQuestionRow}>
                                            <Text style={styles.faqQuestion}>{item.q}</Text>
                                            <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={18} color={GREEN} />
                                        </View>
                                        {isOpen ? <Text style={styles.faqAnswer}>{item.a}</Text> : null}
                                    </TouchableOpacity>
                                    {idx < FAQS.length - 1 ? <View style={styles.divider} /> : null}
                                </React.Fragment>
                            );
                        })}
                    </View>

                    <Text style={styles.sectionTitle}>STILL NEED HELP?</Text>
                    <TouchableOpacity style={styles.contactBtn} onPress={emailSupport}>
                        <Ionicons name="mail-outline" size={18} color="#fff" />
                        <Text style={styles.contactBtnText}>Email Support</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default HelpCenter;
