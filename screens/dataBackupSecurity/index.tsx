import {
  AccessControlPolicy,
  getDataSecurityAccessControl,
} from "@/api/getDataSecurityAccessControl";
import { getDataSecurityLastRestoreTest } from "@/api/getDataSecurityLastRestoreTest";
import { getDataSecuritySettings } from "@/api/getDataSecuritySettings";
import { BackupSnapshot, getDataSecuritySnapshots } from "@/api/getDataSecuritySnapshots";
import { getDataSecuritySyncPull } from "@/api/getDataSecuritySyncPull";
import { getDataSecuritySyncStatus } from "@/api/getDataSecuritySyncStatus";
import { patchDataSecurityEncryptedStorage } from "@/api/patchDataSecurityEncryptedStorage";
import { patchDataSecuritySyncToggle } from "@/api/patchDataSecuritySyncToggle";
import { postDataSecurityRestoreSnapshot } from "@/api/postDataSecurityRestoreSnapshot";
import { postDataSecurityRestoreTest } from "@/api/postDataSecurityRestoreTest";
import { postDataSecuritySyncPush } from "@/api/postDataSecuritySyncPush";
import FancyAppHeader from "@/components/fancyAppHeader";
import { useAuthToken } from "@/hooks/useAuthToken";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";

type TabKey = "encrypted" | "access" | "sync" | "recovery";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  SUPERVISOR: "Supervisor",
  FIELD_USER: "Field User",
};

const ROLE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  ADMIN: "key-outline",
  SUPERVISOR: "eye-outline",
  FIELD_USER: "person-outline",
};

const DataBackupSecurity: React.FC<any> = ({ navigation }) => {
  const { token, isReady, error: authError, reloadToken } = useAuthToken();
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [syncStatusLabel, setSyncStatusLabel] = useState("SYNC ACTIVE");
  const [syncInterval, setSyncInterval] = useState(30);
  const [pendingQueueItems, setPendingQueueItems] = useState(0);
  const [lastPulledAt, setLastPulledAt] = useState<string | null>(null);
  const [encryptionDescription, setEncryptionDescription] = useState(
    "Protect backups stored locally and in cloud mirrors",
  );
  const [policies, setPolicies] = useState<AccessControlPolicy[]>([]);
  const [snapshots, setSnapshots] = useState<BackupSnapshot[]>([]);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string | null>(null);
  const [restoreTestLabel, setRestoreTestLabel] = useState<string | null>(null);
  const [incidentReplayAvailable, setIncidentReplayAvailable] = useState(false);
  const [tab, setTab] = useState<TabKey>("encrypted");
  const [isToggling, setIsToggling] = useState(false);
  const [isActionRunning, setIsActionRunning] = useState(false);

  const loadTabData = useCallback(async (currentToken: string, currentTab: TabKey) => {
    if (!currentToken) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      if (currentTab === "encrypted") {
        const data = await getDataSecuritySettings(currentToken);
        setEncryptionEnabled(data.encryptedStorage?.enabled ?? true);
        if (data.encryptedStorage?.description) {
          setEncryptionDescription(data.encryptedStorage.description);
        }
        setSyncEnabled(data.realtimeSync?.enabled ?? true);
        setSyncInterval(data.realtimeSync?.intervalSeconds ?? 30);
      } else if (currentTab === "access") {
        const data = await getDataSecurityAccessControl(currentToken);
        setPolicies(data.policies ?? []);
      } else if (currentTab === "sync") {
        const data = await getDataSecuritySyncStatus(currentToken);
        setSyncEnabled(data.enabled ?? true);
        setSyncStatusLabel(data.status ?? (data.enabled ? "SYNC ACTIVE" : "SYNC PAUSED"));
        setSyncInterval(data.intervalSeconds ?? 30);
        setPendingQueueItems(data.pendingQueueItems ?? 0);
      } else if (currentTab === "recovery") {
        const [snapData, testData] = await Promise.all([
          getDataSecuritySnapshots(currentToken),
          getDataSecurityLastRestoreTest(currentToken),
        ]);
        const list = snapData.snapshots ?? [];
        setSnapshots(list);
        setSelectedSnapshotId((prev) => prev ?? list[0]?.id ?? null);
        setRestoreTestLabel(testData.lastVerifiedRestoreTest?.displayLabel ?? null);
        setIncidentReplayAvailable(testData.incidentReplayAvailable ?? false);
      }
    } catch (error: any) {
      setLoadError(error?.response?.data?.message ?? "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isReady && token) loadTabData(token, tab);
  }, [isReady, token, tab, loadTabData]);

  const handleRefresh = async () => {
    const nextToken = await reloadToken();
    if (nextToken) await loadTabData(nextToken, tab);
  };

  const handleEncryptionToggle = async (value: boolean) => {
    if (!token) return;
    setEncryptionEnabled(value);
    setIsToggling(true);
    try {
      await patchDataSecurityEncryptedStorage(token, value);
    } catch (error: any) {
      setEncryptionEnabled(!value);
      Alert.alert("Error", error?.response?.data?.message ?? "Failed to update encryption setting");
    } finally {
      setIsToggling(false);
    }
  };

  const handleSyncToggle = async (value: boolean) => {
    if (!token) return;
    setSyncEnabled(value);
    setSyncStatusLabel(value ? "SYNC ACTIVE" : "SYNC PAUSED");
    setIsToggling(true);
    try {
      const data = await patchDataSecuritySyncToggle(token, value);
      setSyncStatusLabel(data.status ?? (value ? "SYNC ACTIVE" : "SYNC PAUSED"));
    } catch (error: any) {
      setSyncEnabled(!value);
      setSyncStatusLabel(!value ? "SYNC ACTIVE" : "SYNC PAUSED");
      Alert.alert("Error", error?.response?.data?.message ?? "Failed to update sync setting");
    } finally {
      setIsToggling(false);
    }
  };

  const handlePushSync = async () => {
    if (!token) return;
    setIsActionRunning(true);
    try {
      await postDataSecuritySyncPush(token, {
        entityType: "incident_record",
        payload: { action: "mobile_sync", timestamp: new Date().toISOString() },
      });
      Alert.alert("Success", "Changes queued for sync.");
      const status = await getDataSecuritySyncStatus(token);
      setPendingQueueItems(status.pendingQueueItems ?? 0);
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message ?? "Failed to push sync");
    } finally {
      setIsActionRunning(false);
    }
  };

  const handlePullSync = async () => {
    if (!token) return;
    setIsActionRunning(true);
    try {
      const data = await getDataSecuritySyncPull(token, lastPulledAt ?? undefined);
      setLastPulledAt(data.pulledAt);
      Alert.alert("Sync pulled", `${data.deltas?.length ?? 0} delta(s) received.`);
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message ?? "Failed to pull sync");
    } finally {
      setIsActionRunning(false);
    }
  };

  const handleRestoreTest = async () => {
    if (!token || !selectedSnapshotId) {
      Alert.alert("Select snapshot", "Please select a snapshot first.");
      return;
    }
    setIsActionRunning(true);
    try {
      const result = await postDataSecurityRestoreTest(token, selectedSnapshotId);
      Alert.alert("Success", result.message ?? "Restore test completed.");
      const testData = await getDataSecurityLastRestoreTest(token);
      setRestoreTestLabel(testData.lastVerifiedRestoreTest?.displayLabel ?? null);
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message ?? "Failed to run restore test");
    } finally {
      setIsActionRunning(false);
    }
  };

  const handleRestoreSnapshot = async () => {
    if (!token || !selectedSnapshotId) {
      Alert.alert("Select snapshot", "Please select a snapshot first.");
      return;
    }
    setIsActionRunning(true);
    try {
      const result = await postDataSecurityRestoreSnapshot(token, selectedSnapshotId);
      Alert.alert("Restore initiated", result.message ?? "Point-in-time restore started.");
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message ?? "Failed to restore snapshot");
    } finally {
      setIsActionRunning(false);
    }
  };

  const SectionHeader = ({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>
        <Ionicons name={icon} size={18} color="#0f172a" />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#0f4c3a" />
      <FancyAppHeader
        title="Data Security"
        subtitle="Encrypted storage, access control, sync & recovery"
        badge={{ icon: "lock-closed", label: "AES-256 PROTECTED" }}
        rightIcon="shield-checkmark"
        rightIconColor="#86efac"
        onBack={() => navigation.goBack()}
        tabs={[
          { id: "encrypted", label: "ENCRYPTION" },
          { id: "access", label: "ACCESS" },
          { id: "sync", label: "SYNC" },
          { id: "recovery", label: "RECOVERY" },
        ]}
        activeTab={tab}
        onTabChange={(id) => setTab(id as TabKey)}
      />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor="#0f172a" />}
      >
        {!isReady || isLoading ? (
          <ActivityIndicator size="large" color="#0f172a" style={{ marginTop: 24 }} />
        ) : authError || loadError ? (
          <View style={styles.card}>
            <SectionHeader icon="cloud-offline-outline" title="UNABLE TO LOAD" />
            <Text style={styles.itemMeta}>{authError ?? loadError}</Text>
            <TouchableOpacity style={styles.actionBtn} onPress={handleRefresh}>
              <Text style={styles.actionBtnText}>RETRY</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {tab === "encrypted" && (
              <>
                <View style={styles.statusHero}>
                  <View>
                    <Text style={styles.statusHeroLabel}>Encryption Status</Text>
                    <Text style={styles.statusHeroValue}>{encryptionEnabled ? "ACTIVE" : "DISABLED"}</Text>
                  </View>
                  <Ionicons name="lock-closed" size={36} color="#06b6d4" />
                </View>
                <View style={styles.card}>
                  <SectionHeader icon="key-outline" title="ENCRYPTED STORAGE" />
                  <View style={styles.featureRow}>
                    <View style={styles.featureIcon}>
                      <Ionicons name="hardware-chip-outline" size={22} color="#06b6d4" />
                    </View>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={styles.itemTitle}>AES-256 at rest</Text>
                      <Text style={styles.itemMeta}>{encryptionDescription}</Text>
                    </View>
                    <Switch
                      value={encryptionEnabled}
                      onValueChange={handleEncryptionToggle}
                      disabled={isToggling}
                      trackColor={{ false: "#cbd5e1", true: "#06b6d4" }}
                    />
                  </View>
                </View>
              </>
            )}

            {tab === "access" && (
              <View style={styles.card}>
                <SectionHeader icon="people-outline" title="ACCESS CONTROL" />
                {policies.length === 0 ? (
                  <Text style={styles.itemMeta}>No policies available.</Text>
                ) : (
                  policies.map((p) => (
                    <View key={p.role} style={styles.roleCard}>
                      <Ionicons
                        name={ROLE_ICONS[p.role] ?? "shield-outline"}
                        size={20}
                        color="#06b6d4"
                        style={{ marginRight: 10, marginTop: 2 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemTitle}>{ROLE_LABELS[p.role] ?? p.role}</Text>
                        <Text style={styles.itemMeta}>{p.description}</Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}

            {tab === "sync" && (
              <>
                <View style={styles.statusHero}>
                  <View>
                    <Text style={styles.statusHeroLabel}>Sync Status</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                      {syncEnabled ? <View style={styles.liveDot} /> : null}
                      <Text style={[styles.statusHeroValue, { marginTop: 0, marginLeft: syncEnabled ? 8 : 0 }]}>
                        {syncStatusLabel}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="sync-circle" size={36} color="#06b6d4" />
                </View>
                <View style={styles.statRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{syncInterval}s</Text>
                    <Text style={styles.statLabel}>Interval</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{pendingQueueItems}</Text>
                    <Text style={styles.statLabel}>Queued</Text>
                  </View>
                </View>
                <View style={styles.card}>
                  <SectionHeader icon="cloud-upload-outline" title="REAL TIME SYNC" />
                  <View style={styles.featureRow}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={styles.itemTitle}>Delta sync enabled</Text>
                      <Text style={styles.itemMeta}>Conflict safe · offline queue</Text>
                    </View>
                    <Switch
                      value={syncEnabled}
                      onValueChange={handleSyncToggle}
                      disabled={isToggling}
                      trackColor={{ false: "#cbd5e1", true: "#06b6d4" }}
                    />
                  </View>
                  <TouchableOpacity
                    style={[styles.actionBtn, isActionRunning && { opacity: 0.6 }]}
                    onPress={handlePushSync}
                    disabled={isActionRunning}
                  >
                    <Ionicons name="arrow-up-circle-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={styles.actionBtnText}>PUSH LOCAL CHANGES</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtnOutline, isActionRunning && { opacity: 0.6 }]}
                    onPress={handlePullSync}
                    disabled={isActionRunning}
                  >
                    <Text style={styles.actionBtnOutlineText}>PULL REMOTE DELTAS</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {tab === "recovery" && (
              <View style={styles.card}>
                <SectionHeader icon="time-outline" title="DATA RECOVERY" />
                {snapshots.length === 0 ? (
                  <Text style={styles.itemMeta}>No snapshots available yet</Text>
                ) : (
                  snapshots.map((s) => (
                    <TouchableOpacity
                      key={s.id}
                      onPress={() => setSelectedSnapshotId(s.id)}
                      style={[styles.snapshotCard, selectedSnapshotId === s.id && styles.snapshotCardSelected]}
                      activeOpacity={0.8}
                    >
                      <View style={styles.snapshotType}>
                        <Text style={styles.snapshotTypeText}>{s.snapshotType}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemTitle}>Point-in-time backup</Text>
                        <Text style={styles.itemMeta}>{new Date(s.createdAt).toLocaleString()}</Text>
                      </View>
                      {selectedSnapshotId === s.id ? (
                        <Ionicons name="checkmark-circle" size={22} color="#06b6d4" />
                      ) : null}
                    </TouchableOpacity>
                  ))
                )}
                {restoreTestLabel ? (
                  <View style={styles.infoBanner}>
                    <Ionicons name="checkmark-done" size={16} color="#0f172a" />
                    <Text style={styles.infoBannerText}>Last restore test: {restoreTestLabel}</Text>
                  </View>
                ) : null}
                {incidentReplayAvailable ? (
                  <View style={styles.infoBanner}>
                    <Ionicons name="play-circle-outline" size={16} color="#0f172a" />
                    <Text style={styles.infoBannerText}>Incident replay recovery available</Text>
                  </View>
                ) : null}
                <TouchableOpacity
                  style={[styles.actionBtn, isActionRunning && { opacity: 0.6 }]}
                  onPress={handleRestoreTest}
                  disabled={isActionRunning || !selectedSnapshotId}
                >
                  <Text style={styles.actionBtnText}>RUN RESTORE TEST</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtnOutline, isActionRunning && { opacity: 0.6 }]}
                  onPress={handleRestoreSnapshot}
                  disabled={isActionRunning || !selectedSnapshotId}
                >
                  <Text style={styles.actionBtnOutlineText}>RESTORE SNAPSHOT</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default DataBackupSecurity;
