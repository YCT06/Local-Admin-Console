export type ContainerStatus = 'running' | 'restarting' | 'stopped';

export interface Container {
  name: string;
  image: string;
  status: ContainerStatus;
  uptime: string;
  cpu: number;
  mem: number;
  port: string;
}

export interface NetworkAdapter {
  name: string;
  display: string;
  mac: string;
  primary: boolean;
  connected: boolean;
  mode: 'static' | 'dhcp';
  ip: string;
  netmask: string;
  gateway: string;
  dns: string[];
}

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
