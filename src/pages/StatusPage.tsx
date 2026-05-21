import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import Icon from "../components/Icon";
import StatusPill from "../components/StatusPill";
import { useSystemMetrics } from "../hooks/useSystemMetrics";
import type { DockerContainer } from "../types/system";

function Gauge({
  value,
  label,
  sub,
}: {
  value: number;
  label: string;
  sub: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const r = 38,
    c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  const ringColor = pct >= 90 ? "#A32D2D" : pct >= 70 ? "#BA7517" : "#1D9E75";
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#F0EFEC"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth="8"
          strokeDasharray={`${dash} ${c}`}
          strokeDashoffset={c / 4}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dasharray 0.4s linear" }}
        />
        <text
          x="50"
          y="52"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: 18, fontWeight: 500, fill: "currentColor" }}
        >
          {pct.toFixed(0)}%
        </text>
      </svg>
      <div style={{ textAlign: "center", marginTop: 4 }}>
        <div style={{ fontSize: 12, fontWeight: 500 }}>{label}</div>
        <div
          style={{
            fontSize: 11,
            color: "var(--color-text-secondary)",
            marginTop: 2,
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}

function DiskBar({
  mount,
  used,
  total,
}: {
  mount: string;
  used: number;
  total: number;
}) {
  const pct = (used / total) * 100;
  const barCol = pct >= 90 ? "#A32D2D" : pct >= 75 ? "#BA7517" : "#1D9E75";
  return (
    <div style={{ padding: "12px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon
            name="disk"
            size={14}
            style={{ color: "var(--color-text-tertiary)" }}
          />
          <span className="mono" style={{ fontSize: 12 }}>
            {mount}
          </span>
        </div>
        <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>
          <strong>{used} GB</strong> / {total} GB · {pct.toFixed(1)}%
        </span>
      </div>
      <div className="progress">
        <div
          className="progress-fill"
          style={{ width: pct + "%", background: barCol }}
        />
      </div>
    </div>
  );
}

export default function StatusPage() {
  const navigate = useNavigate();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { data: metrics } = useSystemMetrics(autoRefresh);

  const containers: DockerContainer[] = metrics?.docker.containers ?? [];

  const chartOptions: EChartsOption = {
    animation: false,
    grid: { top: 12, right: 10, bottom: 28, left: 32 },
    xAxis: { type: "category", show: false },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      splitLine: { lineStyle: { color: "#F0EFEC" } },
      axisLabel: { fontSize: 10, color: "#A49DAE" },
    },
    tooltip: {
      trigger: "axis",
      valueFormatter: (v) => (v as number).toFixed(1) + "%",
    },
    series: [
      {
        type: "line",
        name: "CPU",
        data: metrics?.cpuTrend ?? [],
        lineStyle: { color: "#378ADD", width: 1.5 },
        itemStyle: { color: "#378ADD" },
        symbol: "none",
      },
      {
        type: "line",
        name: "記憶體",
        data: metrics?.memoryTrend ?? [],
        lineStyle: { color: "#BA7517", width: 1.5 },
        itemStyle: { color: "#BA7517" },
        symbol: "none",
      },
      {
        type: "line",
        name: "GPU",
        data: metrics?.gpuTrend ?? [],
        lineStyle: { color: "#1D9E75", width: 1.5 },
        itemStyle: { color: "#1D9E75" },
        symbol: "none",
      },
    ],
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">系統營運</div>
          <h1 className="page-title">系統狀態</h1>
          <p className="page-desc">
            主機資源、Docker 容器、磁碟與網路即時遙測。每 5 秒自動更新。
          </p>
        </div>
        <div className="page-actions">
          <div
            className="pill pill-neutral"
            style={{ height: 30, padding: "0 12px" }}
          >
            <Icon name="clock" size={12} />
            <span style={{ marginLeft: 4 }}>運行時間 32 天 4 小時</span>
          </div>
          <button
            className={"btn " + (autoRefresh ? "btn-secondary" : "btn-ghost")}
            onClick={() => setAutoRefresh((a) => !a)}
          >
            <Icon name={autoRefresh ? "pause" : "play"} size={12} />
            {autoRefresh ? "暫停更新" : "繼續更新"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/network")}
          >
            <Icon name="network" size={13} /> 網路設定
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/service")}
          >
            <Icon name="upload" size={13} /> 部署套件
          </button>
        </div>
      </div>

      <div className="section-label" style={{ marginTop: 8 }}>
        主機資源
      </div>
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(5, 1fr)", marginBottom: 18 }}
      >
        <div
          className="card"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <Gauge
            value={metrics?.cpu.usagePercent ?? 0}
            label="CPU 使用率"
            sub={metrics ? `${metrics.cpu.coreCount} 核心` : "載入中…"}
          />
        </div>
        <div
          className="card"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <Gauge
            value={metrics?.memory.usagePercent ?? 0}
            label="記憶體"
            sub={
              metrics
                ? `${metrics.memory.usedGB.toFixed(1)} / ${metrics.memory.totalGB} GB`
                : "載入中…"
            }
          />
        </div>
        <div
          className="card"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <Gauge
            value={metrics?.gpu?.usagePercent ?? 0}
            label="GPU"
            sub={metrics?.gpu ? `${metrics.gpu.model}` : "N/A"}
          />
        </div>
        <div
          className="card"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <Gauge value={58} label="磁碟總用量" sub="3 個掛載點" />
        </div>
        <div
          className="card"
          style={{
            padding: 16,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div className="stat-label">網路狀態</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 8,
              }}
            >
              <Icon name="wifi" size={16} style={{ color: "#1D9E75" }} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>已連線</span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--color-text-secondary)",
                marginTop: 2,
              }}
            >
              eno1 · 1 Gbps
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 12,
              fontSize: 11,
            }}
          >
            <div>
              <div
                style={{
                  color: "var(--color-text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontSize: 10,
                }}
              >
                ↓ 接收
              </div>
              <div style={{ fontWeight: 500, marginTop: 2 }}>2.4 MB/s</div>
            </div>
            <div>
              <div
                style={{
                  color: "var(--color-text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontSize: 10,
                }}
              >
                ↑ 傳送
              </div>
              <div style={{ fontWeight: 500, marginTop: 2 }}>0.8 MB/s</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card card-padded" style={{ marginBottom: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <h2 className="card-title">過去 30 分鐘趨勢</h2>
          <div
            style={{
              display: "flex",
              gap: 12,
              fontSize: 11,
              color: "var(--color-text-secondary)",
            }}
          >
            {[
              ["#378ADD", "CPU"],
              ["#BA7517", "記憶體"],
              ["#1D9E75", "GPU"],
            ].map(([c, n]) => (
              <span
                key={n}
                style={{ display: "flex", alignItems: "center", gap: 4 }}
              >
                <span className="dot" style={{ background: c }} /> {n}
              </span>
            ))}
          </div>
        </div>
        <ReactECharts option={chartOptions} style={{ height: 180 }} />
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
          gap: 16,
          marginBottom: 18,
        }}
      >
        <div className="card card-padded">
          <h2 className="card-title" style={{ marginBottom: 4 }}>
            磁碟使用
          </h2>
          <DiskBar mount="/doc" used={142} total={500} />
          <DiskBar mount="/dat" used={812} total={2000} />
          <DiskBar mount="/" used={68} total={120} />
          <div
            style={{ borderTop: "0.5px solid rgba(0,0,0,.09)", marginTop: 4 }}
          >
            <DiskBar mount="總計" used={1022} total={2620} />
          </div>
        </div>
        <div className="card card-padded">
          <h2 className="card-title">GPU 記憶體</h2>
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 8,
              }}
            >
              <span className="mono" style={{ fontSize: 12 }}>
                NVIDIA RTX A2000
              </span>
              <span
                style={{ fontSize: 11, color: "var(--color-text-secondary)" }}
              >
                <strong>4,920 MB</strong> / 6,144 MB
              </span>
            </div>
            <div className="progress" style={{ height: 10 }}>
              <div className="progress-fill warn" style={{ width: "80.1%" }} />
            </div>
          </div>
          <div
            className="grid"
            style={{ gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}
          >
            <div>
              <div className="stat-label">驅動程式</div>
              <div style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>
                550.54.15
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-text-tertiary)",
                  marginTop: 1,
                }}
              >
                CUDA 12.4
              </div>
            </div>
            <div>
              <div className="stat-label">GPU 溫度</div>
              <div style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>
                62°C
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-text-tertiary)",
                  marginTop: 1,
                }}
              >
                風扇 48%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div className="section-label" style={{ margin: 0 }}>
          Docker 容器 · {containers.length} 個
        </div>
        <button className="btn btn-ghost btn-sm">
          <Icon name="refresh" size={12} /> 刷新清單
        </button>
      </div>
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
      >
        {containers.map((c: DockerContainer) => {
          const variant =
            c.status === "running"
              ? "success"
              : c.status === "restarting"
                ? "warning"
                : "error";
          const label =
            c.status === "running"
              ? "運行中"
              : c.status === "restarting"
                ? "重啟中"
                : "已停止";
          return (
            <div key={c.name} className="card" style={{ padding: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.name}
                  </div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 11,
                      color: "var(--color-text-tertiary)",
                      marginTop: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.health ?? "--"}
                  </div>
                </div>
                <StatusPill variant={variant} dot>
                  {label}
                </StatusPill>
              </div>
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                {[
                  ["CPU", (c.resources?.cpuPercent.toFixed(1) ?? "0") + "%"],
                  [
                    "記憶體",
                    (c.resources?.memoryUsageMB ?? 0).toFixed(0) + " MB",
                  ],
                  ["運行", c.uptime],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--color-text-tertiary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {k}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        marginTop: 2,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 10,
                  paddingTop: 10,
                  borderTop: "0.5px solid rgba(0,0,0,.06)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: 11, color: "var(--color-text-secondary)" }}
                >
                  {c.health ?? "--"}
                </span>
                <div style={{ display: "flex", gap: 4 }}>
                  <button className="btn btn-ghost btn-sm" title="重啟">
                    <Icon name="refresh" size={12} />
                  </button>
                  <button className="btn btn-ghost btn-sm" title="日誌">
                    <Icon name="doc" size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
