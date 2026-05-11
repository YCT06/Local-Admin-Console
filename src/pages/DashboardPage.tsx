import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import MiniSpark from '../components/MiniSpark';
import Icon from '../components/Icon';
import { MOCK_TRENDS, MOCK_ACTIVITY } from '../api/mock';

function makeTrend(base: number, variance: number): number[] {
  const pts: number[] = [];
  let v = base;
  for (let i = 0; i < 30; i++) { v = Math.max(2, Math.min(100, v + (Math.random() - 0.5) * variance)); pts.push(+v.toFixed(1)); }
  return pts;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);

  const stats = [
    { label: '在線使用者', value: '4',   sub: '較昨日 +1',          trend: makeTrend(40, 8),       color: '#1D9E75' },
    { label: 'CPU 平均',   value: '32%', sub: '8 核心 · ofc-prod-01', trend: MOCK_TRENDS.cpu,        color: '#378ADD' },
    { label: '記憶體使用', value: '64%', sub: '20.4 / 32 GB',         trend: MOCK_TRENDS.memory,     color: '#BA7517' },
    { label: '運行容器',   value: '7/8', sub: '1 個重啟中',            trend: makeTrend(75, 5),       color: '#1D9E75' },
  ];

  const quickActions = [
    { path: '/status',  icon: 'activity', label: '系統狀態',     desc: '即時資源遙測與容器健康度' },
    { path: '/users',   icon: 'users',    label: '使用者管理',   desc: '7 個帳號 · 1 個已停用' },
    { path: '/network', icon: 'network',  label: '網路設定',     desc: '3 張網卡 · 主介面 eno1' },
    { path: '/service', icon: 'upload',   label: '服務套件部署', desc: '上次部署 14 天前 · v2.4.1' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">主控台</div>
          <h1 className="page-title">{user?.displayName}，歡迎回來</h1>
          <p className="page-desc">目前所有關鍵服務皆正常運作。下方為今日活動與系統摘要。</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary"><Icon name="refresh" size={13} /> 重新整理</button>
          <button className="btn btn-primary" onClick={() => navigate('/status')}><Icon name="activity" size={13} /> 開啟系統狀態</button>
        </div>
      </div>

      <div className="notice notice-success" style={{ marginBottom: 16 }}>
        <Icon name="check" size={14} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span><strong>系統運作正常</strong> · 所有核心容器健康、磁碟用量 58%、未偵測到異常告警。</span>
          <span style={{ fontSize: 11, color: 'var(--color-success-dark)' }}>最後檢查 14 秒前</span>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 16 }}>
        {stats.map(s => (
          <div key={s.label} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div className="stat-label">{s.label}</div>
              <MiniSpark data={s.trend} color={s.color} width={72} height={24} />
            </div>
            <div className="stat-value" style={{ marginTop: 6 }}>{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 16 }}>
        <div className="card card-padded">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 className="card-title">快速操作</h2>
            <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>跳轉至模組</span>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {quickActions.map(a => (
              <div key={a.path} onClick={() => navigate(a.path)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, border: '0.5px solid var(--color-border-tertiary)', borderRadius: 10, cursor: 'pointer', transition: 'border-color 0.12s', background: 'var(--color-background-primary)' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border-secondary)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border-tertiary)'}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--color-brand-50, #E1F5EE)', color: 'var(--color-brand-600, #0F6E56)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon name={a.icon} size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>{a.desc}</div>
                </div>
                <Icon name="chevR" size={14} style={{ color: 'var(--color-text-tertiary)' }} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, padding: 14, background: 'var(--color-background-secondary)', borderRadius: 10 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>目前身分</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-brand-200, #9FE1CB)', color: 'var(--color-brand-700, #085041)', display: 'grid', placeItems: 'center', fontWeight: 600 }}>
                {user?.initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{user?.displayName}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 1 }}>{user?.role} · 上次登入 今天 09:42</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/password')}>變更密碼</button>
            </div>
          </div>
        </div>

        <div className="card card-padded">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 className="card-title">今日活動</h2>
            <a href="#" style={{ fontSize: 11, color: 'var(--color-brand-600, #0F6E56)', textDecoration: 'none' }} onClick={e => e.preventDefault()}>檢視全部</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {MOCK_ACTIVITY.slice(0, 7).map((a, i) => {
              const dotClass = a.kind === 'success' ? 'dot-success' : a.kind === 'warning' ? 'dot-warning' : 'dot-neutral';
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '0.5px solid rgba(0,0,0,.06)' }}>
                  <span className={`dot ${dotClass}`} style={{ marginTop: 6 }} />
                  <div style={{ flex: 1, minWidth: 0, fontSize: 12 }}>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{a.user}</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}> {a.action} </span>
                    <span style={{ color: 'var(--color-text-primary)' }}>{a.target}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap' }}>{a.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
