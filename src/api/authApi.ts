import type { LoginCredentials, LoginResult } from '../types/user';

export async function login(creds: LoginCredentials): Promise<LoginResult> {
  // TODO: return client.post('/auth/login', creds).then(r => r.data)
  await new Promise(r => setTimeout(r, 600));
  if (!creds.username || !creds.password) throw new Error('請輸入帳號與密碼');
  return {
    token: 'mock-jwt-token',
    user: {
      username: creds.username,
      displayName: '系統管理員',
      initials: creds.username.slice(0, 1).toUpperCase(),
      role: '超級管理員',
    },
  };
}
