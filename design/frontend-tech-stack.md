# 前端技術選型（React）

## 技術選型表

| 功能分類           | 技術選擇                     |
| ------------------ | ---------------------------- |
| **核心框架**       | React                        |
| **語言**           | TypeScript                   |
| **建構工具**       | Vite                         |
| **UI 元件庫**      | Chakra UI v2                 |
| **HTTP 請求**      | Axios                        |
| **圖表**           | Highcharts（highcharts-react-official） |
| **全域狀態管理**   | Zustand（僅限本地/UI 狀態：auth token、locale、menu collapse） |
| **伺服器狀態管理** | TanStack Query（所有來自後端的資料）   |
| **路由**           | React Router                 |
| **多語系**         | react-i18next                |
| **表單驗證**       | React Hook Form              |
| **Pages 層**       | Pages（`*Page.tsx`）         |
| **可重用邏輯**     | Custom Hooks（`use*.ts`）    |
| **API 呼叫層**     | API Clients（`api/*.ts`）    |

---

## 專案目錄結構

```
src/
├── pages/          # 一頁面一檔案（*Page.tsx）
├── components/     # 可重用 UI 元件
├── hooks/          # Custom Hooks
├── api/            # API Clients（Axios 封裝）
├── stores/         # Zustand 全域狀態
├── types/          # TypeScript 型別定義
└── i18n/           # 多語系（react-i18next）
```
