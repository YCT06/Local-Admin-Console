import { useState, useRef, Fragment } from "react";
import Icon from "../components/Icon";
import { useUploadServicePack } from "../hooks/useServicePack";

type HistoryStatus = "installed" | "uploaded" | "rolled-back";

interface HistoryRecord {
  name: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  status: HistoryStatus;
  target: string;
}

const MOCK_HISTORY: HistoryRecord[] = [
  {
    name: "OfficeAI-v2.4.1-20251108.sp",
    size: "184.2 MB",
    uploadedAt: "2025-11-08 14:23",
    uploadedBy: "admin",
    status: "installed",
    target: "/opt/officeai/packages",
  },
  {
    name: "security-patch-2410.sp",
    size: "12.4 MB",
    uploadedAt: "2025-10-24 09:11",
    uploadedBy: "lin.weiting",
    status: "installed",
    target: "/opt/officeai/patches",
  },
  {
    name: "OfficeAI-v2.4.0-20251015.sp",
    size: "180.9 MB",
    uploadedAt: "2025-10-15 17:42",
    uploadedBy: "admin",
    status: "installed",
    target: "/opt/officeai/packages",
  },
  {
    name: "OfficeAI-v2.4.0-rc2.sp",
    size: "180.5 MB",
    uploadedAt: "2025-10-12 21:08",
    uploadedBy: "admin",
    status: "rolled-back",
    target: "/opt/officeai/packages",
  },
];

export default function ServicePackPage() {
  const uploadMutation = useUploadServicePack();
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [file, setFile] = useState<{ name: string; size: string } | null>(null);
  const [target, setTarget] = useState("/opt/officeai/packages");
  const [verifySig, setVerifySig] = useState(true);
  const [autoInstall, setAutoInstall] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [history, setHistory] = useState<HistoryRecord[]>(MOCK_HISTORY);
  const inputRef = useRef<HTMLInputElement>(null);

  // Derive phase from mutation state
  type Phase = "idle" | "uploading" | "done" | "error";
  const phase: Phase = uploadMutation.isPending
    ? "uploading"
    : uploadMutation.isSuccess
      ? "done"
      : uploadMutation.isError
        ? "error"
        : "idle";
  const progress = uploadMutation.progress;

  function pickFile(f: File | null | undefined) {
    if (!f) return;
    if (!f.name.endsWith(".sp") && !f.name.endsWith(".tar.gz")) return;
    setRawFile(f);
    setFile({ name: f.name, size: (f.size / 1024 / 1024).toFixed(1) + " MB" });
    uploadMutation.reset();
  }

  function startUpload() {
    if (!rawFile) return;
    uploadMutation.mutate(rawFile, {
      onSuccess: () => {
        if (file) {
          setHistory((h) => [
            {
              name: file.name,
              size: file.size,
              uploadedAt: new Date().toLocaleString("zh-TW", { hour12: false }),
              uploadedBy: "admin",
              status: autoInstall ? "installed" : "uploaded",
              target,
            },
            ...h,
          ]);
        }
      },
    });
  }

  function reset() {
    setFile(null);
    setRawFile(null);
    uploadMutation.reset();
  }

  const phaseLabel: Record<Phase, string> = {
    idle: "等候上傳",
    uploading: `上傳中 · ${Math.floor(progress)}%`,
    done: "已完成",
    error: "錯誤",
  };

  const STEPS = [
    { id: "uploading", label: "上傳", skip: false },
    { id: "done", label: "完成", skip: false },
  ];

  const PHASE_ORDER: Phase[] = ["uploading", "done"];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">系統營運</div>
          <h1 className="page-title">服務套件上傳</h1>
          <p className="page-desc">
            上傳 .sp 套件以更新平台功能、安裝修補檔或新增服務模組。
          </p>
        </div>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* Upload card */}
        <div className="card card-padded">
          <h2 className="card-title" style={{ marginBottom: 12 }}>
            上傳套件
          </h2>

          {!file && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                pickFile(e.dataTransfer.files[0]);
              }}
              onClick={() => inputRef.current?.click()}
              style={{
                border:
                  "1.5px dashed " + (dragOver ? "#1D9E75" : "rgba(0,0,0,.18)"),
                borderRadius: 12,
                padding: "36px 20px",
                textAlign: "center",
                cursor: "pointer",
                background: dragOver
                  ? "#E1F5EE"
                  : "var(--color-background-secondary)",
                transition: "all 0.15s linear",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "#fff",
                  border: "0.5px solid rgba(0,0,0,.08)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                  color: "#1D9E75",
                }}
              >
                <Icon name="upload" size={20} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                拖放套件檔案至此，或點擊選擇檔案
              </div>
              <div
                style={{ fontSize: 12, color: "var(--color-text-secondary)" }}
              >
                支援 <span className="mono">.sp</span> ·{" "}
                <span className="mono">.tar.gz</span> · 單檔上限 2 GB
              </div>
              <input
                ref={inputRef}
                type="file"
                accept=".sp,.tar.gz"
                style={{ display: "none" }}
                onChange={(e) => pickFile(e.target.files?.[0])}
              />
            </div>
          )}

          {file && (
            <div
              style={{
                border: "0.5px solid rgba(0,0,0,.09)",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: "#E1F5EE",
                    color: "#0F6E56",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="package" size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {file.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--color-text-secondary)",
                      marginTop: 2,
                    }}
                  >
                    {file.size} · {phaseLabel[phase]}
                  </div>
                </div>
                {phase === "idle" && (
                  <button className="btn btn-ghost btn-sm" onClick={reset}>
                    <Icon name="x" size={12} /> 移除
                  </button>
                )}
                {phase === "done" && (
                  <button className="btn btn-secondary btn-sm" onClick={reset}>
                    上傳新檔
                  </button>
                )}
              </div>

              {phase !== "idle" && (
                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      height: 6,
                      borderRadius: 3,
                      background: "var(--color-background-secondary)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: phase === "uploading" ? `${progress}%` : "100%",
                        background: phase === "error" ? "#A32D2D" : "#1D9E75",
                        transition: "width 0.2s linear",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 6,
                      fontSize: 11,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    <span>
                      {phase === "uploading" &&
                        `${Math.floor(progress)}% · ${((parseFloat(file.size) * progress) / 100).toFixed(1)} MB`}
                      {phase === "done" && (
                        <span
                          style={{
                            color: "#0F6E56",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Icon name="check" size={11} /> 處理完成 ·
                          已記錄到部署歷史
                        </span>
                      )}
                      {phase === "error" && (
                        <span style={{ color: "#A32D2D" }}>
                          上傳失敗，請稍後重試
                        </span>
                      )}
                    </span>
                    {phase === "uploading" && (
                      <span className="mono">
                        {((100 - progress) * 0.4).toFixed(0)}s remaining
                      </span>
                    )}
                  </div>
                </div>
              )}

              {phase !== "idle" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 12px",
                    background: "var(--color-background-secondary)",
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                >
                  {STEPS.map((s, i) => {
                    const isDone =
                      PHASE_ORDER.indexOf(phase) >
                      PHASE_ORDER.indexOf(s.id as Phase);
                    const isActive = phase === s.id;
                    return (
                      <Fragment key={s.id}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 11,
                            color:
                              isDone || isActive
                                ? "#0F6E56"
                                : "var(--color-text-tertiary)",
                          }}
                        >
                          <span
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              display: "grid",
                              placeItems: "center",
                              background: isDone
                                ? "#1D9E75"
                                : isActive
                                  ? "#fff"
                                  : "transparent",
                              border: isActive
                                ? "1.5px solid #1D9E75"
                                : isDone
                                  ? "none"
                                  : "1px solid var(--color-border-secondary)",
                              color: "#fff",
                            }}
                          >
                            {isDone && <Icon name="check" size={10} />}
                            {isActive && (
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: "#1D9E75",
                                }}
                              />
                            )}
                          </span>
                          {s.label}
                        </div>
                        {i < STEPS.length - 1 && (
                          <span
                            style={{
                              flex: 1,
                              height: 1,
                              background: "rgba(0,0,0,.08)",
                            }}
                          />
                        )}
                      </Fragment>
                    );
                  })}
                </div>
              )}

              {phase === "idle" && (
                <button
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={startUpload}
                >
                  <Icon name="upload" size={13} /> 開始上傳
                </button>
              )}
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <div className="section-label" style={{ marginBottom: 10 }}>
              上傳選項
            </div>
            <div className="field">
              <label className="field-label">部署目錄</label>
              <select
                className="select"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                disabled={phase !== "idle"}
              >
                <option value="/opt/officeai/packages">
                  /opt/officeai/packages · 主要套件
                </option>
                <option value="/opt/officeai/patches">
                  /opt/officeai/patches · 修補檔
                </option>
                <option value="/opt/officeai/modules">
                  /opt/officeai/modules · 模組擴充
                </option>
              </select>
            </div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 0",
                cursor: "pointer",
              }}
            >
              <span
                className={"toggle" + (verifySig ? " on" : "")}
                onClick={(e) => {
                  e.stopPropagation();
                  if (phase === "idle") setVerifySig((s) => !s);
                }}
              />
              <div>
                <div style={{ fontSize: 12 }}>驗證數位簽章</div>
                <div
                  style={{ fontSize: 11, color: "var(--color-text-secondary)" }}
                >
                  使用內建 GPG 公鑰驗證套件來源（強烈建議）
                </div>
              </div>
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 0",
                cursor: "pointer",
              }}
            >
              <span
                className={"toggle" + (autoInstall ? " on" : "")}
                onClick={(e) => {
                  e.stopPropagation();
                  if (phase === "idle") setAutoInstall((s) => !s);
                }}
              />
              <div>
                <div style={{ fontSize: 12 }}>上傳完成後自動安裝</div>
                <div
                  style={{ fontSize: 11, color: "var(--color-text-secondary)" }}
                >
                  否則套件僅儲存於目錄，需手動執行 install 指令
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Side info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card card-padded">
            <h3 className="card-title" style={{ marginBottom: 12 }}>
              儲存空間
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                marginBottom: 6,
              }}
            >
              <span style={{ color: "var(--color-text-secondary)" }}>
                已使用 12.4 GB
              </span>
              <span style={{ fontWeight: 500 }}>共 500 GB</span>
            </div>
            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: "var(--color-background-secondary)",
                overflow: "hidden",
              }}
            >
              <div
                style={{ height: "100%", width: "2.5%", background: "#1D9E75" }}
              />
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--color-text-secondary)",
                marginTop: 8,
              }}
            >
              建議保留至少 5 GB 給套件部署。
            </div>
          </div>

          <div className="card card-padded">
            <h3 className="card-title" style={{ marginBottom: 10 }}>
              套件規範
            </h3>
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                color: "var(--color-text-secondary)",
                fontSize: 12,
                lineHeight: 1.9,
              }}
            >
              <li>套件必須由 OfficeAI 官方或授權合作夥伴簽署。</li>
              <li>
                檔名建議格式：<span className="mono">name-vX.Y.Z-date.sp</span>
              </li>
              <li>主套件大小通常為 150 ~ 300 MB。</li>
              <li>安裝過程約 30 秒至 3 分鐘，部分模組需重啟服務。</li>
            </ul>
          </div>
        </div>
      </div>

      {/* History table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="toolbar">
          <div className="section-label" style={{ margin: 0 }}>
            部署歷史
          </div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginLeft: "auto" }}
          >
            <Icon name="refresh" size={12} /> 重新整理
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>套件檔名</th>
              <th>大小</th>
              <th>上傳時間</th>
              <th>上傳者</th>
              <th>部署目錄</th>
              <th>狀態</th>
              <th style={{ width: 1, textAlign: "right" }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i}>
                <td>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Icon
                      name="package"
                      size={14}
                      style={{ color: "var(--color-text-secondary)" }}
                    />
                    <span className="mono" style={{ fontSize: 12 }}>
                      {h.name}
                    </span>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: 12 }}>{h.size}</span>
                </td>
                <td>
                  <span
                    className="mono"
                    style={{
                      fontSize: 11,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {h.uploadedAt}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: 12 }}>{h.uploadedBy}</span>
                </td>
                <td>
                  <span
                    className="mono"
                    style={{
                      fontSize: 11,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {h.target}
                  </span>
                </td>
                <td>
                  {h.status === "installed" && (
                    <span className="pill pill-success">
                      <span
                        className="pill-dot"
                        style={{ background: "#1D9E75" }}
                      />
                      已安裝
                    </span>
                  )}
                  {h.status === "uploaded" && (
                    <span className="pill pill-info">
                      <span
                        className="pill-dot"
                        style={{ background: "#2A6FDB" }}
                      />
                      已上傳
                    </span>
                  )}
                  {h.status === "rolled-back" && (
                    <span className="pill pill-neutral">
                      <span
                        className="pill-dot"
                        style={{ background: "#A49DAE" }}
                      />
                      已回滾
                    </span>
                  )}
                </td>
                <td>
                  <div className="table-actions">
                    {h.status === "uploaded" && (
                      <button className="btn btn-ghost btn-sm">
                        <Icon name="play" size={12} /> 安裝
                      </button>
                    )}
                    {h.status === "installed" && (
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: "#A32D2D" }}
                      >
                        <Icon name="rotateCcw" size={12} /> 回滾
                      </button>
                    )}
                    <button className="btn btn-ghost btn-sm">
                      <Icon name="download" size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
