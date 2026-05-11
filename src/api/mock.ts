import type { User } from '../types/user';
import type { Role, PermissionGroup } from '../types/role';
import type { Container, NetworkAdapter, TrendData, ActiveSession } from '../types/system';
import type { AuditEvent } from '../types/audit';

function makeTrend(base: number, variance: number): number[] {
  const points: number[] = [];
  let v = base;
  for (let i = 0; i < 30; i++) {
    v = Math.max(2, Math.min(100, v + (Math.random() - 0.5) * variance));
    points.push(+v.toFixed(1));
  }
  return points;
}

export const MOCK_USERS: User[] = [
  { id: 1, username: 'admin',        displayName: '系統管理員',   email: 'admin@local.lan',       authType: 'local', isActive: true,  roles: ['超級管理員'],         locale: 'zh-TW', lastLogin: '今天 09:42' },
  { id: 2, username: 'lin.weiting',  displayName: '林威廷',       email: 'lin.weiting@corp.tw',   authType: 'ldap',  isActive: true,  roles: ['營運主管', '審核員'], locale: 'zh-TW', lastLogin: '今天 08:15' },
  { id: 3, username: 'chen.peihua',  displayName: '陳佩樺',       email: 'chen.peihua@corp.tw',   authType: 'ldap',  isActive: true,  roles: ['審核員'],             locale: 'zh-TW', lastLogin: '昨天 17:30' },
  { id: 4, username: 'wang.yuhsuan', displayName: '王宇軒',       email: 'wang.yuhsuan@corp.tw',  authType: 'ldap',  isActive: true,  roles: ['一般使用者'],         locale: 'zh-TW', lastLogin: '昨天 14:08' },
  { id: 5, username: 'svc-monitor',  displayName: '監控服務帳號', email: '',                       authType: 'local', isActive: true,  roles: ['唯讀稽核'],           locale: 'en-US', lastLogin: '5 分鐘前' },
  { id: 6, username: 'huang.shuyi',  displayName: '黃淑儀',       email: 'huang.shuyi@corp.tw',   authType: 'ldap',  isActive: false, roles: ['一般使用者'],         locale: 'zh-TW', lastLogin: '2026/04/12' },
  { id: 7, username: 'guest-demo',   displayName: '示範訪客',     email: '',                       authType: 'local', isActive: true,  roles: ['訪客'],               locale: 'zh-TW', lastLogin: '2026/03/28' },
];

export const MOCK_ROLES: Role[] = [
  { id: 'admin',    name: '超級管理員', members: 1, description: '擁有所有模組與系統設定的完整權限。',       system: true  },
  { id: 'ops-lead', name: '營運主管',   members: 1, description: '可管理使用者、檢視系統狀態與部署套件。',   system: false },
  { id: 'reviewer', name: '審核員',     members: 2, description: '可審核工單與檢視營運報表。',               system: false },
  { id: 'auditor',  name: '唯讀稽核',   members: 1, description: '所有頁面僅讀取，不可寫入。',               system: false },
  { id: 'user',     name: '一般使用者', members: 2, description: '可使用已訂閱模組的標準功能。',             system: false },
  { id: 'guest',    name: '訪客',       members: 1, description: '僅可瀏覽公開頁面與儀表板摘要。',           system: false },
];

export const PERMISSION_GROUPS: PermissionGroup[] = [
  { group: '主控台',   perms: [{ key: 'dashboard.view', label: '檢視營運中樞' }] },
  { group: '身分治理', perms: [
    { key: 'users.view',   label: '檢視使用者' },
    { key: 'users.manage', label: '建立/修改/停用使用者' },
    { key: 'roles.manage', label: '管理角色與權限' },
    { key: 'password.reset', label: '重設他人密碼' },
  ]},
  { group: '系統營運', perms: [
    { key: 'system.status',  label: '檢視系統狀態' },
    { key: 'system.network', label: '修改網路設定' },
    { key: 'system.service', label: '上傳服務套件' },
    { key: 'system.docker',  label: '控制 Docker 容器' },
  ]},
  { group: '稽核紀錄', perms: [
    { key: 'audit.view',   label: '檢視操作稽核' },
    { key: 'audit.export', label: '匯出稽核紀錄' },
  ]},
];

export const MOCK_ROLE_PERMS: Record<string, string[]> = {
  'admin':    ['dashboard.view','users.view','users.manage','roles.manage','password.reset','system.status','system.network','system.service','system.docker','audit.view','audit.export'],
  'ops-lead': ['dashboard.view','users.view','users.manage','system.status','system.network','system.service','system.docker','audit.view','audit.export'],
  'reviewer': ['dashboard.view','users.view','system.status','audit.view'],
  'auditor':  ['dashboard.view','users.view','system.status','audit.view','audit.export'],
  'user':     ['dashboard.view'],
  'guest':    ['dashboard.view'],
};

export const MOCK_CONTAINERS: Container[] = [
  { name: 'office-ai-gateway',  image: 'officeai/gateway:2.4.1',   status: 'running',    uptime: '14 天',  cpu: 4.2,  mem: 318,  port: '0.0.0.0:8080' },
  { name: 'office-ai-api',      image: 'officeai/api:2.4.1',       status: 'running',    uptime: '14 天',  cpu: 12.8, mem: 642,  port: '127.0.0.1:9001' },
  { name: 'office-ai-worker',   image: 'officeai/worker:2.4.1',    status: 'running',    uptime: '14 天',  cpu: 28.4, mem: 1120, port: '—' },
  { name: 'ocr-engine',         image: 'paddleocr/server:3.0',     status: 'running',    uptime: '6 天',   cpu: 56.1, mem: 2840, port: '—' },
  { name: 'postgres-primary',   image: 'postgres:16.2-alpine',     status: 'running',    uptime: '32 天',  cpu: 3.6,  mem: 512,  port: '127.0.0.1:5432' },
  { name: 'redis-cache',        image: 'redis:7.2-alpine',         status: 'running',    uptime: '32 天',  cpu: 0.8,  mem: 84,   port: '127.0.0.1:6379' },
  { name: 'minio-storage',      image: 'minio/minio:RELEASE.2025', status: 'running',    uptime: '32 天',  cpu: 1.2,  mem: 196,  port: '0.0.0.0:9000' },
  { name: 'package-scanner',    image: 'officeai/scanner:1.8.3',   status: 'restarting', uptime: '2 分鐘', cpu: 0,    mem: 0,    port: '—' },
];

export const MOCK_NETWORK_ADAPTERS: NetworkAdapter[] = [
  { name: 'eno1',   display: '主要 LAN 介面', mac: 'A8:A1:59:3C:7F:21', primary: true,  connected: true,  mode: 'static', ip: '192.168.10.32',  netmask: '255.255.255.0', gateway: '192.168.10.1',  dns: ['192.168.10.1', '8.8.8.8'] },
  { name: 'eno2',   display: '備援 LAN 介面', mac: 'A8:A1:59:3C:7F:22', primary: false, connected: true,  mode: 'dhcp',   ip: '192.168.20.146', netmask: '255.255.255.0', gateway: '192.168.20.1',  dns: ['192.168.20.1'] },
  { name: 'wlp3s0', display: '無線網卡',       mac: '4C:79:6E:91:08:A2', primary: false, connected: false, mode: 'dhcp',   ip: '—',              netmask: '—',             gateway: '—',             dns: [] },
];

export const MOCK_ACTIVITY = [
  { time: '10:42', user: '林威廷', action: '更新', target: '使用者 chen.peihua 的角色',   kind: 'success' as const },
  { time: '10:18', user: 'admin',  action: '上傳', target: '服務套件 officeai-2.4.1.sp', kind: 'success' as const },
  { time: '09:53', user: 'system', action: '重啟', target: '容器 package-scanner',        kind: 'warning' as const },
  { time: '09:42', user: 'admin',  action: '登入', target: '本地驗證',                    kind: 'info' as const },
  { time: '08:15', user: '林威廷', action: '登入', target: 'LDAP 驗證',                   kind: 'info' as const },
  { time: '08:02', user: 'system', action: '備份', target: '資料庫 every-day-02:00',      kind: 'success' as const },
  { time: '昨天',  user: '陳佩樺', action: '檢視', target: '系統狀態頁面',                kind: 'info' as const },
  { time: '昨天',  user: 'admin',  action: '修改', target: '網卡 eno1 改為靜態 IP',       kind: 'warning' as const },
];

export const MOCK_AUDIT_EVENTS: AuditEvent[] = [
  { time: '2025-11-12 14:23:41', actor: 'admin',       actorIp: '10.0.1.12',   category: '身分治理', action: '建立使用者',   target: 'chen.peihua',                  outcome: 'success', detail: '指派角色：審核員' },
  { time: '2025-11-12 11:08:55', actor: 'lin.weiting', actorIp: '10.0.1.42',   category: '身分治理', action: '更新角色權限', target: '營運主管',                     outcome: 'success', detail: '新增 system.docker' },
  { time: '2025-11-12 10:51:02', actor: 'admin',       actorIp: '10.0.1.12',   category: '系統部署', action: '安裝服務套件', target: 'OfficeAI-v2.4.1-20251108.sp',  outcome: 'success', detail: '部署目錄 /opt/officeai/packages' },
  { time: '2025-11-12 09:34:17', actor: 'lin.weiting', actorIp: '10.0.1.42',   category: '網路設定', action: '更新介面 IP',  target: 'eno1',                         outcome: 'success', detail: 'DHCP → 靜態 192.168.10.32' },
  { time: '2025-11-11 22:18:33', actor: 'unknown',     actorIp: '203.0.113.7', category: '身分驗證', action: '登入失敗',     target: 'admin',                        outcome: 'failure', detail: '密碼錯誤（連續 3 次）' },
  { time: '2025-11-11 18:02:09', actor: 'admin',       actorIp: '10.0.1.12',   category: '系統部署', action: '回滾服務套件', target: 'OfficeAI-v2.4.0-rc2.sp',       outcome: 'success', detail: '回到 v2.4.0' },
  { time: '2025-11-11 15:41:28', actor: 'chen.peihua', actorIp: '10.0.1.55',   category: '身分驗證', action: '變更密碼',     target: '自身',                         outcome: 'success', detail: '' },
  { time: '2025-11-11 14:12:50', actor: 'admin',       actorIp: '10.0.1.12',   category: '身分治理', action: '停用使用者',   target: 'wang.guest',                   outcome: 'success', detail: '長期未登入' },
  { time: '2025-11-11 11:09:04', actor: 'system',      actorIp: '127.0.0.1',   category: '系統部署', action: '排程備份',     target: '/var/backups/officeai',        outcome: 'success', detail: '每日 11:00' },
  { time: '2025-11-11 09:22:18', actor: 'lin.weiting', actorIp: '10.0.1.42',   category: '網路設定', action: '修改 DNS',     target: 'eno1',                         outcome: 'success', detail: '加入 8.8.4.4' },
  { time: '2025-11-10 23:55:47', actor: 'system',      actorIp: '127.0.0.1',   category: '系統健康', action: 'CPU 告警',     target: 'office-ai-api',                outcome: 'warning', detail: '5 分鐘平均 87%（閾值 80%）' },
  { time: '2025-11-10 16:08:12', actor: 'admin',       actorIp: '10.0.1.12',   category: '身分治理', action: '建立角色',     target: '稽核員（自訂）',               outcome: 'success', detail: '複製自審核員' },
];

export const MOCK_SESSIONS: ActiveSession[] = [
  { id: 's1', user: 'admin',       displayName: '系統管理員', ip: '10.0.1.12', device: 'Chrome 130 · macOS',     loginAt: '2025-11-12 08:42', lastActivity: '剛剛',      mfa: true,  current: true  },
  { id: 's2', user: 'admin',       displayName: '系統管理員', ip: '10.0.1.12', device: 'Safari · iPhone',         loginAt: '2025-11-12 07:15', lastActivity: '12 分鐘前', mfa: true,  current: false },
  { id: 's3', user: 'lin.weiting', displayName: '林威廷',     ip: '10.0.1.42', device: 'Chrome 130 · Windows',   loginAt: '2025-11-12 09:01', lastActivity: '3 分鐘前',  mfa: true,  current: false },
  { id: 's4', user: 'chen.peihua', displayName: '陳佩樺',     ip: '10.0.1.55', device: 'Firefox 132 · Linux',    loginAt: '2025-11-12 09:34', lastActivity: '剛剛',      mfa: false, current: false },
  { id: 's5', user: 'audit.bot',   displayName: '稽核機器人', ip: '127.0.0.1', device: 'API · curl/8.4',          loginAt: '2025-11-12 06:00', lastActivity: '30 秒前',   mfa: false, current: false },
];

export const MOCK_TRENDS: TrendData = {
  cpu:    makeTrend(32, 14),
  memory: makeTrend(64, 6),
  gpu:    makeTrend(78, 10),
};
