import type { User } from '../types/user';
import { MOCK_USERS } from './mock';

export async function getUsers(): Promise<User[]> {
  // TODO: return client.get('/users').then(r => r.data)
  return Promise.resolve([...MOCK_USERS]);
}

export async function createUser(data: Partial<User>): Promise<User> {
  // TODO: return client.post('/users', data).then(r => r.data)
  return Promise.resolve({ id: Date.now(), isActive: true, roles: [], locale: 'zh-TW', lastLogin: '—', authType: 'local', email: '', displayName: '', username: '', ...data } as User);
}

export async function updateUser(id: number, data: Partial<User>): Promise<User> {
  // TODO: return client.put(`/users/${id}`, data).then(r => r.data)
  const user = MOCK_USERS.find(u => u.id === id)!;
  return Promise.resolve({ ...user, ...data });
}

export async function deactivateUser(_id: number): Promise<void> {
  // TODO: return client.delete(`/users/${_id}`).then(() => {})
  return Promise.resolve();
}
