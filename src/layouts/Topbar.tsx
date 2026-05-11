import { Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icon from '../components/Icon';
import { useUiStore } from '../stores/uiStore';

const PAGE_META: Record<string, { eyebrowKey: string; titleKey: string }> = {
  dashboard: { eyebrowKey: 'nav.console',  titleKey: 'nav.dashboard' },
  users:     { eyebrowKey: 'nav.identity', titleKey: 'nav.users'     },
  roles:     { eyebrowKey: 'nav.identity', titleKey: 'nav.roles'     },
  password:  { eyebrowKey: 'nav.identity', titleKey: 'nav.password'  },
  status:    { eyebrowKey: 'nav.ops',      titleKey: 'nav.status'    },
  network:   { eyebrowKey: 'nav.ops',      titleKey: 'nav.network'   },
  service:   { eyebrowKey: 'nav.ops',      titleKey: 'nav.service'   },
  sessions:  { eyebrowKey: 'nav.ops',      titleKey: 'nav.sessions'  },
  audit:     { eyebrowKey: 'nav.ops',      titleKey: 'nav.audit'     },
};

export default function Topbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useUiStore();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  function switchLang(l: string) {
    i18n.changeLanguage(l);
    localStorage.setItem('i18nextLng', l);
  }
  const key = pathname.replace('/', '') || 'dashboard';
  const meta = PAGE_META[key] ?? PAGE_META.dashboard;

  return (
    <header style={{
      height: 52, flexShrink: 0,
      background: 'var(--color-background-primary)',
      borderBottom: '0.5px solid var(--color-border-tertiary)',
      padding: '0 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', letterSpacing: '0.04em' }}>{t(meta.eyebrowKey)}</span>
        <span style={{ color: 'var(--color-border-secondary)', fontSize: 12 }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>{t(meta.titleKey)}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          position: 'relative', display: 'flex', alignItems: 'center', gap: 8,
          width: 280, padding: '0 10px',
          background: 'var(--color-background-secondary)', borderRadius: 7, height: 32,
          color: 'var(--color-text-tertiary)',
        }}>
          <Icon name="search" size={13} />
          <input className="input" placeholder="搜尋帳號、容器、設定…" style={{ border: 'none', background: 'transparent', height: 30, flex: 1, padding: 0, fontSize: 12, outline: 'none' }} />
        </div>

        <button className="btn btn-ghost btn-icon" title="通知"><Icon name="bell" size={14} /></button>

        <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, color: 'var(--color-text-secondary)' }}>
          {(['zh-TW', 'en-US'] as const).map((l, i) => (
            <Fragment key={l}>
              {i > 0 && <span style={{ color: 'var(--color-border-secondary)', padding: '0 1px' }}>|</span>}
              <button
                onClick={() => switchLang(l)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '2px 5px', borderRadius: 4,
                  fontSize: 11, color: lang.startsWith(l.slice(0, 2)) ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                  fontWeight: lang.startsWith(l.slice(0, 2)) ? 600 : 400,
                }}>
                {l === 'zh-TW' ? '繁中' : 'EN'}
              </button>
            </Fragment>
          ))}
        </div>

        <button className="btn btn-ghost btn-icon" title={theme === 'light' ? '切換深色' : '切換淺色'}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          <Icon name={theme === 'light' ? 'moon' : 'sun'} size={14} />
        </button>

        <button className="btn btn-ghost btn-icon" title="設定" onClick={() => navigate('/password')}>
          <Icon name="gear" size={14} />
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '0 10px', height: 28, fontSize: 11,
          color: 'var(--color-text-secondary)',
          background: 'var(--color-background-secondary)', borderRadius: 7,
        }}>
          <span className="dot dot-success" />
          <span>生產環境 · v2.4.1</span>
        </div>
      </div>
    </header>
  );
}
