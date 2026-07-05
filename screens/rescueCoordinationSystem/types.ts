export type TabKey = "requests" | "allocation" | "tracking" | "feedback" | "analytics";

export interface ResourceRequest {
  id: string;
  type: string;
  quantity: string;
  status: "Pending" | "Allocated" | "Delivered";
  ngo?: string;
}

export interface T_RescueCoordinationSystem {
  navigation?: any;
}