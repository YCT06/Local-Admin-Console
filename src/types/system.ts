// ── 後端實際回傳的容器結構 ─────────────────────────────
export interface ContainerResources {
  cpuPercent: number;
  memoryUsageMB: number;
  memoryLimitMB: number;
  memoryPercent: number;
}

export interface DockerContainer {
  name: string;
  status: string;
  uptime: string;
  health: string | null;
  resources: ContainerResources | null;
}

export interface SystemMetricHistoryPoint {
  timestamp: string;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
}

export interface SystemMetrics {
  timestamp: string;
  cpu: { usagePercent: number; coreCount: number };
  memory: { totalGB: number; usedGB: number; usagePercent: number };
  disks: {
    mount: string;
    totalGB: number;
    usedGB: number;
    usagePercent: number;
  }[];
  gpu: {
    model: string;
    memoryTotalMB: number;
    memoryUsedMB: number;
    usagePercent: number;
  } | null;
  uptime: string;
  network: { bytesIn: number; bytesOut: number; status: string };
  docker: { containers: DockerContainer[] };
  history?: { points: SystemMetricHistoryPoint[] };
}

// ── 後端實際回傳的網路結構 ─────────────────────────────
export type NetworkConnectionMode = "dhcp" | "static";

export interface NetworkAdapterConfig {
  interfaceName: string;
  displayName: string;
  macAddress: string;
  isPrimary: boolean;
  isConnected: boolean;
  connectionMode: NetworkConnectionMode;
  ipAddress: string | null;
  subnetMask: string | null;
  gateway: string | null;
  dnsServers: string[];
}

export interface NetworkConfiguration {
  lastUpdatedUtc: string;
  adapters: NetworkAdapterConfig[];
}

export interface NetworkConfigurationUpdateRequest {
  interfaceName: string;
  connectionMode: NetworkConnectionMode;
  ipAddress: string | null;
  subnetMask: string | null;
  gateway: string | null;
  dnsServers: string[];
}

// ── Mock 頁面保留使用（後端尚未實作）─────────────────
export interface TrendData {
  cpu: number[];
  memory: number[];
  gpu: number[];
}

export interface ActiveSession {
  id: string;
  user: string;
  displayName: string;
  ip: string;
  device: string;
  loginAt: string;
  lastActivity: string;
  mfa: boolean;
  current: boolean;
}
