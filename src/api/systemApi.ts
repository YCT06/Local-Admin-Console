import client from "./client";
import type { SystemMetrics } from "../types/system";
import type { ActiveSession } from "../types/system";
import type { AuditEvent } from "../types/audit";
import { MOCK_SESSIONS, MOCK_AUDIT_EVENTS } from "./mock";

// \u2500\u2500 \u5f8c\u7aef\u5df2\u5be6\u4f5c \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

export async function getMetrics(): Promise<SystemMetrics> {
  const { data } = await client.get<SystemMetrics>("/system/metrics");
  return data;
}

// \u2500\u2500 \u5f8c\u7aef\u5c1a\u672a\u5be6\u4f5c\uff0c\u4fdd\u7559 mock \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

export async function getSessions(): Promise<ActiveSession[]> {
  // TODO: return client.get('/sessions').then(r => r.data)
  return Promise.resolve([...MOCK_SESSIONS]);
}

export async function revokeSession(_id: string): Promise<void> {
  // TODO: return client.delete(`/sessions/${_id}`).then(() => {})
  return Promise.resolve();
}

export async function getAuditLog(): Promise<AuditEvent[]> {
  // TODO: return client.get('/audit').then(r => r.data)
  return Promise.resolve([...MOCK_AUDIT_EVENTS]);
}

export async function restartContainer(_name: string): Promise<void> {
  // TODO: return client.post(`/system/containers/${_name}/restart`).then(() => {})
  return Promise.resolve();
}
