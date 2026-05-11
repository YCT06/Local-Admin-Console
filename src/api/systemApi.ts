import type { Container, NetworkAdapter, TrendData, ActiveSession } from '../types/system';
import type { AuditEvent } from '../types/audit';
import { MOCK_CONTAINERS, MOCK_NETWORK_ADAPTERS, MOCK_TRENDS, MOCK_SESSIONS, MOCK_AUDIT_EVENTS } from './mock';

export async function getContainers(): Promise<Container[]> {
  // TODO: return client.get('/system/containers').then(r => r.data)
  return Promise.resolve([...MOCK_CONTAINERS]);
}

export async function getNetworkAdapters(): Promise<NetworkAdapter[]> {
  // TODO: return client.get('/system/network').then(r => r.data)
  return Promise.resolve([...MOCK_NETWORK_ADAPTERS]);
}

export async function getTrends(): Promise<TrendData> {
  // TODO: return client.get('/system/trends').then(r => r.data)
  return Promise.resolve({ ...MOCK_TRENDS });
}

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
