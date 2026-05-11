import { useState } from 'react';
import Icon from '../components/Icon';
import { MOCK_NETWORK_ADAPTERS } from '../api/mock';
import type { NetworkAdapter } from '../types/system';

export default function NetworkPage() {
  const [adapters, setAdapters] = useState<NetworkAdapter[]>(MOCK_NETWORK_ADAPTERS);
  const [selectedName, setSelectedName] = useState(MOCK_NETWORK_ADAPTERS[0].name);
  const [dirty, setDirty] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const idx = adapters.findIndex(a => a.name === selectedName);
  const sel = adapters[idx];

  function update<K extends keyof NetworkAdapter>(k: K, v: NetworkAdapter[K]) {
    setAdapters(arr => arr.map((a, i) => i === idx ? { ...a, [k]: v } : a));
    setDirty(true);
  }
  function updateDns(i: number, v: string) {
    const dns = [...sel.dns];
    dns[i] = v;
    update('dns', dns);
  }

  function save() {
    setDirty(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">系統營運</div>
          <h1 className="page-title">網路設定</h1>
          <p className="page-desc">管理網卡的 IP 取得方式、靜態 IP 與 DNS。</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary"><Icon name="refresh" size={13} /> 重新讀取</button>
          {dirty && (
            <span style={{ fontSize: 11, color: 'var(--color-warning-accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="alert" size={11} /> 未儲存
            </span>
          )}
          <button className="btn btn-secondary" disabled={!dirty} onClick={() => { setAdapters(MOCK_NETWORK_ADAPTERS); setDirty(false); }}>還原</button>
          <button className="btn btn-primary" disabled={!dirty} onClick={save}>
            <Icon name="check" size={13} /> 套用設定
          </button>
        </div>
      </div>

      <div className="notice notice-warning" style={{ marginBottom: 16 }}>
        <Icon name="alert" size={14} />
        <span>變更主要介面 IP 後將短暫斷線。請確認您目前透過<strong>非主要介面</strong>登入，或使用主控台存取。</span>
      </div>

      {savedFlash && (
        <div className="notice notice-success" style={{ marginBottom: 16 }}>
          <Icon name="check" size={14} /> 設定已套用，網路服務正在重新啟動…
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: 'minmax(260px, 320px) minmax(0, 1fr)', gap: 16 }}>

        {/* Adapter list */}
        <div className="card" style={{ padding: 0, alignSelf: 'flex-start' }}>
          <div style={{ padding: '12px 14px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
            <div className="section-label" style={{ margin: 0 }}>網卡介面 · {adapters.length}</div>
          </div>
          {adapters.map(a => {
            const isActive = a.name === selectedName;
            return (
              <div key={a.name} onClick={() => setSelectedName(a.name)}
                style={{
                  padding: 14, cursor: 'pointer',
                  background: isActive ? '#E1F5EE' : 'transparent',
                  borderLeft: isActive ? '2px solid #1D9E75' : '2px solid transparent',
                  borderBottom: '0.5px solid rgba(0,0,0,.06)',
                  transition: 'background 0.12s linear',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'var(--color-background-secondary)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Icon name={a.connected ? 'wifi' : 'wifiOff'} size={14}
                    style={{ color: a.connected ? '#1D9E75' : 'var(--color-text-tertiary)' }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: isActive ? '#0F6E56' : 'var(--color-text-primary)', flex: 1 }}>
                    {a.display}
                  </span>
                  {a.primary && <span className="pill pill-warning">主介面</span>}
                </div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{a.name} · {a.mac}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  <span className={'pill ' + (a.mode === 'static' ? 'pill-info' : 'pill-neutral')}>
                    {a.mode === 'static' ? '靜態 IP' : 'DHCP'}
                  </span>
                  <span className="mono" style={{ fontSize: 11 }}>{a.ip}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit panel */}
        <div className="card card-padded">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <h2 className="card-title" style={{ fontSize: 16 }}>{sel.display}</h2>
              <div className="mono" style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                {sel.name} · MAC {sel.mac}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={'pill ' + (sel.connected ? 'pill-success' : 'pill-error')}>
                <span className="pill-dot" style={{ background: sel.connected ? '#1D9E75' : '#A32D2D' }} />
                {sel.connected ? '已連線' : '斷線'}
              </span>
            </div>
          </div>

          <div className="field" style={{ marginBottom: 14 }}>
            <label className="field-label">IP 取得方式</label>
            <div className="segmented" style={{ alignSelf: 'flex-start' }}>
              {(['dhcp', 'static'] as const).map(m => (
                <div key={m} className={'segmented-item' + (sel.mode === m ? ' active' : '')}
                  onClick={() => update('mode', m)}>
                  {m === 'dhcp' ? 'DHCP 自動取得' : '靜態 IP'}
                </div>
              ))}
            </div>
            <div className="field-hint">
              {sel.mode === 'dhcp'
                ? '由 DHCP 伺服器自動配發 IP、子網路遮罩、閘道與 DNS。'
                : '手動指定固定的 IP 與網路參數。'}
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label className="field-label">IP 位址</label>
              <input className="input mono" value={sel.ip}
                disabled={sel.mode === 'dhcp'}
                onChange={e => update('ip', e.target.value)} placeholder="192.168.10.32" />
            </div>
            <div className="field">
              <label className="field-label">子網路遮罩</label>
              <input className="input mono" value={sel.netmask}
                disabled={sel.mode === 'dhcp'}
                onChange={e => update('netmask', e.target.value)} placeholder="255.255.255.0" />
            </div>
            <div className="field">
              <label className="field-label">預設閘道</label>
              <input className="input mono" value={sel.gateway}
                disabled={sel.mode === 'dhcp'}
                onChange={e => update('gateway', e.target.value)} placeholder="192.168.10.1" />
            </div>
            <div className="field">
              <label className="field-label">MTU</label>
              <input className="input mono" defaultValue="1500" disabled={sel.mode === 'dhcp'} />
            </div>
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label className="field-label">DNS 伺服器</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[0, 1].map(i => (
                <input key={i} className="input mono"
                  value={sel.dns[i] || ''}
                  disabled={sel.mode === 'dhcp'}
                  onChange={e => updateDns(i, e.target.value)}
                  placeholder={i === 0 ? '主要 DNS（例如 192.168.10.1）' : '次要 DNS（選填）'} />
              ))}
            </div>
          </div>

          <div style={{ marginTop: 16, padding: 14, background: 'var(--color-background-secondary)', borderRadius: 10 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>連線測試</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="dot dot-success" /> Ping 閘道 1ms
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="dot dot-success" /> DNS 解析 12ms
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="dot dot-warning" /> 外網 (8.8.8.8) 略慢 86ms
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>
                <Icon name="refresh" size={11} /> 重新測試
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
