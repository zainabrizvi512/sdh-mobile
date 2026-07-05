import { DashboardStackParamList } from "@/navigation/dashboardStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// Tab keys for the Framework
export type DisasterTabKey = "dashboard" | "communication" | "tasks" | "timeline";

// Standardizing the Task Interface
export interface DisasterTask {
  id: string;
  title: string;
  details?: string | null;
  priority?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | string;
  assignedTeam?: string | null;
  assignedTo?: { id: string; name: string } | null;
  incident?: { id: string; title: string; sector: string } | null;
  status?: string;
}

export type DisasterMapLayer = {
  incidentId: string;
  title: string;
  severity: string;
  status: string;
  sector: string;
  latitude: number | null;
  longitude: number | null;
};

export interface DisasterDashboardData {
  activeIncidents: number;
  responders: number;
  criticalTasks: number;
  sector?: string;
  mapLayers: DisasterMapLayer[];
}

export interface DisasterCommunicationMessage {
  id: string;
  message: string;
  channel?: string;
  timestamp?: string;
  sender?: string;
}

export interface DisasterTimelineEvent {
  id: string;
  title: string;
  incidentId?: string;
  time?: string;
  report?: string | null;
}

/** Options for timeline incident selector (from GET /incidents, dashboard, or create flow). */
export type DisasterIncidentOption = {
  id: string;
  title?: string;
  name?: string;
};

export type T_DISASTERRESPONSE = NativeStackScreenProps<DashboardStackParamList, "DisasterResponseFramework">;