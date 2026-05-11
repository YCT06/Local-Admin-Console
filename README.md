# Local Admin Console — 本地管理控制台

本地伺服器管理 Web 介面，提供系統狀態監控、使用者與角色管理、網路設定、服務套件部署及稽核日誌等功能。

## 功能頁面

| 路由         | 頁面         | 說明                                  |
| ------------ | ------------ | ------------------------------------- |
| `/dashboard` | 主控台       | 系統摘要、資源概覽、快速入口          |
| `/status`    | 系統狀態     | CPU / 記憶體 / GPU 趨勢圖、容器健康度 |
| `/users`     | 使用者管理   | 帳號 CRUD、停用、搜尋篩選             |
| `/roles`     | 角色權限     | 角色定義、細粒度權限設定              |
| `/password`  | 密碼政策     | 密碼規則、複雜度設定                  |
| `/network`   | 網路設定     | 網卡清單、IP 設定                     |
| `/service`   | 服務套件部署 | 套件上傳、版本管理                    |
| `/sessions`  | 工作階段管理 | 在線工作階段查看、強制登出            |
| `/audit`     | 稽核日誌     | 操作紀錄、篩選與匯出                  |

## 技術選型

| 分類       | 技術                                                  |
| ---------- | ----------------------------------------------------- |
| 核心框架   | React 19 + TypeScript                                 |
| 建構工具   | Vite                                                  |
| UI 元件庫  | Chakra UI v2（僅用於 Modal）                          |
| 樣式系統   | CSS Design Tokens（`tokens.css` / `tokens-dark.css`） |
| HTTP 請求  | Axios（含 JWT interceptor）                           |
| 圖表       | Highcharts（趨勢折線圖）、純 SVG（Gauge / MiniSpark） |
| 全域狀態   | Zustand（auth、UI 偏好）                              |
| 伺服器狀態 | TanStack Query                                        |
| 路由       | React Router v7                                       |
| 多語系     | react-i18next（zh-TW / en-US）                        |
| 表單驗證   | React Hook Form                                       |
| 動畫       | Framer Motion                                         |

## 目錄結構

```
src/
├── api/            # Axios 封裝 + Mock 資料
├── components/     # 共用 UI 元件（Icon, StatusPill, MiniSpark）
├── i18n/           # 多語系（zh-TW.json, en-US.json）
├── layouts/        # MainLayout、Sidebar、Topbar
├── pages/          # 各功能頁面（*Page.tsx）
├── stores/         # Zustand（authStore, uiStore）
├── styles/         # tokens.css, tokens-dark.css, styles.css
└── types/          # TypeScript 型別定義
```

## 快速開始

```bash
# 安裝相依套件
npm install

# 啟動開發伺服器
npm run dev

# 建構正式版本
npm run build

# 預覽正式版本
npm run preview
```

開發伺服器預設位址：`http://localhost:5173`

## 登入資訊（Mock）

目前 API 層使用 Mock 資料，可直接使用任意帳號密碼登入進行開發與展示。  
切換真實 API 只需修改 `src/api/` 各檔案中的 `TODO` 註解行。

## 多語系

預設語言為繁體中文（`zh-TW`），可透過 Topbar 切換為英文（`en-US`）。語言偏好由 i18next 自動存入 `localStorage`。

## 主題

支援亮色 / 暗色主題，透過 CSS Design Tokens 切換，設定存於 `uiStore`。
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
