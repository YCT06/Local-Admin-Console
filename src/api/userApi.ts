import client from "./client";

export interface UserListItem {
  id: string;
  username: string;
  displayName: string;
  email: string | null;
  authType: string;
  isActive: boolean;
  preferredLocale: string | null;
  roles: string[];
}

export interface RoleOption {
  name: string;
  displayName: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  displayName: string;
  email: string | null;
  authType: string;
  isActive: boolean;
  preferredLocale: string | null;
  roles: string[];
}

export interface UpdateUserRequest {
  displayName: string;
  email: string | null;
  isActive: boolean;
  preferredLocale: string | null;
  roles: string[];
}

export async function getUsers(): Promise<UserListItem[]> {
  const { data } = await client.get<UserListItem[]>("/users");
  return data;
}

export async function getRoleOptions(): Promise<RoleOption[]> {
  const { data } = await client.get<RoleOption[]>("/users/roles");
  return data;
}

export async function createUser(
  request: CreateUserRequest,
): Promise<UserListItem> {
  const { data } = await client.post<UserListItem>("/users", request);
  return data;
}

export async function updateUser(
  id: string,
  request: UpdateUserRequest,
): Promise<UserListItem> {
  const { data } = await client.put<UserListItem>(`/users/${id}`, request);
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  await client.delete(`/users/${id}`);
}
