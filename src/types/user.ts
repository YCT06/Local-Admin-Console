export type AuthType = 'local' | 'ldap';

export interface User {
  id: number;
  username: string;
  displayName: string;
  email: string;
  authType: AuthType;
  isActive: boolean;
  roles: string[];
  locale: string;
  lastLogin: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  authType: AuthType;
}

export interface LoginResult {
  token: string;
  user: SessionUser;
}

export interface SessionUser {
  username: string;
  displayName: string;
  initials: string;
  role: string;
}
