import { useState } from 'react';
import Icon from '../components/Icon';
import { useAuthStore } from '../stores/authStore';

export default function PasswordPage() {
  const user = useAuthStore(s => s.user);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);

  const rules = [
    { ok: newPw.length >= 12,                            text: '至少 12 個字元' },
    { ok: /[A-Z]/.test(newPw) && /[a-z]/.test(newPw),  text: '混合大小寫英文字母' },
    { ok: /\d/.test(newPw),                              text: '至少 1 個數字' },
    { ok: /[^A-Za-z0-9]/.test(newPw),                   text: '至少 1 個符號' },
    { ok: !!(newPw && newPw === confirm),                text: '兩次輸入一致' },
    { ok: !!(newPw && newPw !== oldPw),                  text: '與舊密碼不同' },
  ];
  const strength = rules.filter(r => r.ok).length;
  const strengthLabel = ['', '極弱', '弱', '尚可', '良好', '強', '極強'][strength];
  const strengthColor = strength <= 2 ? '#A32D2D' : strength <= 4 ? '#BA7517' : '#1D9E75';

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (rules.every(r => r.ok)) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setOldPw(''); setNewPw(''); setConfirm('');
    }
  }

  return (
    <div className="page" style={{ maxWidth: 880 }}>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">身分治理</div>
          <h1 className="page-title">變更密碼</h1>
          <p className="page-desc">為您目前的帳號更新登入憑證；建議每 90 天更換一次。</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 16 }}>
        <form className="card card-padded" onSubmit={submit}>
          <h2 className="card-title" style={{ marginBottom: 4 }}>更新密碼</h2>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
            目前登入：<strong>{user?.displayName}</strong> · {user?.role}
          </div>

          {saved && (
            <div className="notice notice-success" style={{ marginTop: 14 }}>
              <Icon name="check" size={14} /> 密碼已成功更新，請於下次登入時使用新密碼。
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
            <div className="field">
              <label className="field-label">目前密碼</label>
              <input className="input" type={show ? 'text' : 'password'}
                value={oldPw} onChange={e => setOldPw(e.target.value)} autoComplete="current-password" />
            </div>
            <div className="field">
              <label className="field-label">新密碼</label>
              <input className="input" type={show ? 'text' : 'password'}
                value={newPw} onChange={e => setNewPw(e.target.value)} autoComplete="new-password" />
              {newPw && (
                <div style={{ marginTop: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>密碼強度</span>
                    <span style={{ color: strengthColor, fontWeight: 500 }}>{strengthLabel}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 4, borderRadius: 2,
                        background: i <= strength ? strengthColor : 'var(--color-background-secondary)',
                      }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="field">
              <label className="field-label">確認新密碼</label>
              <input className="input" type={show ? 'text' : 'password'}
                value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
              <span className={'checkbox' + (show ? ' checked' : '')} onClick={() => setShow(s => !s)}>
                {show && <Icon name="check" size={11} />}
              </span>
              顯示密碼
            </label>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary"
              onClick={() => { setOldPw(''); setNewPw(''); setConfirm(''); }}>取消</button>
            <button type="submit" className="btn btn-primary" disabled={!rules.every(r => r.ok)}>
              更新密碼
            </button>
          </div>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card card-padded">
            <h3 className="card-title" style={{ marginBottom: 12 }}>密碼規則</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rules.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: r.ok ? '#085041' : 'var(--color-text-secondary)' }}>
                  <span style={{
                    width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                    background: r.ok ? '#E1F5EE' : 'var(--color-background-secondary)',
                    color: r.ok ? '#1D9E75' : 'var(--color-text-tertiary)',
                    display: 'grid', placeItems: 'center',
                  }}>
                    <Icon name={r.ok ? 'check' : 'x'} size={10} />
                  </span>
                  {r.text}
                </div>
              ))}
            </div>
          </div>

          <div className="card card-padded">
            <h3 className="card-title" style={{ marginBottom: 10 }}>安全提示</h3>
            <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--color-text-secondary)', fontSize: 12, lineHeight: 1.8 }}>
              <li>請勿與其他系統共用相同密碼。</li>
              <li>避免使用個人資訊（生日、電話號碼等）。</li>
              <li>建議使用密碼管理器產生並儲存密碼。</li>
              <li>更新後將需在所有裝置重新登入。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
