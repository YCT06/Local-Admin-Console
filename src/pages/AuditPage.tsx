import { useState } from 'react';
import Icon from '../components/Icon';
import { MOCK_AUDIT_EVENTS } from '../api/mock';
import type { AuditEvent } from '../types/audit';

const CATEGORIES = ['全部', '身分治理', '身分驗證', '系統部署', '網路設定', '系統健康'];

const OUTCOMES = [
  { id: 'all',     label: '全部結果' },
  { id: 'success', label: '成功' },
  { id: 'failure', label: '失敗' },
  { id: 'warning', label: '警告' },
];

export default function AuditPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  const [outcome, setOutcome] = useState('all');
  const [range, setRange] = useState('7d');

  const filtered = MOCK_AUDIT_EVENTS.filter((e: AuditEvent) => {
    if (category !== '全部' && e.category !== category) return false;
    if (outcome !== 'all' && e.outcome !== outcome) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!`${e.actor} ${e.target} ${e.action} ${e.detail}`.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  function exportCsv() {
    const header = ['時間', '操作者', 'IP', '類別', '動作', '目標', '結果', '備註'];
    const rows = filtered.map(e => [e.time, e.actor, e.actorIp, e.category, e.action, e.target, e.outcome, e.detail]);
    const csv = [header, ...rows].map(r => r.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">系統營運</div>
          <h1 className="page-title">稽核軌跡</h1>
          <p className="page-desc">所有平台操作的時序記錄，可依操作者、類別、結果篩選並匯出 CSV。</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary"><Icon name="refresh" size={13} /> 重新整理</button>
          <button className="btn btn-primary" onClick={exportCsv}>
            <Icon name="download" size={13} /> 匯出 CSV ({filtered.length})
          </button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 16 }}>
        <div className="card"><div className="stat-label">事件總數</div><div className="stat-value">{MOCK_AUDIT_EVENTS.length}</div></div>
        <div className="card"><div className="stat-label">最近 24 小時</div><div className="stat-value">7</div></div>
        <div className="card"><div className="stat-label">失敗事件</div><div className="stat-value" style={{ color: 'var(--color-error-accent)' }}>{MOCK_AUDIT_EVENTS.filter(e => e.outcome === 'failure').length}</div></div>
        <div className="card"><div className="stat-label">告警事件</div><div className="stat-value" style={{ color: 'var(--color-warning-accent)' }}>{MOCK_AUDIT_EVENTS.filter(e => e.outcome === 'warning').length}</div></div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="toolbar" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 320 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', display: 'flex' }}>
              <Icon name="search" size={13} />
            </span>
            <input className="input" placeholder="搜尋操作者、目標、備註…"
              style={{ paddingLeft: 30 }} value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <div className="segmented">
            {CATEGORIES.map(c => (
              <div key={c} className={'segmented-item' + (category === c ? ' active' : '')}
                onClick={() => setCategory(c)}>{c}</div>
            ))}
          </div>
          <div className="segmented">
            {OUTCOMES.map(f => (
              <div key={f.id} className={'segmented-item' + (outcome === f.id ? ' active' : '')}
                onClick={() => setOutcome(f.id)}>{f.label}</div>
            ))}
          </div>
          <select className="select" value={range} onChange={e => setRange(e.target.value)} style={{ width: 'auto' }}>
            <option value="24h">最近 24 小時</option>
            <option value="7d">最近 7 天</option>
            <option value="30d">最近 30 天</option>
            <option value="all">全部時間</option>
          </select>
          <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--color-text-tertiary)' }}>
            顯示 {filtered.length} / {MOCK_AUDIT_EVENTS.length} 筆
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 160 }}>時間</th>
              <th>操作者</th>
              <th>類別</th>
              <th>動作 / 目標</th>
              <th>結果</th>
              <th>備註</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => (
              <tr key={i}>
                <td><span className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{e.time}</span></td>
                <td>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{e.actor}</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginTop: 2 }}>{e.actorIp}</div>
                </td>
                <td><span className="pill pill-neutral">{e.category}</span></td>
                <td>
                  <div style={{ fontSize: 12 }}>{e.action}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>{e.target}</div>
                </td>
                <td>
                  {e.outcome === 'success' && <span className="pill pill-success"><span className="pill-dot" style={{ background: 'var(--color-success-accent)' }} />成功</span>}
                  {e.outcome === 'failure' && <span className="pill pill-error"><span className="pill-dot" style={{ background: 'var(--color-error-accent)' }} />失敗</span>}
                  {e.outcome === 'warning' && <span className="pill pill-warning"><span className="pill-dot" style={{ background: 'var(--color-warning-accent)' }} />警告</span>}
                </td>
                <td><span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{e.detail || '—'}</span></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 60 }}>
                <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10, color: 'var(--color-text-tertiary)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-background-secondary)', display: 'grid', placeItems: 'center' }}>
                    <Icon name="search" size={20} />
                  </div>
                  <div style={{ fontSize: 13 }}>沒有符合條件的事件</div>
                  <div style={{ fontSize: 11 }}>調整篩選條件或變更時間範圍</div>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
