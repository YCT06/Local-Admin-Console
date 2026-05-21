import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "../components/Icon";
import { useAuthStore } from "../stores/authStore";

const NAV_GROUPS = [
  {
    labelKey: "nav.console",
    items: [{ path: "/dashboard", labelKey: "nav.dashboard", icon: "grid" }],
  },
  {
    labelKey: "nav.identity",
    items: [
      { path: "/users", labelKey: "nav.users", icon: "users" },
      { path: "/roles", labelKey: "nav.roles", icon: "shield" },
      { path: "/password", labelKey: "nav.password", icon: "key" },
    ],
  },
  {
    labelKey: "nav.ops",
    items: [
      { path: "/status", labelKey: "nav.status", icon: "activity" },
      { path: "/sessions", labelKey: "nav.sessions", icon: "wifi" },
      { path: "/network", labelKey: "nav.network", icon: "network" },
      { path: "/service", labelKey: "nav.service", icon: "upload" },
      { path: "/audit", labelKey: "nav.audit", icon: "doc" },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();

  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        background: "var(--color-background-primary)",
        borderRight: "0.5px solid var(--color-border-tertiary)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* Brand */}
      <div
        style={{
          height: 52,
          padding: "0 14px",
          boxSizing: "border-box",
          borderBottom: "0.5px solid var(--color-border-tertiary)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            background: "var(--accent-primary, #1D9E75)",
            borderRadius: 7,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="#fff">
            <rect x="2" y="2" width="5" height="5" rx="1" />
            <rect x="9" y="2" width="5" height="5" rx="1" />
            <rect x="2" y="9" width="5" height="5" rx="1" />
            <rect x="9" y="9" width="5" height="5" rx="1" opacity=".5" />
          </svg>
        </div>
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.005em",
            }}
          >
            {t("app.name")}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "var(--color-text-tertiary)",
              marginTop: 1,
              letterSpacing: "0.04em",
            }}
          >
            Local Admin Console
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px 6px", overflowY: "auto" }}>
        {NAV_GROUPS.map((group) => (
          <div key={group.labelKey} style={{ padding: "6px 0 4px" }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: "var(--color-text-tertiary)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "4px 10px 6px",
              }}
            >
              {t(group.labelKey)}
            </div>
            {group.items.map((item) => {
              const isActive = pathname === item.path;
              return (
                <div
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "7px 10px",
                    borderRadius: 7,
                    cursor: "pointer",
                    fontSize: 13,
                    marginBottom: 1,
                    transition: "background 0.12s, color 0.12s",
                    background: isActive
                      ? "var(--color-brand-50, #E1F5EE)"
                      : "transparent",
                    color: isActive
                      ? "var(--color-brand-600, #0F6E56)"
                      : "var(--color-text-secondary)",
                    fontWeight: isActive ? 500 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLDivElement).style.background =
                        "var(--color-background-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLDivElement).style.background =
                        "transparent";
                  }}
                >
                  <span
                    style={{ opacity: isActive ? 1 : 0.7, display: "flex" }}
                  >
                    <Icon name={item.icon} size={15} />
                  </span>
                  <span>{t(item.labelKey)}</span>
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer / User */}
      <div
        style={{
          borderTop: "0.5px solid var(--color-border-tertiary)",
          padding: "8px 6px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 10px",
            borderRadius: 7,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--color-brand-200, #9FE1CB)",
              color: "var(--color-brand-700, #085041)",
              display: "grid",
              placeItems: "center",
              fontSize: 11,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {user?.initials ?? "U"}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--color-text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.displayName}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--color-text-tertiary)",
                whiteSpace: "nowrap",
              }}
            >
              {user?.roles?.[0] ?? ""}
            </div>
          </div>
          <span
            style={{ color: "var(--color-text-tertiary)", display: "flex" }}
            onClick={logout}
            title={t("common.logout")}
          >
            <Icon name="logOut" size={14} />
          </span>
        </div>
      </div>
    </aside>
  );
}
