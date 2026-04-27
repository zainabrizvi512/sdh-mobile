const ARRAY_KEYS = [
  "items",
  "data",
  "results",
  "campaigns",
  "donationCampaigns",
  "contacts",
  "messages",
  "stories",
  "content",
  "records",
  "rows",
  "list",
  "values",
  "elements",
  "payload",
  "body",
  "response",
  "result",
  "entities",
  "nodes",
  "tasks",
  "timeline",
  "events",
  "incidents",
  "activities",
  "history",
  "opportunities",
  "communications",
  "communication",
  "feed",
] as const;

/** Walk nested objects: at each level, prefer a known list key; then recurse into plain objects. */
function walkForArray(obj: unknown, maxDepth: number): unknown[] | null {
  if (obj == null || maxDepth < 0) return null;
  if (Array.isArray(obj)) return obj;
  if (typeof obj !== "object") return null;

  const record = obj as Record<string, unknown>;
  for (const key of ARRAY_KEYS) {
    const v = record[key];
    if (Array.isArray(v)) return v;
  }
  for (const v of Object.values(record)) {
    if (v != null && typeof v === "object" && !Array.isArray(v)) {
      const found = walkForArray(v, maxDepth - 1);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Normalizes common API list shapes (top-level array, { items }, { data: [] }, { data: { items } }, { campaigns }, etc.)
 */
export function extractResponseArray<T>(payload: unknown): T[] {
  if (payload == null) return [];
  if (Array.isArray(payload)) return payload as T[];

  if (typeof payload !== "object") return [];

  const root = payload as Record<string, unknown>;

  for (const key of ARRAY_KEYS) {
    const v = root[key];
    if (Array.isArray(v)) return v as T[];
  }

  for (const key of ARRAY_KEYS) {
    const nested = root[key];
    if (nested == null || typeof nested !== "object" || Array.isArray(nested)) continue;
    const obj = nested as Record<string, unknown>;
    for (const key2 of ARRAY_KEYS) {
      const inner = obj[key2];
      if (Array.isArray(inner)) return inner as T[];
    }
  }

  const walked = walkForArray(payload, 6);
  return (walked ?? []) as T[];
}
