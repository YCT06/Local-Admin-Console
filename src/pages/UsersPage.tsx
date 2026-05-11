import { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { MOCK_USERS, MOCK_ROLES } from '../api/mock';
import type { User } from '../types/user';

type UserForm = {
  username: string; displayName: string; email: string; password: string;
  authType: 'local' | 'ldap'; isActive: boolean; roles: string[]; locale: string;
};

const DEFAULT_FORM: UserForm = {
  username: '', displayName: '', email: '', password: '',
  authType: 'local', isActive: true, roles: ['一般使用者'], locale: 'zh-TW',
};

function UserDialog({ open, user, onClose, onSave }: {
  open: boolean; user: User | null;
  onClose: () => void; onSave: (f: UserForm) => void;
}) {
  const isEdit = !!user;
  const [form, setForm] = useState<UserForm>(DEFAULT_FORM);

  useEffect(() => {
    if (open) setForm(user ? { ...user, password: '' } : { ...DEFAULT_FORM });
  }, [open, user]);

  if (!open) return null;
  const set = <K extends keyof UserForm>(k: K, v: UserForm[K]) => setForm(f => ({ ...f, [k]: v }));
  function toggleRole(r: string) {
    setForm(f => ({ ...f, roles: f.roles.includes(r) ? f.roles.filter(x => x !== r) : [...f.roles, r] }));
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div className="dialog-header">
          <h3 className="dialog-title">{isEdit ? `編輯使用者：${user!.username}` : '新增使用者'}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><Icon name="x" size={14} /></button>
        </div>
        <div className="dialog-body">
          <div className="row">
            <div className="field" style={{ flex: 1 }}>
              <label className="field-label">使用者名稱</label>
              <input className="input" value={form.username}
                onChange={e => set('username', e.target.value)}
                disabled={isEdit} placeholder="例如：lin.weiting" />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label className="field-label">顯示名稱</label>
              <input className="input" value={form.displayName}
                onChange={e => set('displayName', e.target.value)} placeholder="林威廷" />
            </div>
          </div>

          <div className="field">
            <label className="field-label">電子郵件</label>
            <input className="input" value={form.email}
              onChange={e => set('email', e.target.value)} placeholder="user@corp.tw" />
          </div>

          {!isEdit && (
            <div className="field">
              <label className="field-label">初始密碼</label>
              <input className="input" type="password" value={form.password}
                onChange={e => set('password', e.target.value)} placeholder="至少 8 字元，含英數" />
              <div className="field-hint">使用者首次登入時將被要求更換密碼。</div>
            </div>
          )}

          <div className="row">
            <div className="field" style={{ flex: 1 }}>
              <label className="field-label">驗證方式</label>
              <div className="segmented">
                {(['local', 'ldap'] as const).map(opt => (
                  <div key={opt} className={'segmented-item' + (form.authType === opt ? ' active' : '')}
                    onClick={() => set('authType', opt)}>
                    {opt === 'local' ? '本機' : 'LDAP'}
                  </div>
                ))}
              </div>
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label className="field-label">介面語系</label>
              <select className="select" value={form.locale} onChange={e => set('locale', e.target.value)}>
                <option value="zh-TW">繁體中文</option>
                <option value="en-US">English</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label className="field-label">指派角色</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {MOCK_ROLES.map(r => {
                const on = form.roles.includes(r.name);
                return (
                  <span key={r.id} onClick={() => toggleRole(r.name)}
                    className={'pill ' + (on ? 'pill-success' : 'pill-neutral')}
                    style={{ cursor: 'pointer', padding: '4px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {on && <Icon name="check" size={10} />}
                    {r.name}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="field">
            <label className="field-label">狀態</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className={'toggle' + (form.isActive ? ' on' : '')}
                onClick={() => set('isActive', !form.isActive)} />
              <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                {form.isActive ? '已啟用 · 使用者可登入系統' : '已停用 · 帳號暫時被封鎖'}
              </span>
            </div>
          </div>
        </div>
        <div className="dialog-footer">
          <button className="btn btn-secondary" onClick={onClose}>取消</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>
            {isEdit ? '儲存變更' : '建立使用者'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDeleteDialog({ user, onClose, onConfirm }: {
  user: User; onClose: () => void; onConfirm: () => void;
}) {
  const [typeMatch, setTypeMatch] = useState('');
  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="dialog-header">
          <h3 className="dialog-title">確認刪除使用者</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><Icon name="x" size={14} /></button>
        </div>
        <div className="dialog-body">
          <div className="notice" style={{ background: 'var(--color-error-bg)', color: 'var(--color-error-text)', borderColor: 'rgba(163,45,45,0.18)' }}>
            <Icon name="alert" size={14} />
            <span>此動作無法復原。將永久刪除 <strong>{user.username}</strong> 的所有資料、角色指派與稽核引用。</span>
          </div>
          <div className="field" style={{ marginTop: 14 }}>
            <label className="field-label">
              請輸入使用者名稱{' '}
              <span className="mono" style={{ background: 'var(--color-background-secondary)', padding: '1px 6px', borderRadius: 4 }}>{user.username}</span>
              {' '}以確認：
            </label>
            <input className="input mono" autoFocus
              value={typeMatch} onChange={e => setTypeMatch(e.target.value)}
              placeholder={user.username} />
          </div>
        </div>
        <div className="dialog-footer">
          <button className="btn btn-secondary" onClick={onClose}>取消</button>
          <button className="btn btn-danger" disabled={typeMatch !== user.username} onClick={onConfirm}>
            我了解，永久刪除
          </button>
        </div>
      </div>
    </div>
  );
}

const FILTERS = [
  { id: 'all',      label: '全部' },
  { id: 'active',   label: '啟用' },
  { id: 'inactive', label: '停用' },
  { id: 'ldap',     label: 'LDAP' },
  { id: 'local',    label: '本機' },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [dialog, setDialog] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [confirmDel, setConfirmDel] = useState<User | null>(null);

  const filtered = users.filter(u => {
    if (query && !(u.username.includes(query) || u.displayName.includes(query) || (u.email || '').includes(query))) return false;
    if (filter === 'active')   return u.isActive;
    if (filter === 'inactive') return !u.isActive;
    if (filter === 'ldap')     return u.authType === 'ldap';
    if (filter === 'local')    return u.authType === 'local';
    return true;
  });

  function save(form: UserForm) {
    if (dialog.user) {
      setUsers(us => us.map(u => u.id === dialog.user!.id ? { ...u, ...form } : u));
    } else {
      setUsers(us => [...us, { ...form, id: Date.now(), lastLogin: '從未' } as User]);
    }
    setDialog({ open: false, user: null });
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">身分治理</div>
          <h1 className="page-title">使用者管理</h1>
          <p className="page-desc">建立、停用與調整本地或 LDAP 使用者帳號。共 {users.length} 個帳號。</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary"><Icon name="refresh" size={13} /> 重新整理</button>
          <button className="btn btn-primary" onClick={() => setDialog({ open: true, user: null })}>
            <Icon name="plus" size={13} /> 新增使用者
          </button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 16 }}>
        <div className="card"><div className="stat-label">總帳號數</div><div className="stat-value">{users.length}</div></div>
        <div className="card"><div className="stat-label">啟用中</div><div className="stat-value">{users.filter(u => u.isActive).length}</div></div>
        <div className="card"><div className="stat-label">LDAP 帳號</div><div className="stat-value">{users.filter(u => u.authType === 'ldap').length}</div></div>
        <div className="card"><div className="stat-label">本機帳號</div><div className="stat-value">{users.filter(u => u.authType === 'local').length}</div></div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', display: 'flex' }}>
                <Icon name="search" size={13} />
              </span>
              <input className="input" placeholder="搜尋使用者名稱、姓名、信箱…"
                style={{ paddingLeft: 30 }} value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <div className="segmented">
              {FILTERS.map(f => (
                <div key={f.id} className={'segmented-item' + (filter === f.id ? ' active' : '')}
                  onClick={() => setFilter(f.id)}>{f.label}</div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>顯示 {filtered.length} / {users.length}</div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>使用者</th>
              <th>驗證方式</th>
              <th>角色</th>
              <th>狀態</th>
              <th>上次登入</th>
              <th style={{ width: 1, textAlign: 'right' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                      background: u.isActive ? '#9FE1CB' : '#E5E2E8',
                      color: u.isActive ? '#085041' : '#A49DAE',
                      display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600,
                    }}>
                      {u.displayName.slice(0, 1)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{u.displayName}</div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 1 }}>
                        {u.username}{u.email ? ' · ' + u.email : ''}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={'pill ' + (u.authType === 'ldap' ? 'pill-info' : 'pill-neutral')}>
                    {u.authType === 'ldap' ? 'LDAP' : '本機'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {u.roles.map(r => <span key={r} className="pill pill-neutral">{r}</span>)}
                  </div>
                </td>
                <td>
                  <span className={'pill ' + (u.isActive ? 'pill-success' : 'pill-neutral')}>
                    <span className="pill-dot" style={{ background: u.isActive ? '#1D9E75' : '#A49DAE' }} />
                    {u.isActive ? '啟用' : '停用'}
                  </span>
                </td>
                <td><span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{u.lastLogin}</span></td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => setDialog({ open: true, user: u })}>
                      <Icon name="edit" size={12} /> 編輯
                    </button>
                    <button className="btn btn-ghost btn-sm" style={{ color: '#A32D2D' }}
                      onClick={() => setConfirmDel(u)}>
                      <Icon name="trash" size={12} /> 刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-tertiary)' }}>
                沒有符合條件的使用者
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      <UserDialog open={dialog.open} user={dialog.user}
        onClose={() => setDialog({ open: false, user: null })}
        onSave={save} />

      {confirmDel && (
        <ConfirmDeleteDialog
          user={confirmDel}
          onClose={() => setConfirmDel(null)}
          onConfirm={() => {
            setUsers(us => us.filter(x => x.id !== confirmDel.id));
            setConfirmDel(null);
          }}
        />
      )}
    </div>
  );
}
