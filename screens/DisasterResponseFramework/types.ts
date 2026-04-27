import { NativeStackScreenProps } from "@react-navigation/native-stack";

// Tab keys for the Framework
export type DisasterTabKey = "dashboard" | "communication" | "tasks" | "timeline";

// Standardizing the Task Interface
export interface DisasterTask {
  id: string;
  title: string;
  priority?: "CRITICAL" | "HIGH" | "NORMAL" | string;
  assignee?: string;
  status?: string;
}

export interface DisasterDashboardData {
  activeIncidents: number;
  responders: number;
  sector?: string;
}

export interface DisasterCommunicationMessage {
  id: string;
  message: string;
  channel?: string;
  createdAt?: string;
  sender?: string;
}

export interface DisasterTimelineEvent {
  id: string;
  description: string;
  incidentId?: string;
  createdAt?: string;
}

/** Options for timeline incident selector (from GET /incidents, dashboard, or create flow). */
export type DisasterIncidentOption = {
  id: string;
  title?: string;
  name?: string;
};

// FIX: Using 'any' instead of 'DashboardStackParamList' 
// to bypass the "DisasterResponseFramework not found" error.
export type T_DISASTERRESPONSE = NativeStackScreenProps<any, "DisasterResponseFramework">;