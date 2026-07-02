import { getReviewsFeedbackAdminQueue } from "@/api/getReviewsFeedbackAdminQueue";
import { FeedbackReview, getReviewsFeedbackRecent } from "@/api/getReviewsFeedbackRecent";
import { getReviewsFeedbackWeeklyReport } from "@/api/getReviewsFeedbackWeeklyReport";
import { FeedbackStatus, patchReviewsFeedbackStatus } from "@/api/patchReviewsFeedbackStatus";
import { postReviewsFeedbackRating } from "@/api/postReviewsFeedbackRating";
import { postReviewsFeedbackSubmit } from "@/api/postReviewsFeedbackSubmit";
import { postReviewsFeedbackText } from "@/api/postReviewsFeedbackText";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";

type TabKey = "star" | "text" | "anonymous" | "admin";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "#fef3c7", text: "#92400e" },
  APPROVED: { bg: "#dcfce7", text: "#166534" },
  FLAGGED: { bg: "#fee2e2", text: "#991b1b" },
  ESCALATED: { bg: "#ede9fe", text: "#5b21b6" },
};

const RATING_LABELS = ["Poor", "Fair", "Good", "Great", "Excellent"];

const ReviewsFeedback: React.FC<any> = ({ navigation }) => {
  const { token, isReady, error: authError, reloadToken } = useAuthToken();
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [tab, setTab] = useState<TabKey>("star");
  const [recentReviews, setRecentReviews] = useState<FeedbackReview[]>([]);
  const [adminQueue, setAdminQueue] = useState<FeedbackReview[]>([]);
  const [adminSummary, setAdminSummary] = useState({
    pendingCount: 0,
    flaggedCount: 0,
    newEntriesLabel: "0 new entries",
    flaggedLabel: "0 flagged high priority",
  });
  const [weeklyReport, setWeeklyReport] = useState({
    displayLabel: "CSAT trend + sentiment summary available",
    sentimentSummary: "",
    csatScore: 0,
  });

  const loadAdminData = useCallback(async (currentToken: string) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [queueData, reportData, recentData] = await Promise.all([
        getReviewsFeedbackAdminQueue(currentToken),
        getReviewsFeedbackWeeklyReport(currentToken),
        getReviewsFeedbackRecent(currentToken, 10),
      ]);
      if (queueData.summary) setAdminSummary(queueData.summary);
      setAdminQueue(queueData.queue ?? []);
      setWeeklyReport({
        displayLabel: reportData.displayLabel ?? "CSAT trend + sentiment summary available",
        sentimentSummary: reportData.sentimentSummary ?? "",
        csatScore: reportData.csatScore ?? 0,
      });
      setRecentReviews(recentData.reviews ?? []);
    } catch (error: any) {
      setLoadError(error?.response?.data?.message ?? "Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isReady && token && tab === "admin") loadAdminData(token);
  }, [isReady, token, tab, loadAdminData]);

  const handleRefresh = async () => {
    const nextToken = await reloadToken();
    if (nextToken && tab === "admin") await loadAdminData(nextToken);
  };

  const handleSaveRating = async () => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      await postReviewsFeedbackRating(token, { rating, isAnonymous: anonymous });
      Alert.alert("Success", "Rating saved.");
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message ?? "Failed to save rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveTextFeedback = async () => {
    if (!token) return;
    if (!comment.trim()) {
      Alert.alert("Required", "Please enter your feedback.");
      return;
    }
    setIsSubmitting(true);
    try {
      await postReviewsFeedbackText(token, { comment: comment.trim(), isAnonymous: anonymous });
      Alert.alert("Success", "Text feedback saved.");
      setComment("");
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message ?? "Failed to save feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFullFeedback = async () => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      await postReviewsFeedbackSubmit(token, {
        rating,
        comment: comment.trim() || undefined,
        isAnonymous: anonymous,
      });
      Alert.alert("Success", "Feedback submitted.");
      setComment("");
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message ?? "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (feedbackId: string, status: FeedbackStatus) => {
    if (!token) return;
    try {
      await patchReviewsFeedbackStatus(token, feedbackId, status);
      Alert.alert("Updated", `Feedback marked as ${status}.`);
      loadAdminData(token);
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message ?? "Failed to update status");
    }
  };

  const SectionHeader = ({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>
        <Ionicons name={icon} size={18} color="#1f3d18" />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <FancyAppHeader
        title="Reviews"
        subtitle="Share your experience · help us improve SDH"
        badge={{ icon: "megaphone-outline", label: "YOUR VOICE MATTERS" }}
        rightIcon="chatbubbles"
        rightIconColor="#fde68a"
        onBack={() => navigation.goBack()}
        tabs={[
          { id: "star", label: "RATING" },
          { id: "text", label: "FEEDBACK" },
          { id: "anonymous", label: "ANONYMOUS" },
          { id: "admin", label: "ADMIN" },
        ]}
        activeTab={tab}
        onTabChange={(id) => setTab(id as TabKey)}
      />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        refreshControl={
          tab === "admin" ? (
            <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor="#1f3d18" />
          ) : undefined
        }
      >
        {authError && tab !== "admin" ? (
          <View style={styles.card}>
            <SectionHeader icon="cloud-offline-outline" title="UNABLE TO LOAD" />
            <Text style={styles.reviewMeta}>{authError}</Text>
          </View>
        ) : null}

        {tab === "star" && (
          <View style={styles.card}>
            <SectionHeader icon="star-outline" title="RATE YOUR EXPERIENCE" />
            <View style={styles.ratingHero}>
              <View style={styles.ratingCircle}>
                <Text style={styles.ratingBig}>{rating}</Text>
              </View>
              <Text style={[styles.reviewMeta, { fontWeight: "800", color: "#92400e" }]}>
                {RATING_LABELS[rating - 1]}
              </Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <TouchableOpacity
                    key={n}
                    onPress={() => setRating(n)}
                    style={[styles.starBtn, n <= rating && styles.starBtnActive]}
                  >
                    <Ionicons name={n <= rating ? "star" : "star-outline"} size={22} color="#f59e0b" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity
              style={[styles.actionBtn, isSubmitting && { opacity: 0.6 }]}
              onPress={handleSaveRating}
              disabled={isSubmitting}
            >
              <Ionicons name="checkmark-circle-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.actionBtnText}>{isSubmitting ? "SAVING..." : "SAVE RATING"}</Text>
            </TouchableOpacity>
          </View>
        )}

        {tab === "text" && (
          <View style={styles.card}>
            <SectionHeader icon="chatbox-ellipses-outline" title="TEXT FEEDBACK" />
            <TextInput
              style={styles.input}
              value={comment}
              onChangeText={setComment}
              placeholder="Share your experience or suggestion..."
              placeholderTextColor="#9CA3AF"
              multiline
            />
            <TouchableOpacity
              style={[styles.actionBtn, isSubmitting && { opacity: 0.6 }]}
              onPress={handleSaveTextFeedback}
              disabled={isSubmitting}
            >
              <Ionicons name="send-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.actionBtnText}>{isSubmitting ? "SAVING..." : "SUBMIT FEEDBACK"}</Text>
            </TouchableOpacity>
          </View>
        )}

        {tab === "anonymous" && (
          <View style={styles.card}>
            <SectionHeader icon="eye-off-outline" title="ANONYMOUS MODE" />
            <View style={styles.anonCard}>
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={styles.reviewTitle}>Submit anonymously</Text>
                  <Text style={styles.reviewMeta}>
                    {anonymous ? "Your identity is hidden from reviewers." : "Your name will be visible to reviewers."}
                  </Text>
                </View>
                <Switch
                  value={anonymous}
                  onValueChange={setAnonymous}
                  trackColor={{ false: "#d1d5db", true: "#86efac" }}
                />
              </View>
            </View>
            <TextInput
              style={[styles.input, { marginTop: 12 }]}
              value={comment}
              onChangeText={setComment}
              placeholder="Optional: add a comment with your feedback..."
              placeholderTextColor="#9CA3AF"
              multiline
            />
            <TouchableOpacity
              style={[styles.actionBtn, isSubmitting && { opacity: 0.6 }]}
              onPress={handleSubmitFullFeedback}
              disabled={isSubmitting}
            >
              <Text style={styles.actionBtnText}>{isSubmitting ? "SUBMITTING..." : "SUBMIT FEEDBACK"}</Text>
            </TouchableOpacity>
          </View>
        )}

        {tab === "admin" && (
          <>
            {!isReady || isLoading ? (
              <ActivityIndicator size="large" color="#1f3d18" style={{ marginTop: 24 }} />
            ) : authError || loadError ? (
              <View style={styles.card}>
                <SectionHeader icon="cloud-offline-outline" title="UNABLE TO LOAD" />
                <Text style={styles.reviewMeta}>{authError ?? loadError}</Text>
                <TouchableOpacity style={styles.actionBtn} onPress={handleRefresh}>
                  <Text style={styles.actionBtnText}>RETRY</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.statCardWide}>
                  <Text style={styles.statLabel}>WEEKLY CSAT SCORE</Text>
                  <Text style={styles.statValueGold}>{weeklyReport.csatScore}/5</Text>
                  {weeklyReport.sentimentSummary ? (
                    <Text style={[styles.reviewMeta, { textAlign: "left", marginTop: 6 }]}>
                      {weeklyReport.sentimentSummary}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.statGrid}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{adminSummary.pendingCount}</Text>
                    <Text style={styles.statLabel}>PENDING</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={[styles.statValue, { color: "#dc2626" }]}>{adminSummary.flaggedCount}</Text>
                    <Text style={styles.statLabel}>FLAGGED</Text>
                  </View>
                </View>

                <View style={styles.card}>
                  <SectionHeader icon="git-network-outline" title="MODERATION PIPELINE" />
                  <View style={styles.pipelineRow}>
                    {[
                      { icon: "download-outline", label: "COLLECT" },
                      { icon: "funnel-outline", label: "CLASSIFY" },
                      { icon: "alert-circle-outline", label: "ESCALATE" },
                      { icon: "bar-chart-outline", label: "REPORT" },
                    ].map((step) => (
                      <View key={step.label} style={styles.pipelineStep}>
                        <Ionicons name={step.icon as keyof typeof Ionicons.glyphMap} size={16} color="#1f3d18" />
                        <Text style={styles.pipelineText}>{step.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.card}>
                  <SectionHeader icon="list-outline" title="MODERATION QUEUE" />
                  {adminQueue.length === 0 ? (
                    <Text style={styles.reviewMeta}>No items in queue.</Text>
                  ) : (
                    adminQueue.slice(0, 8).map((item) => {
                      const colors = STATUS_COLORS[item.status] ?? STATUS_COLORS.PENDING;
                      return (
                        <View key={item.id} style={styles.queueItem}>
                          <Text style={styles.reviewTitle}>
                            {item.submitterLabel}
                            {item.rating ? ` · ${item.rating}/5` : ""}
                          </Text>
                          {item.comment ? (
                            <View style={styles.quoteBox}>
                              <Text style={styles.quoteText}>&ldquo;{item.comment}&rdquo;</Text>
                            </View>
                          ) : null}
                          <View style={[styles.statusChip, { backgroundColor: colors.bg }]}>
                            <Text style={[styles.statusChipText, { color: colors.text }]}>{item.status}</Text>
                          </View>
                          {(item.status === "PENDING" || item.status === "FLAGGED") && (
                            <View style={styles.adminActionsRow}>
                              <TouchableOpacity
                                style={styles.adminActionBtn}
                                onPress={() => handleUpdateStatus(item.id, "APPROVED")}
                              >
                                <Text style={styles.adminActionBtnText}>APPROVE</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.adminActionBtn}
                                onPress={() => handleUpdateStatus(item.id, "ESCALATED")}
                              >
                                <Text style={styles.adminActionBtnText}>ESCALATE</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      );
                    })
                  )}
                </View>

                <View style={styles.card}>
                  <SectionHeader icon="ribbon-outline" title="RECENT REVIEWS" />
                  {recentReviews.length === 0 ? (
                    <Text style={styles.reviewMeta}>No approved reviews yet.</Text>
                  ) : (
                    recentReviews.map((r) => (
                      <View key={r.id} style={styles.reviewCard}>
                        <Text style={styles.reviewTitle}>{r.submitterLabel}</Text>
                        {r.rating ? (
                          <View style={styles.starsInline}>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Ionicons
                                key={n}
                                name={n <= (r.rating ?? 0) ? "star" : "star-outline"}
                                size={12}
                                color="#f59e0b"
                                style={{ marginRight: 2 }}
                              />
                            ))}
                          </View>
                        ) : null}
                        {r.comment ? (
                          <View style={styles.quoteBox}>
                            <Text style={styles.quoteText}>&ldquo;{r.comment}&rdquo;</Text>
                          </View>
                        ) : null}
                      </View>
                    ))
                  )}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ReviewsFeedback;
