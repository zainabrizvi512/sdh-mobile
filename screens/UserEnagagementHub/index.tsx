import {
  EngagementHubActivity,
  getEngagementHubActivities,
} from "@/api/getEngagementHubActivities";
import { getEngagementHubDashboard } from "@/api/getEngagementHubDashboard";
import { EngagementHubHistoryItem, getEngagementHubHistory } from "@/api/getEngagementHubHistory";
import {
  EngagementHubOpportunity,
  getEngagementHubOpportunities,
} from "@/api/getEngagementHubOpportunities";
import { patchEngagementHubActivityStatus } from "@/api/patchEngagementHubActivityStatus";
import { postEngagementHubActivity } from "@/api/postEngagementHubActivity";
import { postEngagementHubOpportunity } from "@/api/postEngagementHubOpportunity";
import FancyAppHeader, { fancyHeaderStyles } from "@/components/fancyAppHeader";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import { extractResponseArray } from "@/utils/extractResponseArray";
import { styles } from "./styles";
import {
  EngagementDashboardState,
  EngagementTabKey,
  T_USERENGAGEMENTHUB,
} from "./types";

const defaultDashboard: EngagementDashboardState = {
  displayName: "Rescue User",
  rank: "VOLUNTEER",
  level: 1,
  currentXp: 0,
  maxXp: 75,
  totalXp: 0,
  xpToNextLevel: 75,
  missions: 0,
  livesImpacted: 0,
};

const UserEngagementHub: React.FC<T_USERENGAGEMENTHUB> = ({ navigation }) => {
  const { getCredentials } = useAuth0();
  const [tab, setTab] = useState<EngagementTabKey>("dashboard");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dashboard, setDashboard] = useState<EngagementDashboardState>(defaultDashboard);
  const [activities, setActivities] = useState<EngagementHubActivity[]>([]);
  const [history, setHistory] = useState<EngagementHubHistoryItem[]>([]);
  const [opportunities, setOpportunities] = useState<EngagementHubOpportunity[]>([]);
  const [radiusKm, setRadiusKm] = useState(5);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const [newActivityTitle, setNewActivityTitle] = useState("");
  const [newActivityDescription, setNewActivityDescription] = useState("");
  const [oppTitle, setOppTitle] = useState("");
  const [oppDescription, setOppDescription] = useState("");
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [showManualCoords, setShowManualCoords] = useState(false);

  const loadToken = useCallback(async () => {
    try {
      const creds = await getCredentials();
      if (creds?.accessToken) setToken(creds.accessToken);
    } catch {
      setToken("");
    }
  }, [getCredentials]);

  const loadDashboard = useCallback(async (t: string) => {
    const data = await getEngagementHubDashboard(t);
    // Backend nests everything under `user` and `stats` (see engagement-hub.service.ts#getDashboard).
    const user = data.user ?? data;
    const stats = data.stats ?? data;

    const totalXp = stats.totalXp ?? data.currentXp ?? data.xp ?? 0;
    const level = stats.level ?? user.level ?? defaultDashboard.level;
    const currentLevelXp = stats.currentLevelXp ?? 0;
    const nextLevelXp = stats.nextLevelXp ?? data.maxXp ?? currentLevelXp + 75;
    const missions = stats.missionsInProgress ?? data.missionsCount ?? data.missions ?? 0;
    const lives = stats.livesImpacted ?? data.livesSaved ?? 0;

    setDashboard({
      displayName: user.name ?? user.displayName ?? defaultDashboard.displayName,
      rank: user.rank ?? data.rankLabel ?? defaultDashboard.rank,
      level,
      currentXp: Math.max(0, totalXp - currentLevelXp),
      maxXp: Math.max(1, nextLevelXp - currentLevelXp),
      totalXp,
      xpToNextLevel: Math.max(0, nextLevelXp - totalXp),
      missions,
      livesImpacted: lives,
    });
  }, []);

  const loadActivities = useCallback(async (t: string) => {
    const raw = await getEngagementHubActivities(t, "IN_PROGRESS");
    setActivities(extractResponseArray<EngagementHubActivity>(raw));
  }, []);

  const loadHistory = useCallback(async (t: string) => {
    const raw = await getEngagementHubHistory(t);
    setHistory(extractResponseArray<EngagementHubHistoryItem>(raw));
  }, []);

  const resolveCoords = useCallback(async () => {
    if (manualLat.trim() && manualLng.trim()) {
      const lat = Number(manualLat);
      const lng = Number(manualLng);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        setCoords({ latitude: lat, longitude: lng });
        return { latitude: lat, longitude: lng };
      }
    }
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Location", "Enable location or enter latitude/longitude to load opportunities.");
      return null;
    }
    const loc = await Location.getCurrentPositionAsync({});
    const c = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    setCoords(c);
    return c;
  }, [manualLat, manualLng]);

  const loadOpportunities = useCallback(
    async (t: string, overrideRadius?: number) => {
      const c = coords ?? (await resolveCoords());
      if (!c) return;
      const r = overrideRadius ?? radiusKm;
      const raw = await getEngagementHubOpportunities(t, {
        latitude: c.latitude,
        longitude: c.longitude,
        radiusKm: r,
      });
      setOpportunities(extractResponseArray<EngagementHubOpportunity>(raw));
    },
    [coords, radiusKm, resolveCoords]
  );

  const refreshForTab = useCallback(
    async (t: string, currentTab: EngagementTabKey) => {
      if (!t) return;
      setIsLoading(true);
      try {
        if (currentTab === "dashboard") await loadDashboard(t);
        if (currentTab === "activities") await loadActivities(t);
        if (currentTab === "history") await loadHistory(t);
        if (currentTab === "opportunities") await loadOpportunities(t);
      } catch {
        Alert.alert("Error", "Could not load engagement hub data.");
      } finally {
        setIsLoading(false);
      }
    },
    [loadActivities, loadDashboard, loadHistory, loadOpportunities]
  );

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  useEffect(() => {
    if (token) refreshForTab(token, tab);
  }, [token, tab, refreshForTab]);

  const xpPercent = Math.min(100, Math.round((dashboard.currentXp / dashboard.maxXp) * 100));

  const encouragingMessage = (() => {
    if (dashboard.totalXp === 0) {
      return "Complete your first activity to start earning XP and climb the ranks!";
    }
    if (dashboard.missions > 0) {
      return `You have ${dashboard.missions} mission${dashboard.missions > 1 ? "s" : ""} in progress — finish ${
        dashboard.missions > 1 ? "them" : "it"
      } to earn more XP!`;
    }
    return `Just ${dashboard.xpToNextLevel} XP away from Level ${dashboard.level + 1}. Keep going!`;
  })();

  const formatLives = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  const handleCreateActivity = async () => {
    if (!newActivityTitle.trim()) {
      Alert.alert("Validation", "Title is required.");
      return;
    }
    try {
      await postEngagementHubActivity(token, {
        title: newActivityTitle.trim(),
        description: newActivityDescription.trim() || undefined,
        status: "IN_PROGRESS",
      });

      // Also list it as a nearby opportunity so others can see and join it.
      try {
        const c = coords ?? (await resolveCoords());
        if (c) {
          await postEngagementHubOpportunity(token, {
            title: newActivityTitle.trim(),
            description: newActivityDescription.trim() || undefined,
            latitude: c.latitude,
            longitude: c.longitude,
            radiusKm,
          });
          await loadOpportunities(token);
        }
      } catch {
        // Activity is still created even if it couldn't be listed as an opportunity.
      }

      setNewActivityTitle("");
      setNewActivityDescription("");
      await loadActivities(token);
      Alert.alert("Success", "Activity created.");
    } catch {
      Alert.alert("Error", "Could not create activity.");
    }
  };

  const handleCompleteActivity = async (id: string, xpReward?: number) => {
    try {
      await patchEngagementHubActivityStatus(token, id, "COMPLETED");
      await Promise.all([loadActivities(token), loadHistory(token), loadDashboard(token)]);
      Alert.alert(
        "Mission Complete! 🎉",
        xpReward ? `You earned +${xpReward} XP. Keep it up!` : "Great work! Keep it up!"
      );
    } catch {
      Alert.alert("Error", "Could not update activity status.");
    }
  };

  const handleJoinOpportunity = async (opp: EngagementHubOpportunity) => {
    try {
      await postEngagementHubActivity(token, {
        title: opp.title || opp.name || "Opportunity",
        description: opp.description,
        status: "IN_PROGRESS",
        xpReward: opp.xpReward,
        latitude: opp.latitude,
        longitude: opp.longitude,
        city: opp.city,
        metadata: { opportunityId: opp.id },
      });
      await loadActivities(token);
      Alert.alert("Joined", "Added to your in-progress activities.", [
        { text: "View Activities", onPress: () => setTab("activities") },
        { text: "OK" },
      ]);
    } catch {
      Alert.alert("Error", "Could not join this opportunity.");
    }
  };

  const handlePostOpportunity = async () => {
    if (!oppTitle.trim()) {
      Alert.alert("Validation", "Opportunity title is required.");
      return;
    }
    try {
      const c = coords ?? (await resolveCoords());
      await postEngagementHubOpportunity(token, {
        title: oppTitle.trim(),
        description: oppDescription.trim() || undefined,
        latitude: c?.latitude,
        longitude: c?.longitude,
        radiusKm,
      });
      setOppTitle("");
      setOppDescription("");
      await loadOpportunities(token);
      Alert.alert("Success", "Opportunity posted.");
    } catch {
      Alert.alert("Error", "Could not post opportunity.");
    }
  };

  const renderDashboard = () => (
    <Animated.View>
      <View style={styles.premiumCard}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 25 }}>
          <View style={[styles.iconCircle, { backgroundColor: "#0f4c3a" }]}>
            <Ionicons name="shield-checkmark" size={22} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: "900", color: "#0f4c3a" }}>{dashboard.displayName}</Text>
            <Text style={{ fontSize: 11, color: "#888", fontWeight: "700" }}>RANK: {dashboard.rank.toUpperCase()}</Text>
          </View>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate("ProfileSettings", {})}>
            <Ionicons name="settings-outline" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>

        <View style={styles.xpLabelRow}>
          <Text style={styles.xpMainText}>
            {dashboard.currentXp} / {dashboard.maxXp} XP
          </Text>
          <Text style={styles.xpPercentage}>LEVEL {dashboard.level}</Text>
        </View>
        <View style={styles.xpTrack}>
          <View style={[styles.xpFill, { width: `${xpPercent}%` }]} />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
          <Ionicons name="rocket-outline" size={16} color="#0f4c3a" />
          <Text style={{ fontSize: 12, color: "#555", fontWeight: "600", marginLeft: 6, flex: 1 }}>
            {encouragingMessage}
          </Text>
        </View>
      </View>

      <View style={styles.statGrid}>
        <View style={styles.statCard}>
          <Ionicons name="flash-outline" size={24} color="#0f4c3a" />
          <Text style={styles.statValue}>{dashboard.totalXp}</Text>
          <Text style={styles.statLabel}>TOTAL XP EARNED</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="heart-outline" size={24} color="#0f4c3a" />
          <Text style={styles.statValue}>{formatLives(dashboard.livesImpacted)}</Text>
          <Text style={styles.statLabel}>LIVES IMPACTED</Text>
        </View>
      </View>

      <View style={styles.statGrid}>
        <View style={styles.statCard}>
          <Ionicons name="hourglass-outline" size={24} color="#0f4c3a" />
          <Text style={styles.statValue}>{dashboard.missions}</Text>
          <Text style={styles.statLabel}>IN PROGRESS</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trending-up-outline" size={24} color="#0f4c3a" />
          <Text style={styles.statValue}>{dashboard.xpToNextLevel}</Text>
          <Text style={styles.statLabel}>XP TO NEXT LEVEL</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderActivities = () => (
    <View>
      <Text style={styles.sectionTitle}>IN PROGRESS</Text>
      <TextInput
        style={styles.input}
        placeholder="New activity title"
        placeholderTextColor="#999"
        value={newActivityTitle}
        onChangeText={setNewActivityTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description (optional)"
        placeholderTextColor="#999"
        value={newActivityDescription}
        onChangeText={setNewActivityDescription}
        multiline
      />
      <TouchableOpacity style={[styles.actionBtn, { marginBottom: 16 }]} onPress={handleCreateActivity}>
        <Text style={styles.actionBtnText}>START ACTIVITY</Text>
      </TouchableOpacity>
      {activities.length === 0 && <Text style={styles.emptyText}>No activities in progress.</Text>}
      {activities.map((item, idx) => (
        <View key={item.id || String(idx)} style={styles.activityRow}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.itemTitle}>{item.title || item.name || "Activity"}</Text>
            {item.description ? (
              <Text style={styles.itemDate} numberOfLines={2}>
                {item.description}
              </Text>
            ) : null}
            {!!item.xpReward && <Text style={styles.xpBadge}>+{item.xpReward} XP on completion</Text>}
          </View>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => handleCompleteActivity(String(item.id), item.xpReward)}
          >
            <Text style={styles.secondaryBtnText}>COMPLETE</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderHistory = () => (
    <View>
      <Text style={{ fontSize: 12, fontWeight: "900", color: "#666", marginBottom: 15, marginLeft: 5 }}>
        COMPLETED OPERATIONS
      </Text>
      {history.length === 0 && <Text style={styles.emptyText}>No history yet.</Text>}
      {history.map((item, idx) => {
        const title = item.title || item.name || "Mission";
        const when = item.completedAt || item.endedAt || item.createdAt;
        const xp = item.xpEarned ?? item.xp ?? 0;
        const icon = (item.icon as string) || "grid-outline";
        return (
          <View key={item.id || String(idx)} style={styles.timelineItem}>
            <View style={styles.iconCircle}>
              <Ionicons name={icon as any} size={20} color="#0f4c3a" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{title}</Text>
              <Text style={styles.itemDate}>
                {when ? new Date(when).toLocaleDateString().toUpperCase() : "RECENT"}
              </Text>
            </View>
            <Text style={styles.xpBadge}>{xp > 0 ? `+${xp}` : ""}</Text>
          </View>
        );
      })}
    </View>
  );

  const renderOpportunities = () => (
    <View>
      <Text style={styles.sectionTitle}>OPPORTUNITIES NEARBY ({radiusKm} KM)</Text>
      <Text style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
        These are volunteer opportunities posted by others near your location. Tap JOIN to add
        one to your in-progress activities — complete it later to earn XP and see it in History.
      </Text>

      <TouchableOpacity
        style={[styles.actionBtn, { marginBottom: 10 }]}
        onPress={async () => {
          await resolveCoords();
          if (token) await loadOpportunities(token);
        }}
      >
        <Text style={styles.actionBtnText}>USE MY LOCATION & REFRESH</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setShowManualCoords((v) => !v)} style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 12, color: "#0f4c3a", fontWeight: "700", textAlign: "center" }}>
          {showManualCoords ? "Hide manual coordinates" : "Location not working? Enter coordinates manually"}
        </Text>
      </TouchableOpacity>

      {showManualCoords && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Latitude"
            placeholderTextColor="#999"
            value={manualLat}
            onChangeText={setManualLat}
            keyboardType="decimal-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Longitude"
            placeholderTextColor="#999"
            value={manualLng}
            onChangeText={setManualLng}
            keyboardType="decimal-pad"
          />
          <TouchableOpacity
            style={[styles.actionBtn, { marginBottom: 10 }]}
            onPress={async () => {
              await resolveCoords();
              if (token) await loadOpportunities(token);
            }}
          >
            <Text style={styles.actionBtnText}>SAVE COORDINATES & REFRESH</Text>
          </TouchableOpacity>
        </>
      )}

      {opportunities.length === 0 ? (
        <View style={[styles.premiumCard, { alignItems: "center", borderStyle: "dashed", backgroundColor: "transparent" }]}>
          <Ionicons name="navigate-circle-outline" size={50} color="#0f4c3a" />
          <Text style={{ fontWeight: "800", marginTop: 15 }}>No Opportunities Found Nearby</Text>
          <Text style={{ fontSize: 12, color: "#999", textAlign: "center", marginTop: 5 }}>
            Try expanding radius or post a new opportunity below.
          </Text>
        </View>
      ) : (
        opportunities.map((opp, idx) => (
          <View key={opp.id || String(idx)} style={styles.timelineItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="location-outline" size={20} color="#0f4c3a" />
            </View>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.itemTitle}>{opp.title || opp.name || "Opportunity"}</Text>
              {opp.description ? (
                <Text style={styles.itemDate} numberOfLines={2}>
                  {opp.description}
                </Text>
              ) : null}
            </View>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => handleJoinOpportunity(opp)}>
              <Text style={styles.secondaryBtnText}>JOIN</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
      <TouchableOpacity
        style={[styles.actionBtn, { marginTop: 12 }]}
        onPress={async () => {
          const next = Math.min(radiusKm + 5, 50);
          setRadiusKm(next);
          if (!token) return;
          try {
            await loadOpportunities(token, next);
          } catch {
            Alert.alert("Error", "Could not reload opportunities.");
          }
        }}
      >
        <Text style={styles.actionBtnText}>EXPAND RADIUS (+5 KM)</Text>
      </TouchableOpacity>
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>POST OPPORTUNITY</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#999"
        value={oppTitle}
        onChangeText={setOppTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description (optional)"
        placeholderTextColor="#999"
        value={oppDescription}
        onChangeText={setOppDescription}
        multiline
      />
      <TouchableOpacity style={styles.actionBtn} onPress={handlePostOpportunity}>
        <Text style={styles.actionBtnText}>SUBMIT OPPORTUNITY</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#0f4c3a" />

      <FancyAppHeader
        title="Engagement Hub"
        subtitle="Tracking your global rescue impact"
        badge={{ icon: "trophy", label: "VOLUNTEER IMPACT" }}
        onBack={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity
            onPress={() => token && refreshForTab(token, tab)}
            style={fancyHeaderStyles.backBtn}
          >
            <Ionicons name="refresh-outline" size={18} color="#FFF" />
          </TouchableOpacity>
        }
        tabs={[
          { id: "dashboard", label: "DASHBOARD" },
          { id: "activities", label: "ACTIVITIES" },
          { id: "history", label: "HISTORY" },
          { id: "opportunities", label: "OPPORTUNITIES" },
        ]}
        activeTab={tab}
        onTabChange={(id) => setTab(id as EngagementTabKey)}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0f4c3a" style={{ marginTop: 40 }} />
        ) : (
          <>
            {tab === "dashboard" && renderDashboard()}
            {tab === "activities" && renderActivities()}
            {tab === "history" && renderHistory()}
            {tab === "opportunities" && renderOpportunities()}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default UserEngagementHub;
