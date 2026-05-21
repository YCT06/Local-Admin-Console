import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Icon from "../components/Icon";
import { useLogin } from "../hooks/useAuth";
import type { AuthType } from "../types/user";

interface FormValues {
  username: string;
  password: string;
}

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  function switchLang(l: string) {
    i18n.changeLanguage(l);
    localStorage.setItem("i18nextLng", l);
  }
  const [authType, setAuthType] = useState<AuthType>("local");
  const [showPw, setShowPw] = useState(false);

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { username: "admin", password: "" },
  });

  async function onSubmit(data: FormValues) {
    loginMutation.mutate({ ...data, authType });
  }

  const apiError =
    loginMutation.error instanceof Error
      ? loginMutation.error.message
      : loginMutation.isError
        ? "登入失敗"
        : "";

  return (
    <div className="login-shell">
      <div
        style={{
          width: "min(1080px, 100%)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(360px, 420px)",
          gap: 36,
          alignItems: "center",
        }}
      >
        {/* Story panel */}
        <div style={{ padding: "12px 4px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 36,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "#1D9E75",
                borderRadius: 9,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="#fff">
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
                }}
              >
                {t("app.name")}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-text-tertiary)",
                  letterSpacing: "0.04em",
                }}
              >
                Local Admin Console v2.4.1
              </div>
            </div>
          </div>

          <h1
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: "var(--color-text-primary)",
              margin: 0,
              lineHeight: 1.25,
              letterSpacing: "-0.015em",
            }}
          >
            {t("login.headline")
              .split("\n")
              .map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
          </h1>
          <p
            style={{
              marginTop: 14,
              color: "var(--color-text-secondary)",
              fontSize: 13,
              lineHeight: 1.7,
              maxWidth: 480,
            }}
          >
            {t("login.desc")}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
              marginTop: 28,
            }}
          >
            {[
              {
                label: t("login.stat1Label"),
                value: "1",
                hint: t("login.stat1Hint"),
              },
              {
                label: t("login.stat2Label"),
                value: "6",
                hint: t("login.stat2Hint"),
              },
              {
                label: t("login.stat3Label"),
                value: "32d",
                hint: t("login.stat3Hint"),
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  padding: "12px 14px",
                  background: "var(--color-background-primary)",
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    color: "var(--color-text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    color: "var(--color-text-primary)",
                    marginTop: 6,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-secondary)",
                    marginTop: 2,
                  }}
                >
                  {s.hint}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form className="card card-padded" onSubmit={handleSubmit(onSubmit)}>
          <div className="section-label">{t("login.eyebrow")}</div>
          <h2
            style={{
              margin: "8px 0 0",
              fontSize: 18,
              fontWeight: 500,
              color: "var(--color-text-primary)",
            }}
          >
            {t("login.title")}
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              marginTop: 18,
            }}
          >
            <div className="field">
              <label className="field-label">{t("login.authType")}</label>
              <div className="segmented" style={{ alignSelf: "flex-start" }}>
                {(["local", "ldap"] as AuthType[]).map((opt) => (
                  <div
                    key={opt}
                    className={
                      "segmented-item" + (authType === opt ? " active" : "")
                    }
                    onClick={() => setAuthType(opt)}
                  >
                    {t(opt === "local" ? "login.local" : "login.ldap")}
                  </div>
                ))}
              </div>
              <div className="field-hint">
                {t(authType === "local" ? "login.localHint" : "login.ldapHint")}
              </div>
            </div>

            <div className="field">
              <label className="field-label">{t("login.username")}</label>
              <input
                className="input"
                {...register("username", { required: true })}
                placeholder="admin"
                autoComplete="username"
              />
            </div>

            <div className="field">
              <label className="field-label">{t("login.password")}</label>
              <div style={{ position: "relative" }}>
                <input
                  className="input"
                  type={showPw ? "text" : "password"}
                  {...register("password", { required: true })}
                  style={{ paddingRight: 32 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  style={{
                    position: "absolute",
                    right: 6,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 24,
                    height: 24,
                    background: "transparent",
                    border: "none",
                    color: "var(--color-text-tertiary)",
                    cursor: "pointer",
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 4,
                  }}
                >
                  <Icon name={showPw ? "eyeOff" : "eye"} size={14} />
                </button>
              </div>
            </div>

            {apiError && (
              <div
                className="notice"
                style={{
                  background: "var(--color-error-bg)",
                  color: "var(--color-error-text)",
                  borderColor: "rgba(163,45,45,0.18)",
                }}
              >
                <Icon name="alert" size={14} />
                <span>{apiError}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || loginMutation.isPending}
              style={{ width: "100%", height: 36, justifyContent: "center" }}
            >
              {isSubmitting ? t("login.submitting") : t("login.submit")}
            </button>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                color: "var(--color-text-tertiary)",
                marginTop: 4,
              }}
            >
              <span>{t("login.help")}</span>
              <a
                href="#"
                style={{ color: "#0F6E56", textDecoration: "none" }}
                onClick={(e) => e.preventDefault()}
              >
                {t("login.contact")}
              </a>
            </div>
          </div>
        </form>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 16,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 32px",
          fontSize: 11,
          color: "var(--color-text-tertiary)",
        }}
      >
        <span>{t("login.copyright")}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {(["zh-TW", "en-US"] as const).map((l, i) => (
            <span key={l} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && (
                <span
                  style={{
                    padding: "0 3px",
                    color: "var(--color-border-secondary)",
                  }}
                >
                  |
                </span>
              )}
              <button
                onClick={() => switchLang(l)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px 4px",
                  borderRadius: 4,
                  fontSize: 11,
                  color: lang.startsWith(l.slice(0, 2))
                    ? "var(--color-text-primary)"
                    : "var(--color-text-tertiary)",
                  fontWeight: lang.startsWith(l.slice(0, 2)) ? 600 : 400,
                }}
              >
                {l === "zh-TW" ? "繁中" : "EN"}
              </button>
            </span>
          ))}
        </div>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="dot dot-success" /> {t("login.serviceOk")}
        </span>
      </div>
    </div>
  );
}
