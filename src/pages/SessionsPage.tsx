import { useState } from 'react';
import Icon from '../components/Icon';
import { MOCK_SESSIONS } from '../api/mock';
import type { ActiveSession } from '../types/system';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<ActiveSession[]>(MOCK_SESSIONS);
  const [confirmKick, setConfirmKick] = useState<ActiveSession | null>(null);
  const [confirmAll, setConfirmAll] = useState(false);

  function kick(s: ActiveSession) {
    setSessions(arr => arr.filter(x => x.id !== s.id));
    setConfirmKick(null);
  }
  function kickAll() {
    setSessions(arr => arr.filter(x => x.current));
    setConfirmAll(false);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">系統營運</div>
          <h1 className="page-title">在線連線</h1>
          <p className="page-desc">目前有 {sessions.length} 個有效連線。可單獨或批次強制登出。</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary"><Icon name="refresh" size={13} /> 重新整理</button>
          <button className="btn btn-secondary" style={{ color: 'var(--color-error-accent)' }}
            onClick={() => setConfirmAll(true)}>
            <Icon name="logOut" size={13} /> 登出所有其他連線
          </button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 16 }}>
        <div className="card"><div className="stat-label">有效連線</div><div className="stat-value">{sessions.length}</div></div>
        <div className="card"><div className="stat-label">已通過 MFA</div><div className="stat-value">{sessions.filter(s => s.mfa).length}</div></div>
        <div className="card"><div className="stat-label">API 連線</div><div className="stat-value">{sessions.filter(s => s.device.includes('API')).length}</div></div>
        <div className="card"><div className="stat-label">外部 IP</div><div className="stat-value">0</div></div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>使用者</th>
              <th>來源 IP</th>
              <th>裝置 / 用戶端</th>
              <th>登入時間</th>
              <th>最近活動</th>
              <th>驗證</th>
              <th style={{ width: 1, textAlign: 'right' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s.id} style={s.current ? { background: 'var(--color-success-bg)' } : {}}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-brand-200)', color: 'var(--color-brand-700)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                      {s.displayName.slice(0, 1)}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {s.displayName}
                        {s.current && <span className="pill pill-success" style={{ fontSize: 9 }}>本連線</span>}
                      </div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{s.user}</div>
                    </div>
                  </div>
                </td>
                <td><span className="mono" style={{ fontSize: 12 }}>{s.ip}</span></td>
                <td><span style={{ fontSize: 12 }}>{s.device}</span></td>
                <td><span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{s.loginAt}</span></td>
                <td><span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{s.lastActivity}</span></td>
                <td>
                  {s.mfa
                    ? <span className="pill pill-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="check" size={9} /> MFA</span>
                    : <span className="pill pill-neutral">—</span>}
                </td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-ghost btn-sm" disabled={s.current}
                      style={{ color: s.current ? 'var(--color-text-tertiary)' : 'var(--color-error-accent)' }}
                      onClick={() => !s.current && setConfirmKick(s)}>
                      <Icon name="logOut" size={12} /> 強制登出
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmKick && (
        <div className="dialog-backdrop" onClick={() => setConfirmKick(null)}>
          <div className="dialog" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <h3 className="dialog-title">強制登出連線</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setConfirmKick(null)}><Icon name="x" size={14} /></button>
            </div>
            <div className="dialog-body">
              <div style={{ fontSize: 13 }}>
                確定要中止 <strong>{confirmKick.displayName}</strong> ({confirmKick.user}) 的連線嗎？
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 8 }}>
                {confirmKick.ip} · {confirmKick.device}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 12 }}>
                該連線將立即失效，使用者需重新登入。
              </div>
            </div>
            <div className="dialog-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmKick(null)}>取消</button>
              <button className="btn btn-danger" onClick={() => kick(confirmKick)}>強制登出</button>
            </div>
          </div>
        </div>
      )}

      {confirmAll && (
        <div className="dialog-backdrop" onClick={() => setConfirmAll(false)}>
          <div className="dialog" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <h3 className="dialog-title">登出所有其他連線</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setConfirmAll(false)}><Icon name="x" size={14} /></button>
            </div>
            <div className="dialog-body">
              <div className="notice" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning-text)' }}>
                <Icon name="alert" size={14} />
                <span>將立即中止其他 {sessions.length - 1} 個連線（保留您目前的連線）。</span>
              </div>
            </div>
            <div className="dialog-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmAll(false)}>取消</button>
              <button className="btn btn-danger" onClick={kickAll}>確認登出</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
