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
import { extractResponseArray } from "@/utils/extractResponseArray";
import FancyAppHeader from "@/components/fancyAppHeader";
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
    criticalTasks: 0,
    sector: "Unknown",
    mapLayers: [],
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
  const [newTaskPriority, setNewTaskPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("HIGH");
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

      const metrics = (dashboardData as any)?.metrics ?? {};
      const map = (dashboardData as any)?.map ?? {};
      setDashboard({
        activeIncidents: metrics.activeIncidents ?? 0,
        responders: metrics.responders ?? 0,
        criticalTasks: metrics.criticalTasks ?? 0,
        sector: dashboardData?.sector || "Unknown",
        mapLayers: Array.isArray(map.layers) ? map.layers : [],
      });

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
        sector: newIncidentLocation.trim() || undefined,
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
        assignedTeam: newTaskAssignee.trim(),
        priority: newTaskPriority,
      });
      setNewTaskTitle("");
      setNewTaskAssignee("");
      setNewTaskPriority("HIGH");
      const tasksData = await getDisasterFrameworkTasks(token, "ASSIGNED");
      setTasks(extractResponseArray<DisasterTask>(tasksData));
    } catch (error) {
      Alert.alert("Error", "Unable to create task.");
    }
  };

  const handleTaskStatusUpdate = async (taskId: string) => {
    try {
      await patchDisasterFrameworkTaskStatus(token, taskId, "DONE");
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
        title: newTimelineDescription.trim(),
        incidentId: incidentId.trim(),
        report: newTimelineDescription.trim(),
      });
      setNewTimelineDescription("");
      const timelineData = await getDisasterFrameworkTimeline(token, incidentId.trim());
      setTimeline(extractResponseArray<DisasterTimelineEvent>(timelineData));
    } catch (error) {
      Alert.alert("Error", "Unable to create timeline event.");
    }
  };

  const severityColor = (severity?: string) => {
    if (severity === "CRITICAL") return "#991B1B";
    if (severity === "HIGH") return "#C2410C";
    if (severity === "MEDIUM") return "#B45309";
    return "#1D4ED8";
  };

  const Dashboard = () => (
    <View>
      <Text style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
        Live snapshot of active incidents, responders, and critical tasks across your sector.
      </Text>
      <View style={styles.statGrid}>
        <View style={styles.miniCard}>
          <Text style={{fontSize: 10, fontWeight: '800', color: '#666'}}>ACTIVE INCIDENTS</Text>
          <Text style={{fontSize: 24, fontWeight: '900', color: '#991b1b'}}>
            {String(dashboard.activeIncidents).padStart(2, "0")}
          </Text>
        </View>
        <View style={styles.miniCard}>
          <Text style={{fontSize: 10, fontWeight: '800', color: '#666'}}>RESPONDERS</Text>
          <Text style={{fontSize: 24, fontWeight: '900', color: '#0f4c3a'}}>{dashboard.responders}</Text>
        </View>
        <View style={styles.miniCard}>
          <Text style={{fontSize: 10, fontWeight: '800', color: '#666'}}>CRITICAL TASKS</Text>
          <Text style={{fontSize: 24, fontWeight: '900', color: '#C2410C'}}>{dashboard.criticalTasks}</Text>
        </View>
      </View>

      <View style={styles.miniCard}>
        <Text style={styles.sectionTitle}>Recent Incidents ({dashboard.sector || "Unknown Sector"})</Text>
        {dashboard.mapLayers.length === 0 ? (
          <Text style={styles.emptyText}>No incidents reported yet. Create one below.</Text>
        ) : (
          dashboard.mapLayers.map((layer) => (
            <View key={layer.incidentId} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}>
              <View style={[styles.priorityTag, { backgroundColor: severityColor(layer.severity) + "22", marginRight: 10 }]}>
                <Text style={{ color: severityColor(layer.severity), fontSize: 10, fontWeight: "900" }}>
                  {layer.severity}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700" }}>{layer.title}</Text>
                <Text style={{ fontSize: 11, color: "#999" }}>{layer.sector} • {layer.status}</Text>
              </View>
            </View>
          ))
        )}
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
          placeholder="Sector / location (optional)"
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
      <Text style={{fontSize: 12, fontWeight: '900', marginBottom: 4}}>LIVE COMMS FEED</Text>
      <Text style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
        Broadcasts go out to every responder in your sector.
      </Text>
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
            {item.sender || "Responder"} • {(item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : "N/A")} • {item.channel || "SECURE CHANNEL"}
          </Text>
        </View>
      ))}
    </View>
  );

  const TaskAssignment = () => (
    <View>
      <Text style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
        Assign response tasks to a team and track them through to completion.
      </Text>
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
        placeholder="Assigned team (e.g. Sector F7 Rescue)"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />
      <Text style={styles.fieldLabel}>PRIORITY</Text>
      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((p) => (
          <TouchableOpacity
            key={p}
            onPress={() => setNewTaskPriority(p)}
            style={[
              styles.priorityTag,
              {
                marginRight: 8,
                backgroundColor: newTaskPriority === p ? severityColor(p) : "#EEE",
              },
            ]}
          >
            <Text style={{ color: newTaskPriority === p ? "#FFF" : "#666", fontSize: 10, fontWeight: "900" }}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={[styles.actionBtn, { marginBottom: 12 }]} onPress={handleCreateTask}>
        <Text style={styles.actionBtnText}>CREATE TASK</Text>
      </TouchableOpacity>
      {tasks.length === 0 && <Text style={styles.emptyText}>No assigned tasks found.</Text>}
      {tasks.map((task, i) => (
        <View key={task.id || `${i}`} style={styles.taskCard}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={{fontWeight: '800'}}>{task.title || "Untitled Task"}</Text>
            {!!task.details && (
              <Text style={{ fontSize: 12, color: "#777", marginTop: 2 }} numberOfLines={2}>
                {task.details}
              </Text>
            )}
            <Text style={{fontSize: 12, color: '#666', marginTop: 2}}>
              Assigned to: {task.assignedTeam ?? task.assignedTo?.name ?? "Unassigned"} • {task.status || "ASSIGNED"}
            </Text>
            {!!task.incident && (
              <Text style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
                Linked incident: {task.incident.title}
              </Text>
            )}
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <View style={[styles.priorityTag, {backgroundColor: severityColor(task.priority) + "22"}]}>
              <Text style={{color: severityColor(task.priority), fontSize: 10, fontWeight: '900'}}>
                {task.priority || "HIGH"}
              </Text>
            </View>
            {task.status !== "DONE" && (
              <TouchableOpacity
                style={[styles.actionBtn, { marginTop: 8, paddingVertical: 6, paddingHorizontal: 8 }]}
                onPress={() => handleTaskStatusUpdate(task.id)}
              >
                <Text style={[styles.actionBtnText, { fontSize: 9 }]}>MARK COMPLETE</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const IncidentTimeline = () => (
    <View style={{paddingLeft: 10, paddingRight: 10}}>
      <Text style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
        Timeline shows chronological updates for one incident. Select an incident below, then
        review or add updates as the situation develops.
      </Text>
      <Text style={styles.fieldLabel}>INCIDENT</Text>
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={() => setIncidentPickerVisible(true)}
        activeOpacity={0.75}
      >
        <Text style={styles.dropdownTriggerText} numberOfLines={2}>
          {incidentSelectLabel}
        </Text>
        <Ionicons name="chevron-down" size={22} color="#0f4c3a" />
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
                  No incidents yet. Create one on the Dashboard tab first.
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
              {item.time ? new Date(item.time).toLocaleTimeString() : "N/A"}
            </Text>
            <Text style={{color: '#444', fontWeight: "700"}}>{item.title}</Text>
            {!!item.report && <Text style={{color: '#777', fontSize: 12, marginTop: 2}}>{item.report}</Text>}
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#0f4c3a" />
      <FancyAppHeader
        title="Response Framework"
        subtitle="Multi-layer disaster command & coordination"
        badge={{ icon: "radio", label: `SYSTEM LIVE · SECTOR ${dashboard.sector || "UNKNOWN"}` }}
        rightIcon="radio-outline"
        onBack={() => navigation.goBack()}
        tabs={[
          { id: "dashboard", label: "DASHBOARD" },
          { id: "communication", label: "COMMS" },
          { id: "tasks", label: "TASKS" },
          { id: "timeline", label: "TIMELINE" },
        ]}
        activeTab={tab}
        onTabChange={(id) => setTab(id as DisasterTabKey)}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0f4c3a" style={{ marginTop: 40 }} />
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