import BackButton from "@/components/backButton";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { styles } from "./styles";
import { T_TERMSOFSERVICE } from "./types";

const SECTIONS = [
    {
        title: "1. Acceptance of Terms",
        body: "By creating an account or using the SDH app, you agree to these Terms of Service. If you do not agree, please do not use the app.",
    },
    {
        title: "2. What SDH Provides",
        body: "SDH is a community disaster-response and coordination platform. It connects citizens, NGOs, and volunteers for emergency reporting, resource requests, predictive risk information, safety guidance, and related community features.",
    },
    {
        title: "3. Emergency Services Disclaimer",
        body: "SDH is a coordination tool and does not replace official emergency services. Always contact your local police, ambulance, or fire department directly for immediate life-threatening emergencies, in addition to using this app.",
    },
    {
        title: "4. Your Account",
        body: "You are responsible for keeping your account credentials secure and for the accuracy of the information you provide, including your location, profile details, and any hazard or resource reports you submit.",
    },
    {
        title: "5. Location & Data Use",
        body: "SDH collects location data to power features like risk mapping, live location sharing, and rescue coordination. You can manage what is shared from Profile > Security & Privacy and your device's location settings.",
    },
    {
        title: "6. Community Conduct",
        body: "Do not submit false SOS signals, false hazard reports, or abusive content. NGOs and volunteers are expected to act in good faith when responding to requests coordinated through the app.",
    },
    {
        title: "7. Donations & Volunteering",
        body: "Donation campaigns and volunteer opportunities are facilitated between users and NGOs. SDH is not a party to these transactions and is not responsible for how funds or resources are ultimately used by NGOs.",
    },
    {
        title: "8. Limitation of Liability",
        body: "SDH is provided on an 'as is' basis. To the fullest extent permitted by law, SDH and its operators are not liable for delays, inaccuracies, or failures in emergency response coordinated through the app.",
    },
    {
        title: "9. Changes to These Terms",
        body: "These Terms may be updated from time to time. Continued use of the app after changes are published constitutes acceptance of the revised Terms.",
    },
    {
        title: "10. Contact",
        body: "Questions about these Terms can be sent via Profile > Help Center > Email Support.",
    },
];

const TermsOfService: React.FC<T_TERMSOFSERVICE> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
                <View style={styles.backBtnWrap}>
                    <BackButton onPress={() => navigation.goBack()} />
                </View>

                <Text style={styles.title}>Terms of Service</Text>
                <Text style={styles.updated}>Last updated: 2026</Text>

                <View style={styles.draftBadge}>
                    <Ionicons name="alert-circle-outline" size={13} color="#B45309" />
                    <Text style={styles.draftBadgeText}>DRAFT — PENDING LEGAL REVIEW</Text>
                </View>

                <View style={styles.emergencyNotice}>
                    <Text style={styles.emergencyNoticeTitle}>Important</Text>
                    <Text style={styles.emergencyNoticeBody}>
                        SDH helps coordinate disaster response but is not a substitute for calling official
                        emergency services directly.
                    </Text>
                </View>

                {SECTIONS.map((s) => (
                    <View key={s.title} style={styles.section}>
                        <Text style={styles.sectionTitle}>{s.title}</Text>
                        <Text style={styles.sectionBody}>{s.body}</Text>
                    </View>
                ))}

                <View style={styles.divider} />
                <Text style={styles.footerNote}>
                    This text is a starting template generated for the app and has not been reviewed by a
                    lawyer. Please have it reviewed before relying on it for a production release.
                </Text>
            </ScrollView>
        </View>
    );
};

export default TermsOfService;
