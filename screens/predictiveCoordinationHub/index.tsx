import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, styles } from "./styles";
// at top
import { DrawerActions } from "@react-navigation/native";

import {
  QuickReply,
  RiskItem,
  Severity,
  SuggestedAction,
  T_PREDICVIVECOORDINATIONHUB
} from "./types";

const RISK_COLORS: Record<Severity, string> = {
  low: COLORS.badgeBlueBg,
  medium: COLORS.badgeYellowBg,
  high: COLORS.badgeRedBg,
  critical: COLORS.badgeYellowBg,
};

const RISK_TEXT: Record<Severity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const DATA_RISKS: RiskItem[] = [
  { hazard: "Flood", severity: "low" },
  { hazard: "Fire", severity: "medium" },
  { hazard: "Heatwave", severity: "high" },
  { hazard: "Building Collapse", severity: "critical" },
  { hazard: "Storm", severity: "high", badgeValue: "567" },
];

const SUGGESTED_ACTIONS: SuggestedAction[] = [
  { text: "Activate flood barriers" },
  { text: "Evacuate low-lying areas" },
  { text: "Issue public warnings" },
];

const QUICK_REPLIES: QuickReply[] = [
  { id: "q1", text: "The evacuation is complete.", prefix: "✔️" },
  { id: "q2", text: "Sure, will do", prefix: "⚠️" },
  { id: "q3", text: "Sure, will do", avatar: "👩🏼‍💼" },
];

function Badge({ label, bg }: { label: string; bg: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

function RiskRow({ item }: { item: RiskItem }) {
  const label = item.badgeValue ?? RISK_TEXT[item.severity];
  const bg =
    item.badgeValue != null ? COLORS.badgeRedBg : RISK_COLORS[item.severity];

  return (
    <View style={styles.row}>
      <Text style={styles.rowTitle}>{item.hazard}</Text>
      <Badge label={label} bg={bg} />
    </View>
  );
}

const PredictiveHubScreen: React.FC<T_PREDICVIVECOORDINATIONHUB> = ({ navigation, route }) => {
  const onQuickReply = (qr: QuickReply) => {
    Alert.alert("Message", qr.text);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.burger}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Text style={styles.burgerLines}>≡</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={2}>
          Predictive Coordination{"\n"}Hub
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* Scroll Content */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>DATA-DRIVEN RISK PREDICTION</Text>

        <View style={styles.card}>
          {DATA_RISKS.map((r, idx) => (
            <View key={`${r.hazard}-${idx}`}>
              <RiskRow item={r} />
              {idx < DATA_RISKS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>
          Suggested Actions
        </Text>

        <View style={styles.actionsBox}>
          {SUGGESTED_ACTIONS.map((a, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{a.text}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>
          Send a message
        </Text>

        <View style={styles.repliesBox}>
          {QUICK_REPLIES.map((q) => (
            <Pressable
              key={q.id}
              onPress={() => onQuickReply(q)}
              style={styles.replyRow}
            >
              {q.prefix ? (
                <Text style={styles.replyPrefix}>{q.prefix}</Text>
              ) : q.avatar ? (
                <Text style={styles.replyAvatar}>{q.avatar}</Text>
              ) : (
                <View style={{ width: 20 }} />
              )}

              <Text style={styles.replyText}>{q.text}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default PredictiveHubScreen;
