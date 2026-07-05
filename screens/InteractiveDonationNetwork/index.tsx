import { DonationNetworkCampaign, getDonationNetworkCampaigns } from "@/api/getDonationNetworkCampaigns";
import {
  DonationNetworkChatContact,
  getDonationNetworkChatContacts,
} from "@/api/getDonationNetworkChatContacts";
import { DonationNetworkChatMessage, getDonationNetworkChatMessages } from "@/api/getDonationNetworkChatMessages";
import { getDonationNetworkPortal } from "@/api/getDonationNetworkPortal";
import { DonationNetworkStory, getDonationNetworkStories } from "@/api/getDonationNetworkStories";
import { postDonationNetworkCampaign } from "@/api/postDonationNetworkCampaign";
import { postDonationNetworkChatMessage } from "@/api/postDonationNetworkChatMessage";
import { postDonationNetworkPortalDonate } from "@/api/postDonationNetworkPortalDonate";
import { postDonationNetworkStory } from "@/api/postDonationNetworkStory";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth0 } from "react-native-auth0";
import { extractResponseArray } from "@/utils/extractResponseArray";
import FancyAppHeader, { fancyHeaderStyles } from "@/components/fancyAppHeader";
import { styles } from "./styles";
import { DonationTabKey, T_INTERACTIVEDONATION } from "./types";

const contactNgoId = (c: DonationNetworkChatContact) => String(c.ngoId ?? c.id ?? "");

const campaignTitle = (c: DonationNetworkCampaign) => c.title ?? c.name ?? "Campaign";
const campaignGoal = (c: DonationNetworkCampaign) => c.goal ?? c.goalAmount ?? 0;
const campaignRaised = (c: DonationNetworkCampaign) => c.raised ?? c.raisedAmount ?? 0;
const campaignProgress = (c: DonationNetworkCampaign) => {
  if (typeof c.progressPercent === "number") return Math.min(100, Math.max(0, c.progressPercent));
  const g = campaignGoal(c);
  if (g <= 0) return 0;
  return Math.min(100, Math.round((campaignRaised(c) / g) * 100));
};

const messageBody = (m: DonationNetworkChatMessage) => m.body ?? m.text ?? m.content ?? "";

const storyBody = (s: DonationNetworkStory) => s.body ?? s.content ?? s.text ?? "";
const storyAuthor = (s: DonationNetworkStory) => s.author ?? s.authorName ?? "Community";

const InteractiveDonationNetwork: React.FC<T_INTERACTIVEDONATION> = ({ navigation }) => {
  const { getCredentials } = useAuth0();
  const [tab, setTab] = useState<DonationTabKey>("campaigns");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [campaigns, setCampaigns] = useState<DonationNetworkCampaign[]>([]);
  const [portal, setPortal] = useState<Record<string, any> | null>(null);
  const [contacts, setContacts] = useState<DonationNetworkChatContact[]>([]);
  const [selectedNgoId, setSelectedNgoId] = useState<string>("");
  const [messages, setMessages] = useState<DonationNetworkChatMessage[]>([]);
  const [stories, setStories] = useState<DonationNetworkStory[]>([]);

  const [newCampaignTitle, setNewCampaignTitle] = useState("");
  const [newCampaignGoal, setNewCampaignGoal] = useState("");
  const [newCampaignCategory, setNewCampaignCategory] = useState("");

  const [donateAmount, setDonateAmount] = useState("");
  const [donateCampaignId, setDonateCampaignId] = useState("");
  const [campaignPickerVisible, setCampaignPickerVisible] = useState(false);

  const [chatDraft, setChatDraft] = useState("");
  const [sendingChat, setSendingChat] = useState(false);

  const [storyAuthorInput, setStoryAuthorInput] = useState("");
  const [storyContent, setStoryContent] = useState("");

  const loadToken = useCallback(async () => {
    try {
      const creds = await getCredentials();
      if (creds?.accessToken) setToken(creds.accessToken);
    } catch {
      setToken("");
    }
  }, [getCredentials]);

  const loadCampaigns = useCallback(async (t: string) => {
    const raw = await getDonationNetworkCampaigns(t);
    setCampaigns(extractResponseArray<DonationNetworkCampaign>(raw));
  }, []);

  const loadPortal = useCallback(async (t: string) => {
    const data = await getDonationNetworkPortal(t);
    setPortal(data && typeof data === "object" ? data : {});
  }, []);

  const loadContacts = useCallback(async (t: string) => {
    const raw = await getDonationNetworkChatContacts(t);
    setContacts(extractResponseArray<DonationNetworkChatContact>(raw));
  }, []);

  const loadMessages = useCallback(async (t: string, ngoId: string) => {
    if (!ngoId) {
      setMessages([]);
      return;
    }
    const raw = await getDonationNetworkChatMessages(t, ngoId);
    setMessages(extractResponseArray<DonationNetworkChatMessage>(raw));
  }, []);

  const loadStories = useCallback(async (t: string) => {
    const raw = await getDonationNetworkStories(t);
    setStories(extractResponseArray<DonationNetworkStory>(raw));
  }, []);

  const refreshTab = useCallback(
    async (t: string, current: DonationTabKey) => {
      if (!t) return;
      setIsLoading(true);
      try {
        if (current === "campaigns") await loadCampaigns(t);
        if (current === "portal") await Promise.all([loadPortal(t), loadCampaigns(t)]);
        if (current === "chat") await loadContacts(t);
        if (current === "stories") await loadStories(t);
      } catch {
        Alert.alert("Error", "Could not load donation network data.");
      } finally {
        setIsLoading(false);
      }
    },
    [loadCampaigns, loadContacts, loadPortal, loadStories]
  );

  const donateCampaignLabel = useMemo(() => {
    const id = donateCampaignId.trim();
    if (!id) return "General donation (no specific campaign)";
    const c = campaigns.find((x) => String(x.id ?? "") === id);
    if (c) return campaignTitle(c);
    return id;
  }, [donateCampaignId, campaigns]);

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  useEffect(() => {
    if (token) refreshTab(token, tab);
  }, [token, tab, refreshTab]);

  useEffect(() => {
    if (tab !== "chat" || contacts.length === 0) return;
    const valid = contacts.some((c) => contactNgoId(c) === selectedNgoId);
    if (!selectedNgoId || !valid) {
      const id = contactNgoId(contacts[0]);
      if (id) setSelectedNgoId(id);
    }
  }, [contacts, tab]);

  useEffect(() => {
    if (token && tab === "chat" && selectedNgoId) {
      loadMessages(token, selectedNgoId).catch(() => {});
    }
  }, [token, tab, selectedNgoId, loadMessages]);

  const handleCreateCampaign = async () => {
    if (!newCampaignTitle.trim()) {
      Alert.alert("Validation", "Campaign title is required.");
      return;
    }
    const goalNum = newCampaignGoal.trim() ? Number(newCampaignGoal) : undefined;
    try {
      await postDonationNetworkCampaign(token, {
        title: newCampaignTitle.trim(),
        goalAmount: goalNum && !Number.isNaN(goalNum) ? goalNum : undefined,
        causeCategory: newCampaignCategory.trim() || undefined,
      });
      setNewCampaignTitle("");
      setNewCampaignGoal("");
      setNewCampaignCategory("");
      await loadCampaigns(token);
      Alert.alert("Success", "Campaign created.");
    } catch {
      Alert.alert("Error", "Could not create campaign.");
    }
  };

  const handleDonate = async () => {
    const amt = Number(donateAmount);
    if (!donateAmount.trim() || Number.isNaN(amt) || amt <= 0) {
      Alert.alert("Validation", "Enter a valid donation amount.");
      return;
    }
    try {
      await postDonationNetworkPortalDonate(token, {
        amount: amt,
        currency: "USD",
        campaignId: donateCampaignId.trim() || undefined,
      });
      setDonateAmount("");
      Alert.alert("Thank you", "Donation submitted.");
      await loadPortal(token);
    } catch {
      Alert.alert("Error", "Donation could not be processed.");
    }
  };

  const handleSendChat = async () => {
    if (!selectedNgoId) {
      Alert.alert("Chat", "Select an NGO conversation first.");
      return;
    }
    const text = chatDraft.trim();
    if (!text) return;
    setSendingChat(true);
    try {
      await postDonationNetworkChatMessage(token, {
        ngoId: selectedNgoId,
        text,
        content: text,
        body: text,
      });
      setChatDraft("");
      await loadMessages(token, selectedNgoId);
    } catch {
      Alert.alert("Error", "Message could not be sent.");
    } finally {
      setSendingChat(false);
    }
  };

  const handlePostStory = async () => {
    if (!storyContent.trim()) {
      Alert.alert("Validation", "Story text is required.");
      return;
    }
    try {
      await postDonationNetworkStory(token, {
        author: storyAuthorInput.trim() || undefined,
        content: storyContent.trim(),
      });
      setStoryAuthorInput("");
      setStoryContent("");
      await loadStories(token);
      Alert.alert("Success", "Story shared.");
    } catch {
      Alert.alert("Error", "Could not post story.");
    }
  };

  const suggestedAmounts: number[] = Array.isArray(portal?.suggestedAmounts)
    ? portal!.suggestedAmounts
    : [25, 50, 100];

  const CampaignDirectory = () => (
    <View>
      <Text style={styles.sectionTitle}>NEW CAMPAIGN</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#999"
        value={newCampaignTitle}
        onChangeText={setNewCampaignTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Goal amount (optional)"
        placeholderTextColor="#999"
        keyboardType="decimal-pad"
        value={newCampaignGoal}
        onChangeText={setNewCampaignGoal}
      />
      <TextInput
        style={styles.input}
        placeholder="Category (optional)"
        placeholderTextColor="#999"
        value={newCampaignCategory}
        onChangeText={setNewCampaignCategory}
      />
      <TouchableOpacity style={styles.primaryBtn} onPress={handleCreateCampaign}>
        <Text style={styles.primaryBtnText}>CREATE CAMPAIGN</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>ACTIVE CAMPAIGNS</Text>
      {campaigns.length === 0 && <Text style={styles.emptyText}>No campaigns yet.</Text>}
      {campaigns.map((item, i) => {
        const pct = campaignProgress(item);
        const title = campaignTitle(item);
        const g = campaignGoal(item);
        const r = campaignRaised(item);
        const cat = item.category ?? "General";
        const uri = item.imageUrl ?? item.coverImageUrl;
        return (
          <View key={item.id || String(i)} style={styles.campaignCard}>
            <View style={styles.campaignImg}>
              {uri ? (
                <Image source={{ uri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
              ) : (
                <Ionicons name="images-outline" size={40} color="#999" />
              )}
            </View>
            <View style={styles.campaignInfo}>
              <Text style={{ fontSize: 10, fontWeight: "900", color: "#666" }}>{String(cat).toUpperCase()}</Text>
              <Text style={{ fontSize: 16, fontWeight: "800", color: "#111", marginTop: 4 }}>{title}</Text>
              <View style={styles.progTrack}>
                <View style={[styles.progFill, { width: `${pct}%` }]} />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 11, fontWeight: "700" }}>Goal: {g > 0 ? `$${g.toLocaleString()}` : "—"}</Text>
                <Text style={{ fontSize: 11, fontWeight: "900", color: "#0f4c3a" }}>{pct}% funded</Text>
              </View>
              {r > 0 && (
                <Text style={{ fontSize: 10, color: "#666", marginTop: 4 }}>Raised: ${r.toLocaleString()}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );

  const SmartPortal = () => (
    <View style={styles.portalCard}>
      <Text style={{ fontSize: 14, fontWeight: "900", color: "#0f4c3a", marginBottom: 12 }}>PORTAL</Text>
      {portal?.headline ? (
        <Text style={{ fontSize: 18, fontWeight: "800", color: "#111", marginBottom: 8 }}>{portal.headline}</Text>
      ) : null}
      {portal?.summary ? (
        <Text style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>{portal.summary}</Text>
      ) : !portal?.headline ? (
        <Text style={styles.emptyText}>Your giving hub — enter an amount to donate.</Text>
      ) : null}

      <Text style={{ fontSize: 14, fontWeight: "900", color: "#0f4c3a", marginBottom: 12 }}>QUICK AMOUNTS</Text>
      <View style={styles.amountChipsRow}>
        {suggestedAmounts.map((n) => (
          <TouchableOpacity key={n} style={styles.amountChip} onPress={() => setDonateAmount(String(n))}>
            <Text style={styles.amountChipText}>${n}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={{ fontSize: 14, fontWeight: "900", color: "#0f4c3a", marginBottom: 12 }}>QUICK DONATE</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        placeholderTextColor="#999"
        keyboardType="decimal-pad"
        value={donateAmount}
        onChangeText={setDonateAmount}
      />
      <Text style={styles.fieldLabel}>CAMPAIGN (OPTIONAL)</Text>
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={() => setCampaignPickerVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.dropdownTriggerText} numberOfLines={2}>
          {donateCampaignLabel}
        </Text>
        <Ionicons name="chevron-down" size={22} color="#0f4c3a" />
      </TouchableOpacity>

      <Modal visible={campaignPickerVisible} transparent animationType="slide" onRequestClose={() => setCampaignPickerVisible(false)}>
        <View style={styles.pickerModalRoot}>
          <Pressable style={styles.pickerModalBackdrop} onPress={() => setCampaignPickerVisible(false)} />
          <View style={styles.pickerSheet}>
            <View style={styles.pickerSheetHeader}>
              <Text style={styles.pickerSheetTitle}>Select campaign</Text>
              <TouchableOpacity onPress={() => setCampaignPickerVisible(false)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <Ionicons name="close" size={26} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={styles.pickerRow}
                onPress={() => {
                  setDonateCampaignId("");
                  setCampaignPickerVisible(false);
                }}
              >
                <Text style={styles.pickerRowTitle}>General donation</Text>
                <Text style={styles.pickerRowMeta}>Not tied to a specific campaign</Text>
              </TouchableOpacity>
              {campaigns.length === 0 ? (
                <Text style={[styles.emptyText, { paddingHorizontal: 18, paddingVertical: 12 }]}>
                  No campaigns loaded. Open the Campaigns tab once, or pull to refresh from the header.
                </Text>
              ) : (
                campaigns.map((c, idx) => {
                  const id = c.id != null && String(c.id) !== "" ? String(c.id) : null;
                  const title = campaignTitle(c);
                  return (
                    <TouchableOpacity
                      key={id ?? `camp-${idx}`}
                      style={styles.pickerRow}
                      disabled={!id}
                      onPress={() => {
                        if (!id) return;
                        setDonateCampaignId(id);
                        setCampaignPickerVisible(false);
                      }}
                    >
                      <Text style={[styles.pickerRowTitle, !id && { color: "#AAA" }]}>{title}</Text>
                      <Text style={styles.pickerRowMeta}>{id ? `ID: ${id}` : "Missing id — cannot attach"}</Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleDonate}>
        <Text style={styles.primaryBtnText}>SECURE DONATION</Text>
      </TouchableOpacity>
    </View>
  );

  const DonorNGOCommunication = () => (
    <View style={styles.chatContainer}>
      <Text style={styles.sectionTitle}>NGO CONTACTS</Text>
      {contacts.length === 0 ? (
        <Text style={styles.emptyText}>No chat contacts yet.</Text>
      ) : (
        <View style={styles.contactRow}>
          {contacts.map((c, idx) => {
            const id = contactNgoId(c);
            const label = c.name ?? c.title ?? c.organizationName ?? "NGO";
            const active = id === selectedNgoId;
            return (
              <TouchableOpacity
                key={id ? `ngo-${id}` : `ngo-${idx}-${label}`}
                style={[styles.contactChip, active && styles.contactChipActive]}
                onPress={() => setSelectedNgoId(id)}
              >
                <Text style={[styles.contactChipText, active && styles.contactChipTextActive]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <Text style={styles.sectionTitle}>MESSAGES</Text>
      {!selectedNgoId ? (
        <Text style={styles.emptyText}>Select a contact to load messages.</Text>
      ) : (
        <FlatList
          data={[...messages].reverse()}
          keyExtractor={(item, idx) => String(item.id ?? idx)}
          style={{ flex: 1, minHeight: 220 }}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={({ item }) => (
            <View style={styles.messageBubble}>
              <Text style={{ fontSize: 14, color: "#333" }}>{messageBody(item)}</Text>
              <Text style={styles.messageMeta}>
                {item.sender?.name ? `${item.sender.name} · ` : ""}
                {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
              </Text>
            </View>
          )}
        />
      )}

      <View style={styles.chatInputRow}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={chatDraft}
          onChangeText={setChatDraft}
          editable={!!selectedNgoId && !sendingChat}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSendChat} disabled={sendingChat || !selectedNgoId}>
          <Text style={styles.sendBtnText}>{sendingChat ? "…" : "SEND"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const CommunityStories = () => (
    <View>
      <Text style={styles.sectionTitle}>SHARE YOUR STORY</Text>
      <TextInput
        style={styles.input}
        placeholder="Your name (optional)"
        placeholderTextColor="#999"
        value={storyAuthorInput}
        onChangeText={setStoryAuthorInput}
      />
      <TextInput
        style={[styles.input, { minHeight: 100 }]}
        placeholder="What impact did you see?"
        placeholderTextColor="#999"
        multiline
        textAlignVertical="top"
        value={storyContent}
        onChangeText={setStoryContent}
      />
      <TouchableOpacity style={styles.primaryBtn} onPress={handlePostStory}>
        <Text style={styles.primaryBtnText}>POST STORY</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>COMMUNITY</Text>
      {stories.length === 0 && <Text style={styles.emptyText}>No stories yet.</Text>}
      {stories.map((s, idx) => (
        <View key={s.id || String(idx)} style={styles.storyCard}>
          <Text style={{ fontWeight: "900", color: "#D4AF37" }}>{storyAuthor(s).toUpperCase()}</Text>
          <Text style={{ fontSize: 14, color: "#444", marginTop: 10 }}>{storyBody(s)}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#0f4c3a" />
      <FancyAppHeader
        title="Donation Network"
        subtitle="Campaigns, portal, chat & community stories"
        badge={{ icon: "heart", label: "GIVE & SUPPORT" }}
        onBack={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity
            onPress={() => token && refreshTab(token, tab)}
            style={fancyHeaderStyles.backBtn}
          >
            <Ionicons name="refresh-outline" size={18} color="#FFF" />
          </TouchableOpacity>
        }
        tabs={[
          { id: "campaigns", label: "CAMPAIGNS" },
          { id: "portal", label: "PORTAL" },
          { id: "chat", label: "CHAT" },
          { id: "stories", label: "STORIES" },
        ]}
        activeTab={tab}
        onTabChange={(id) => setTab(id as DonationTabKey)}
      />

      {tab === "chat" ? (
        isLoading ? (
          <ActivityIndicator size="large" color="#0f4c3a" style={{ marginTop: 40 }} />
        ) : (
          <DonorNGOCommunication />
        )
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0f4c3a" style={{ marginTop: 40 }} />
          ) : (
            <>
              {tab === "campaigns" && <CampaignDirectory />}
              {tab === "portal" && <SmartPortal />}
              {tab === "stories" && <CommunityStories />}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default InteractiveDonationNetwork;
