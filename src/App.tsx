import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useColorMode } from '@chakra-ui/react';
import { useAuthStore } from './stores/authStore';
import { useUiStore } from './stores/uiStore';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StatusPage from './pages/StatusPage';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import PasswordPage from './pages/PasswordPage';
import NetworkPage from './pages/NetworkPage';
import ServicePackPage from './pages/ServicePackPage';
import SessionsPage from './pages/SessionsPage';
import AuditPage from './pages/AuditPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth><MainLayout /></RequireAuth>,
    children: [
      { path: '/',          element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/status',    element: <StatusPage /> },
      { path: '/users',     element: <UsersPage /> },
      { path: '/roles',     element: <RolesPage /> },
      { path: '/password',  element: <PasswordPage /> },
      { path: '/network',   element: <NetworkPage /> },
      { path: '/service',   element: <ServicePackPage /> },
      { path: '/sessions',  element: <SessionsPage /> },
      { path: '/audit',     element: <AuditPage /> },
    ],
  },
]);

export default function App() {
  const { theme, density } = useUiStore();
  const { setColorMode } = useColorMode();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-density', density);
    setColorMode(theme);
  }, [theme, density, setColorMode]);

  return <RouterProvider router={router} />;
}
