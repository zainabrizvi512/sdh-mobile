import { getDisasterFrameworkCommunication } from "@/api/getDisasterFrameworkCommunication";
import { getDisasterFrameworkDashboard } from "@/api/getDisasterFrameworkDashboard";
import { getDisasterFrameworkIncidents } from "@/api/getDisasterFrameworkIncidents";
import { getDisasterFrameworkTasks } from "@/api/getDisasterFrameworkTasks";
import { getDisasterFrameworkTimeline } from "@/api/getDisasterFrameworkTimeline";
import { patchDisasterFrameworkTaskStatus } from "@/api/patchDisasterFrameworkTaskStatus";
import { postDisasterFrameworkCommunication } from "@/api/postDisasterFrameworkCommunication";
import { postDisasterFrameworkIncident } from "@/api/postDisasterFrameworkIncident";
import { postDisasterFrameworkTask } from "@/api/postDisasterFrameworkTask";
import { postDisasterFrameworkTimeline } from "@/api/postDisasterFrameworkTimeline";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { styles } from "./styles";
import {
  DisasterCommunicationMessage,
  DisasterDashboardData,
  DisasterIncidentOption,
  DisasterTabKey,
  DisasterTask,
  DisasterTimelineEvent,
  T_DISASTERRESPONSE,
} from "./types";

function mergeIncidents(prev: DisasterIncidentOption[], next: DisasterIncidentOption[]): DisasterIncidentOption[] {
  const m = new Map<string, DisasterIncidentOption>();
  for (const x of [...prev, ...next]) {
    const id = String(x?.id ?? "");
    if (!id) continue;
    m.set(id, { ...m.get(id), ...x, id });
  }
  return Array.from(m.values());
}

const DisasterResponseFramework: React.FC<T_DISASTERRESPONSE> = ({ navigation }) => {
  const { getCredentials } = useAuth0();
  const [tab, setTab] = useState<DisasterTabKey>("dashboard");
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dashboard, setDashboard] = useState<DisasterDashboardData>({
    activeIncidents: 0,
    responders: 0,
    sector: "Unknown",
  });
  const [communication, setCommunication] = useState<DisasterCommunicationMessage[]>([]);
  const [tasks, setTasks] = useState<DisasterTask[]>([]);
  const [timeline, setTimeline] = useState<DisasterTimelineEvent[]>([]);

  const [incidentId, setIncidentId] = useState<string>("");
  const [newIncidentTitle, setNewIncidentTitle] = useState<string>("");
  const [newIncidentLocation, setNewIncidentLocation] = useState<string>("");
  const [newCommunicationMessage, setNewCommunicationMessage] = useState<string>("");
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>("");
  const [newTimelineDescription, setNewTimelineDescription] = useState<string>("");
  const [incidents, setIncidents] = useState<DisasterIncidentOption[]>([]);
  const [incidentPickerVisible, setIncidentPickerVisible] = useState(false);

  const incidentSelectLabel = useMemo(() => {
    const id = incidentId.trim();
    if (!id) return "Select incident…";
    const row = incidents.find((x) => String(x.id) === id);
    if (row) return row.title ?? row.name ?? id;
    return id;
  }, [incidentId, incidents]);

  useEffect(() => {
    const initToken = async () => {
      try {
        const creds = await getCredentials();
        if (creds?.accessToken) setToken(creds.accessToken);
      } catch (error) {
        setToken("");
      }
    };
    initToken();
  }, [getCredentials]);

  const loadIncidentsList = useCallback(async (currentToken: string) => {
    if (!currentToken) return;
    try {
      const raw = await getDisasterFrameworkIncidents(currentToken);
      setIncidents((prev) => mergeIncidents(prev, extractResponseArray<DisasterIncidentOption>(raw)));
    } catch {
      /* GET /disaster-framework/incidents may be unavailable */
    }
  }, []);

  const loadFrameworkData = async (currentToken: string, selectedIncidentId?: string) => {
    if (!currentToken) return;
    setIsLoading(true);
    try {
      const [dashboardData, commsData, tasksData] = await Promise.all([
        getDisasterFrameworkDashboard(currentToken),
        getDisasterFrameworkCommunication(currentToken),
        getDisasterFrameworkTasks(currentToken, "ASSIGNED"),
      ]);

      setDashboard({
        activeIncidents: dashboardData?.activeIncidents ?? 0,
        responders: dashboardData?.responders ?? 0,
        sector: dashboardData?.sector || "Unknown",
      });
      const dash = dashboardData as Record<string, unknown>;
      const embedded = [
        ...extractResponseArray<DisasterIncidentOption>(dash.incidents),
        ...extractResponseArray<DisasterIncidentOption>(dash.openIncidents),
        ...extractResponseArray<DisasterIncidentOption>(dash.recentIncidents),
      ];
      if (embedded.length) setIncidents((prev) => mergeIncidents(prev, embedded));

      await loadIncidentsList(currentToken);

      setCommunication(extractResponseArray<DisasterCommunicationMessage>(commsData));
      setTasks(extractResponseArray<DisasterTask>(tasksData));

      const idToUse = selectedIncidentId || incidentId;
      if (idToUse) {
        const timelineData = await getDisasterFrameworkTimeline(currentToken, idToUse);
        setTimeline(extractResponseArray<DisasterTimelineEvent>(timelineData));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load disaster framework data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadFrameworkData(token);
  }, [token]);

  useEffect(() => {
    if (token && tab === "timeline") loadIncidentsList(token);
  }, [token, tab, loadIncidentsList]);

  const handleCreateIncident = async () => {
    if (!newIncidentTitle.trim()) {
      Alert.alert("Validation", "Incident title is required.");
      return;
    }
    const titleSnapshot = newIncidentTitle.trim();
    try {
      const response = await postDisasterFrameworkIncident(token, {
        title: titleSnapshot,
        location: newIncidentLocation.trim() || undefined,
      });
      const createdIncidentId = response?.id || response?.incidentId;
      if (createdIncidentId) {
        const id = String(createdIncidentId);
        setIncidentId(id);
        setIncidents((prev) => mergeIncidents(prev, [{ id, title: titleSnapshot }]));
      }
      setNewIncidentTitle("");
      setNewIncidentLocation("");
      await loadFrameworkData(token, createdIncidentId ? String(createdIncidentId) : undefined);
      Alert.alert("Success", "Incident created.");
    } catch (error) {
      Alert.alert("Error", "Unable to create incident.");
    }
  };

  const handleSendCommunication = async () => {
    if (!newCommunicationMessage.trim()) return;
    try {
      await postDisasterFrameworkCommunication(token, {
        message: newCommunicationMessage.trim(),
        channel: "SECURE CHANNEL",
      });
      setNewCommunicationMessage("");
      const commsData = await getDisasterFrameworkCommunication(token);
      setCommunication(extractResponseArray<DisasterCommunicationMessage>(commsData));
    } catch (error) {
      Alert.alert("Error", "Unable to send communication update.");
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim() || !newTaskAssignee.trim()) {
      Alert.alert("Validation", "Task title and assignee are required.");
      return;
    }
    try {
      await postDisasterFrameworkTask(token, {
        title: newTaskTitle.trim(),
        assignee: newTaskAssignee.trim(),
        priority: "HIGH",
        status: "ASSIGNED",
      });
      setNewTaskTitle("");
      setNewTaskAssignee("");
      const tasksData = await getDisasterFrameworkTasks(token, "ASSIGNED");
      setTasks(extractResponseArray<DisasterTask>(tasksData));
    } catch (error) {
      Alert.alert("Error", "Unable to create task.");
    }
  };

  const handleTaskStatusUpdate = async (taskId: string) => {
    try {
      await patchDisasterFrameworkTaskStatus(token, taskId, "COMPLETED");
      const tasksData = await getDisasterFrameworkTasks(token, "ASSIGNED");
      setTasks(extractResponseArray<DisasterTask>(tasksData));
    } catch (error) {
      Alert.alert("Error", "Unable to update task status.");
    }
  };

  const handleTimelineEventSubmit = async () => {
    if (!incidentId.trim() || !newTimelineDescription.trim()) {
      Alert.alert("Validation", "Select an incident and enter a timeline description.");
      return;
    }
    try {
      await postDisasterFrameworkTimeline(token, {
        incidentId: incidentId.trim(),
        description: newTimelineDescription.trim(),
      });
      setNewTimelineDescription("");
      const timelineData = await getDisasterFrameworkTimeline(token, incidentId.trim());
      setTimeline(extractResponseArray<DisasterTimelineEvent>(timelineData));
    } catch (error) {
      Alert.alert("Error", "Unable to create timeline event.");
    }
  };

  const Dashboard = () => (
    <View>
      <View style={styles.statGrid}>
        <View style={styles.miniCard}>
          <Text style={{fontSize: 10, fontWeight: '800', color: '#666'}}>ACTIVE INCIDENTS</Text>
          <Text style={{fontSize: 24, fontWeight: '900', color: '#991b1b'}}>
            {String(dashboard.activeIncidents).padStart(2, "0")}
          </Text>
        </View>
        <View style={styles.miniCard}>
          <Text style={{fontSize: 10, fontWeight: '800', color: '#666'}}>RESPONDERS</Text>
          <Text style={{fontSize: 24, fontWeight: '900', color: '#1f3d18'}}>{dashboard.responders}</Text>
        </View>
      </View>
      <View style={[styles.miniCard, {width: '100%', height: 150, justifyContent: 'center', alignItems: 'center'}]}>
        <Ionicons name="map" size={40} color="#DDD" />
        <Text style={{color: '#999', fontWeight: '700'}}>
          Crises Layer Map Active - {dashboard.sector || "Unknown Sector"}
        </Text>
      </View>
      <View style={styles.miniCard}>
        <Text style={styles.sectionTitle}>Create Incident</Text>
        <TextInput
          value={newIncidentTitle}
          onChangeText={setNewIncidentTitle}
          placeholder="Incident title"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />
        <TextInput
          value={newIncidentLocation}
          onChangeText={setNewIncidentLocation}
          placeholder="Location (optional)"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />
        <TouchableOpacity style={styles.actionBtn} onPress={handleCreateIncident}>
          <Text style={styles.actionBtnText}>CREATE INCIDENT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const CommConsole = () => (
    <View>
      <Text style={{fontSize: 12, fontWeight: '900', marginBottom: 10}}>LIVE COMMS FEED</Text>
      <TextInput
        value={newCommunicationMessage}
        onChangeText={setNewCommunicationMessage}
        placeholder="Broadcast a communication update..."
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />
      <TouchableOpacity style={[styles.actionBtn, { marginBottom: 12 }]} onPress={handleSendCommunication}>
        <Text style={styles.actionBtnText}>SEND UPDATE</Text>
      </TouchableOpacity>
      {communication.length === 0 && <Text style={styles.emptyText}>No communication messages available.</Text>}
      {communication.map((item, i) => (
        <View key={item.id || `${i}`} style={styles.msgBox}>
          <Text style={{fontSize: 13, color: '#333'}}>{item.message}</Text>
          <Text style={{fontSize: 10, color: '#999', marginTop: 5}}>
            {(item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : "N/A")} • {item.channel || "SECURE CHANNEL"}
          </Text>
        </View>
      ))}
    </View>
  );

  const TaskAssignment = () => (
    <View>
      <TextInput
        value={newTaskTitle}
        onChangeText={setNewTaskTitle}
        placeholder="Task title"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />
      <TextInput
        value={newTaskAssignee}
        onChangeText={setNewTaskAssignee}
        placeholder="Assigned to"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />
      <TouchableOpacity style={[styles.actionBtn, { marginBottom: 12 }]} onPress={handleCreateTask}>
        <Text style={styles.actionBtnText}>CREATE TASK</Text>
      </TouchableOpacity>
      {tasks.length === 0 && <Text style={styles.emptyText}>No assigned tasks found.</Text>}
      {tasks.map((task, i) => (
        <View key={task.id || `${i}`} style={styles.taskCard}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={{fontWeight: '800'}}>{task.title || "Untitled Task"}</Text>
            <Text style={{fontSize: 12, color: '#666'}}>
              Assigned to: {task.assignee || "Unassigned"} • {task.status || "ASSIGNED"}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <View style={[styles.priorityTag, {backgroundColor: task.priority === "CRITICAL" ? "#FEE2E2" : "#DBEAFE"}]}>
              <Text style={{color: task.priority === "CRITICAL" ? '#991B1B' : "#1D4ED8", fontSize: 10, fontWeight: '900'}}>
                {task.priority || "HIGH"}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.actionBtn, { marginTop: 8, paddingVertical: 6, paddingHorizontal: 8 }]}
              onPress={() => handleTaskStatusUpdate(task.id)}
            >
              <Text style={[styles.actionBtnText, { fontSize: 9 }]}>MARK COMPLETE</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const IncidentTimeline = () => (
    <View style={{paddingLeft: 10, paddingRight: 10}}>
      <Text style={styles.fieldLabel}>INCIDENT</Text>
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={() => setIncidentPickerVisible(true)}
        activeOpacity={0.75}
      >
        <Text style={styles.dropdownTriggerText} numberOfLines={2}>
          {incidentSelectLabel}
        </Text>
        <Ionicons name="chevron-down" size={22} color="#152b11" />
      </TouchableOpacity>

      <Modal
        visible={incidentPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIncidentPickerVisible(false)}
      >
        <View style={styles.pickerModalRoot}>
          <Pressable style={styles.pickerModalBackdrop} onPress={() => setIncidentPickerVisible(false)} />
          <View style={styles.pickerSheet}>
            <View style={styles.pickerSheetHeader}>
              <Text style={styles.pickerSheetTitle}>Select incident</Text>
              <TouchableOpacity onPress={() => setIncidentPickerVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={26} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={styles.pickerRow}
                onPress={() => {
                  setIncidentId("");
                  setIncidentPickerVisible(false);
                }}
              >
                <Text style={styles.pickerRowTitle}>None selected</Text>
                <Text style={styles.pickerRowMeta}>Clear incident for this session</Text>
              </TouchableOpacity>
              {incidents.length === 0 ? (
                <Text style={[styles.emptyText, { paddingHorizontal: 16, paddingVertical: 14 }]}>
                  No incidents loaded. Create one on the Dashboard tab, or ensure GET /disaster-framework/incidents is available.
                </Text>
              ) : (
                incidents.map((inc, idx) => {
                  const id = String(inc.id ?? "");
                  if (!id) return null;
                  const title = inc.title ?? inc.name ?? `Incident ${id.slice(0, 8)}…`;
                  return (
                    <TouchableOpacity
                      key={`${id}-${idx}`}
                      style={styles.pickerRow}
                      onPress={() => {
                        setIncidentId(id);
                        setIncidentPickerVisible(false);
                      }}
                    >
                      <Text style={styles.pickerRowTitle}>{title}</Text>
                      <Text style={styles.pickerRowMeta}>ID: {id}</Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <TextInput
        value={newTimelineDescription}
        onChangeText={setNewTimelineDescription}
        placeholder="Timeline event description"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.actionBtn, { flex: 1, marginRight: 8 }]}
          onPress={async () => {
            if (!incidentId.trim()) return Alert.alert("Validation", "Please select an incident.");
            try {
              const timelineData = await getDisasterFrameworkTimeline(token, incidentId.trim());
              setTimeline(extractResponseArray<DisasterTimelineEvent>(timelineData));
            } catch (error) {
              Alert.alert("Error", "Unable to fetch timeline.");
            }
          }}
        >
          <Text style={styles.actionBtnText}>FETCH TIMELINE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { flex: 1 }]} onPress={handleTimelineEventSubmit}>
          <Text style={styles.actionBtnText}>ADD EVENT</Text>
        </TouchableOpacity>
      </View>
      {timeline.length === 0 && <Text style={[styles.emptyText, { marginTop: 12 }]}>No timeline events found.</Text>}
      {timeline.map((item, i) => (
        <View key={item.id || `${i}`} style={styles.timelinePoint}>
          <View style={styles.timeLineLeft}>
            <View style={styles.dot} />
            <View style={styles.line} />
          </View>
          <View style={{paddingBottom: 20}}>
            <Text style={{fontWeight: '900', fontSize: 12}}>
              {item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : "N/A"}
            </Text>
            <Text style={{color: '#444'}}>{item.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={20} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>RESPONSE FRAMEWORK</Text>
          <Ionicons name="radio-outline" size={24} color="#FFF" />
        </View>
        <View style={styles.liveBadge}>
          <View style={{width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF', marginRight: 5}} />
          <Text style={styles.liveText}>SYSTEM LIVE: SECTOR {dashboard.sector || "UNKNOWN"}</Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.headerTabs}>
          {(["dashboard", "communication", "tasks", "timeline"] as DisasterTabKey[]).map((t) => (
            <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tabBtn, tab === t && styles.tabBtnActive]}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#152b11" style={{ marginTop: 40 }} />
        ) : (
          <>
            {tab === "dashboard" && <Dashboard />}
            {tab === "communication" && <CommConsole />}
            {tab === "tasks" && <TaskAssignment />}
            {tab === "timeline" && <IncidentTimeline />}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default DisasterResponseFramework;