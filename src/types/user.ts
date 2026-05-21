export type AuthType = "local" | "ldap";

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string | null;
  authType: AuthType;
  isActive: boolean;
  roles: string[];
  preferredLocale: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
  authType?: AuthType;
}

export interface LoginResponse {
  token: string;
  refreshToken: string | null;
  displayName: string;
  expiresAt: string;
  preferredLocale: string | null;
  roles: string[];
  permissions: string[];
}

export interface RefreshTokenResponse {
  token: string;
  expiresAt: string;
}

export interface SessionUser {
  username: string;
  displayName: string;
  initials: string;
  roles: string[];
  permissions: string[];
  preferredLocale: string | null;
}
