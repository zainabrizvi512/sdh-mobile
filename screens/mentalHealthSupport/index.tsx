import {
  getMentalHealthMySessions,
  MentalHealthSession,
} from "@/api/getMentalHealthMySessions";
import {
  getMentalHealthNgos,
  MentalHealthNgo,
} from "@/api/getMentalHealthNgos";
import {
  getMentalHealthProfessionals,
  MentalHealthProfessional,
} from "@/api/getMentalHealthProfessionals";
import {
  getMentalHealthSelfHelpResources,
  MentalHealthSelfHelpResource,
} from "@/api/getMentalHealthSelfHelpResources";
import {
  getMentalHealthStressTips,
  MentalHealthStressTip,
} from "@/api/getMentalHealthStressTips";
import { postMentalHealthJournalEntry } from "@/api/postMentalHealthJournalEntry";
import { postMentalHealthSessionRequest } from "@/api/postMentalHealthSessionRequest";
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
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";

type TabKey = "professional" | "selfHelp" | "ngo" | "stress";

const RESOURCE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  GUIDE: "book-outline",
  AUDIO: "headset-outline",
  FORM: "clipboard-outline",
  JOURNAL: "create-outline",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const MentalHealthSupport: React.FC<any> = ({ navigation }) => {
  const { token, isReady, error: authError, reloadToken } = useAuthToken();
  const [tab, setTab] = useState<TabKey>("professional");
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [professionals, setProfessionals] = useState<MentalHealthProfessional[]>([]);
  const [mySessions, setMySessions] = useState<MentalHealthSession[]>([]);
  const [resources, setResources] = useState<MentalHealthSelfHelpResource[]>([]);
  const [ngos, setNgos] = useState<MentalHealthNgo[]>([]);
  const [tips, setTips] = useState<MentalHealthStressTip[]>([]);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  const [journalContent, setJournalContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTabData = useCallback(async (currentToken: string, currentTab: TabKey) => {
    if (!currentToken) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      if (currentTab === "professional") {
        const profData = await getMentalHealthProfessionals(currentToken);
        setProfessionals(profData.professionals ?? []);
        try {
          const sessionData = await getMentalHealthMySessions(currentToken);
          setMySessions(sessionData.sessions ?? []);
        } catch {
          setMySessions([]);
        }
      } else if (currentTab === "selfHelp") {
        const data = await getMentalHealthSelfHelpResources(currentToken);
        setResources(data.resources ?? []);
      } else if (currentTab === "ngo") {
        const data = await getMentalHealthNgos(currentToken);
        setNgos(data.ngos ?? []);
      } else if (currentTab === "stress") {
        const data = await getMentalHealthStressTips(currentToken);
        setTips(data.tips ?? []);
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

  const handleRequestSession = async () => {
    if (!token || !selectedProfessionalId) {
      Alert.alert("Select professional", "Please select a professional first.");
      return;
    }
    setIsSubmitting(true);
    try {
      await postMentalHealthSessionRequest(token, { professionalId: selectedProfessionalId });
      Alert.alert("Success", "Session request submitted.");
      const sessionData = await getMentalHealthMySessions(token);
      setMySessions(sessionData.sessions ?? []);
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message ?? "Failed to request session");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveJournal = async () => {
    if (!token || !journalContent.trim()) {
      Alert.alert("Required", "Please write your journal entry.");
      return;
    }
    setIsSubmitting(true);
    try {
      await postMentalHealthJournalEntry(token, { content: journalContent.trim() });
      Alert.alert("Success", "Journal entry saved.");
      setJournalContent("");
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message ?? "Failed to save journal entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const journalPrompt = resources.find((r) => r.type === "JOURNAL")?.body;

  const SectionHeader = ({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>
        <Ionicons name={icon} size={18} color="#0f4c3a" />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <FancyAppHeader
        title="Mental Health"
        subtitle="Professional care, self-help tools & community support"
        badge={{ icon: "sparkles", label: "WELLNESS HUB" }}
        rightIcon="heart-circle"
        onBack={() => navigation.goBack()}
        tabs={[
          { id: "professional", label: "PROFESSIONALS" },
          { id: "selfHelp", label: "SELF HELP" },
          { id: "ngo", label: "NGO SUPPORT" },
          { id: "stress", label: "STRESS TIPS" },
        ]}
        activeTab={tab}
        onTabChange={(id) => setTab(id as TabKey)}
      />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor="#0f4c3a" />}
      >
        {!isReady || isLoading ? (
          <ActivityIndicator size="large" color="#0f4c3a" style={{ marginTop: 24 }} />
        ) : authError || loadError ? (
          <View style={styles.card}>
            <SectionHeader icon="cloud-offline-outline" title="UNABLE TO LOAD" />
            <Text style={styles.itemMeta}>{authError ?? loadError}</Text>
            <TouchableOpacity style={styles.actionBtn} onPress={handleRefresh}>
              <Ionicons name="refresh" size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.actionBtnText}>RETRY</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.heroRow}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{professionals.length || "—"}</Text>
                <Text style={styles.heroStatLabel}>Experts</Text>
              </View>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{resources.length || "—"}</Text>
                <Text style={styles.heroStatLabel}>Resources</Text>
              </View>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{ngos.length || "—"}</Text>
                <Text style={styles.heroStatLabel}>NGO Partners</Text>
              </View>
            </View>

            {tab === "professional" && (
              <>
                <View style={styles.card}>
                  <SectionHeader icon="medical-outline" title="BOOK A SESSION" />
                  {professionals.length === 0 ? (
                    <View style={styles.emptyWrap}>
                      <Ionicons name="person-outline" size={32} color="#d1d5db" />
                      <Text style={styles.emptyText}>No professionals available</Text>
                    </View>
                  ) : (
                    professionals.map((x) => (
                      <TouchableOpacity
                        key={x.id}
                        style={[styles.listCard, selectedProfessionalId === x.id && styles.listCardSelected]}
                        onPress={() => setSelectedProfessionalId(x.id)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.avatar}>
                          <Text style={styles.avatarText}>{initials(x.name)}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.itemTitle}>{x.name}</Text>
                          <Text style={styles.itemMeta}>{x.specialty}</Text>
                        </View>
                        <View style={styles.chip}>
                          <Text style={styles.chipText}>{x.availabilityDisplay}</Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                  <TouchableOpacity
                    style={[styles.actionBtn, isSubmitting && { opacity: 0.6 }]}
                    onPress={handleRequestSession}
                    disabled={isSubmitting}
                  >
                    <Ionicons name="videocam-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={styles.actionBtnText}>
                      {isSubmitting ? "SUBMITTING..." : "REQUEST SESSION"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {mySessions.length > 0 ? (
                  <View style={styles.card}>
                    <SectionHeader icon="time-outline" title="MY REQUESTS" />
                    {mySessions.map((s) => (
                      <View key={s.id} style={styles.listCard}>
                        <View style={styles.avatar}>
                          <Text style={styles.avatarText}>{initials(s.professional.name)}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.itemTitle}>{s.professional.name}</Text>
                          <Text style={styles.itemMeta}>{s.professional.specialty}</Text>
                        </View>
                        <View style={styles.chip}>
                          <Text style={styles.chipText}>{s.status}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ) : null}
              </>
            )}

            {tab === "selfHelp" && (
              <>
                <View style={styles.card}>
                  <SectionHeader icon="leaf-outline" title="SELF HELP LIBRARY" />
                  {resources.length === 0 ? (
                    <View style={styles.emptyWrap}>
                      <Ionicons name="library-outline" size={32} color="#d1d5db" />
                      <Text style={styles.emptyText}>No resources yet</Text>
                    </View>
                  ) : (
                    resources.map((r) => (
                      <View key={r.id} style={styles.resourceRow}>
                        <View style={styles.resourceIcon}>
                          <Ionicons name={RESOURCE_ICONS[r.type] ?? "document-outline"} size={16} color="#ec4899" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.itemTitle}>{r.title}</Text>
                          {r.durationMinutes ? (
                            <Text style={styles.itemMeta}>{r.durationMinutes} min session</Text>
                          ) : null}
                          {r.body ? <Text style={styles.itemMeta}>{r.body}</Text> : null}
                        </View>
                      </View>
                    ))
                  )}
                </View>

                <View style={styles.card}>
                  <SectionHeader icon="create-outline" title="GUIDED JOURNAL" />
                  {journalPrompt ? (
                    <Text style={[styles.itemMeta, { marginBottom: 10, fontStyle: "italic" }]}>{journalPrompt}</Text>
                  ) : null}
                  <TextInput
                    style={styles.input}
                    value={journalContent}
                    onChangeText={setJournalContent}
                    placeholder="Write your thoughts..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                  />
                  <TouchableOpacity
                    style={[styles.actionBtn, isSubmitting && { opacity: 0.6 }]}
                    onPress={handleSaveJournal}
                    disabled={isSubmitting}
                  >
                    <Ionicons name="save-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={styles.actionBtnText}>
                      {isSubmitting ? "SAVING..." : "SAVE JOURNAL ENTRY"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {tab === "ngo" && (
              <View style={styles.card}>
                <SectionHeader icon="people-outline" title="NGO CONNECTIONS" />
                {ngos.length === 0 ? (
                  <View style={styles.emptyWrap}>
                    <Ionicons name="heart-outline" size={32} color="#d1d5db" />
                    <Text style={styles.emptyText}>No NGOs listed</Text>
                  </View>
                ) : (
                  ngos.map((n) => (
                    <View key={n.id} style={styles.ngoCard}>
                      <Text style={styles.itemTitle}>{n.name}</Text>
                      <Text style={styles.itemMeta}>{n.description}</Text>
                      {n.helpline ? (
                        <View style={styles.helplineRow}>
                          <Ionicons name="call" size={14} color="#0f4c3a" />
                          <Text style={styles.helplineText}>{n.helpline}</Text>
                        </View>
                      ) : null}
                    </View>
                  ))
                )}
              </View>
            )}

            {tab === "stress" && (
              <View style={styles.card}>
                <SectionHeader icon="sunny-outline" title="STRESS RELIEF TIPS" />
                {tips.length === 0 ? (
                  <View style={styles.emptyWrap}>
                    <Ionicons name="happy-outline" size={32} color="#d1d5db" />
                    <Text style={styles.emptyText}>No tips available</Text>
                  </View>
                ) : (
                  tips.map((t, idx) => (
                    <View key={t.id} style={styles.tipCard}>
                      <View style={styles.tipNumber}>
                        <Text style={styles.tipNumberText}>{idx + 1}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemTitle}>{t.title}</Text>
                        {t.body ? <Text style={styles.itemMeta}>{t.body}</Text> : null}
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default MentalHealthSupport;
