import type { Role, PermissionGroup } from '../types/role';
import { MOCK_ROLES, PERMISSION_GROUPS, MOCK_ROLE_PERMS } from './mock';

export async function getRoles(): Promise<Role[]> {
  // TODO: return client.get('/roles').then(r => r.data)
  return Promise.resolve([...MOCK_ROLES]);
}

export async function getPermissionGroups(): Promise<PermissionGroup[]> {
  return Promise.resolve(PERMISSION_GROUPS);
}

export async function getRolePerms(roleId: string): Promise<string[]> {
  // TODO: return client.get(`/roles/${roleId}/perms`).then(r => r.data)
  return Promise.resolve(MOCK_ROLE_PERMS[roleId] ?? []);
}

export async function updateRolePerms(_roleId: string, _perms: string[]): Promise<void> {
  // TODO: return client.put(`/roles/${_roleId}/perms`, { perms: _perms }).then(() => {})
  return Promise.resolve();
}
