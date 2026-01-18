import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { T_RISKLEVELS } from "./types";

// --- THEME ---
const GREEN = "#1f3d18";
const BG_LIGHT = "#F4F7F4";

export type RiskLevel = {
    level: 1 | 2 | 3 | 4 | 5;
    tag: "Low" | "Guarded" | "Elevated" | "High" | "Severe";
    color: string;
    desc: string;
};

const RiskLevels: React.FC<T_RISKLEVELS> = ({ navigation }) => {
    
    // Yahan main ne colors ko thora adjust kiya hai taake Green theme ke sath fancy lagain
    const DATA: RiskLevel[] = useMemo(
        () => [
            {
                level: 1,
                tag: "Low",
                color: "#4CAF50",
                desc: "Routine conditions. Stay informed; keep your basic emergency kit ready.",
            },
            {
                level: 2,
                tag: "Guarded",
                color: "#8BC34A",
                desc: "Minor risk indicators. Review contact list and safe meeting points.",
            },
            {
                level: 3,
                tag: "Elevated",
                color: "#FFC107",
                desc: "Noticeable threat. Avoid low-lying/unsafe areas; prepare go-bag & fuel.",
            },
            {
                level: 4,
                tag: "High",
                color: "#FF9800",
                desc: "Active risk. Follow local advisories, limit travel, charge devices.",
            },
            {
                level: 5,
                tag: "Severe",
                color: "#D32F2F",
                desc: "Extreme danger. Evacuate or shelter-in-place as instructed by NDMA/Rescue.",
            },
        ],
        []
    );

    const renderItem = ({ item }: { item: RiskLevel }) => {
        return (
            <View style={styles.card}>
                <View style={styles.cardTop}>
                    <View style={[styles.levelBadge, { backgroundColor: item.color }]}>
                        <Text style={styles.levelNumber}>L{item.level}</Text>
                    </View>
                    <View style={styles.titleInfo}>
                        <Text style={styles.tagLabel}>SEVERITY LEVEL</Text>
                        <Text style={[styles.tagName, { color: item.color }]}>{item.tag}</Text>
                    </View>
                    <Ionicons name="shield-checkmark" size={24} color={item.color} opacity={0.6} />
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.descRow}>
                    <Ionicons name="information-circle-outline" size={18} color="#666" style={{marginTop: 2}} />
                    <Text style={styles.descText}>{item.desc}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* --- HEADER --- */}
            <View style={styles.headerContainer}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={26} color="#FFF" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>Risk Levels</Text>
                        <Text style={styles.headerSubtitle}>Security Protocols (1–5)</Text>
                    </View>
                </View>
                
                {/* Fuller Look Info Card */}
                <View style={styles.summaryBox}>
                    <Ionicons name="warning" size={20} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.summaryText}>
                        Risk levels are determined based on real-time environmental data and government advisories.
                    </Text>
                </View>
            </View>

            {/* --- LIST --- */}
            <FlatList
                data={DATA}
                keyExtractor={(it) => String(it.level)}
                renderItem={renderItem}
                contentContainerStyle={styles.listPadding}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

// --- STYLES ---

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG_LIGHT },
    headerContainer: { 
        backgroundColor: GREEN, paddingTop: 60, paddingBottom: 30, 
        borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 8 
    },
    headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
    backButton: { marginRight: 15, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 6 },
    headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFF' },
    headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
    
    summaryBox: { 
        flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', 
        marginHorizontal: 20, padding: 15, borderRadius: 15, alignItems: 'center' 
    },
    summaryText: { 
        flex: 1, color: 'rgba(255,255,255,0.8)', fontSize: 11, marginLeft: 10, 
        lineHeight: 16, fontWeight: '500' 
    },

    listPadding: { paddingHorizontal: 20, paddingVertical: 20, paddingBottom: 40 },
    
    card: { 
        backgroundColor: '#FFF', borderRadius: 24, padding: 20, 
        marginBottom: 15, elevation: 3, shadowColor: '#000', 
        shadowOpacity: 0.05, shadowRadius: 10, borderWidth: 1, borderColor: '#EEE' 
    },
    cardTop: { flexDirection: 'row', alignItems: 'center' },
    levelBadge: { 
        width: 50, height: 50, borderRadius: 15, 
        justifyContent: 'center', alignItems: 'center', elevation: 2 
    },
    levelNumber: { fontSize: 20, fontWeight: '900', color: '#FFF' },
    titleInfo: { flex: 1, marginLeft: 15 },
    tagLabel: { fontSize: 10, fontWeight: '900', color: '#999', letterSpacing: 1 },
    tagName: { fontSize: 18, fontWeight: '800' },
    
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 15 },
    
    descRow: { flexDirection: 'row', alignItems: 'flex-start' },
    descText: { flex: 1, marginLeft: 10, fontSize: 13, color: '#555', lineHeight: 20, fontWeight: '500' }
});

export default RiskLevels;