export type AuditOutcome = 'success' | 'failure' | 'warning';

export interface AuditEvent {
  time: string;
  actor: string;
  actorIp: string;
  category: string;
  action: string;
  target: string;
  outcome: AuditOutcome;
  detail: string;
}
