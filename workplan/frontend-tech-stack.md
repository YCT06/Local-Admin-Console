# 前端技術選型（React）

## 技術選型表

| 功能分類           | 技術選擇                                                       | 版本                                    |
| ------------------ | -------------------------------------------------------------- | --------------------------------------- |
| **核心框架**       | React                                                          | 19.2.5                                  |
| **語言**           | TypeScript                                                     | 6.0.2                                   |
| **建構工具**       | Vite                                                           | 8.0.10                                  |
| **UI 元件庫**      | Chakra UI v2                                                   | 2.10.9                                  |
| **HTTP 請求**      | Axios                                                          | 1.16.0                                  |
| **圖表**           | ECharts（echarts-for-react）                                   | echarts 6.0.0 / echarts-for-react 3.0.6 |
| **全域狀態管理**   | Zustand（僅限本地/UI 狀態：auth token、locale、menu collapse） | 5.0.13                                  |
| **伺服器狀態管理** | TanStack Query（所有來自後端的資料）                           | 5.100.9                                 |
| **路由**           | React Router                                                   | 7.15.0                                  |
| **多語系**         | react-i18next / i18next                                        | 17.0.7 / 26.0.10                        |
| **表單驗證**       | React Hook Form                                                | 7.75.0                                  |
| **Pages 層**       | Pages（`*Page.tsx`）                                           | —                                       |
| **可重用邏輯**     | Custom Hooks（`use*.ts`）                                      | —                                       |
| **API 呼叫層**     | API Clients（`api/*.ts`）                                      | —                                       |

---

## 專案目錄結構

```
src/
├── main.tsx
├── App.tsx
├── pages/                   # 一頁面一檔案（*Page.tsx）
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── StatusPage.tsx
│   ├── UsersPage.tsx
│   ├── RolesPage.tsx
│   ├── PasswordPage.tsx
│   ├── NetworkPage.tsx
│   ├── ServicePackPage.tsx
│   ├── SessionsPage.tsx
│   └── AuditPage.tsx
├── layouts/                 # App shell 佈局元件
│   ├── MainLayout.tsx
│   ├── Sidebar.tsx
│   └── Topbar.tsx
├── components/              # 可重用 UI 元件
│   ├── Icon.tsx
│   ├── MiniSpark.tsx
│   └── StatusPill.tsx
├── hooks/                   # Custom Hooks（TanStack Query 封裝）
│   ├── useAuth.ts
│   ├── useUsers.ts
│   ├── useRoles.ts
│   ├── useSystemMetrics.ts
│   ├── useNetwork.ts
│   └── useServicePack.ts
├── api/                     # API Clients（Axios 封裝）
│   ├── client.ts
│   ├── mock.ts
│   ├── authApi.ts
│   ├── userApi.ts
│   ├── rolesApi.ts
│   ├── systemApi.ts
│   ├── networkApi.ts
│   └── servicePackApi.ts
├── stores/                  # Zustand 全域狀態
│   ├── authStore.ts
│   └── uiStore.ts
├── types/                   # TypeScript 型別定義
│   ├── user.ts
│   ├── role.ts
│   ├── system.ts
│   └── audit.ts
├── i18n/                    # 多語系（react-i18next）
│   ├── index.ts
│   ├── zh-TW.json
│   └── en-US.json
├── styles/                  # Design system CSS
│   ├── tokens.css
│   ├── tokens-dark.css
│   └── styles.css
└── assets/                  # 靜態資源

```
