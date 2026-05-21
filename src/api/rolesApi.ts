import client from "./client";
import type {
  RoleDetailDto,
  PermissionDto,
  CreateRoleRequest,
  UpdateRoleRequest,
} from "../types/role";

export async function getRoles(): Promise<RoleDetailDto[]> {
  const { data } = await client.get<RoleDetailDto[]>("/roles");
  return data;
}

export async function getRoleById(id: string): Promise<RoleDetailDto> {
  const { data } = await client.get<RoleDetailDto>(`/roles/${id}`);
  return data;
}

export async function createRole(
  request: CreateRoleRequest,
): Promise<RoleDetailDto> {
  const { data } = await client.post<RoleDetailDto>("/roles", request);
  return data;
}

export async function updateRole(
  id: string,
  request: UpdateRoleRequest,
): Promise<RoleDetailDto> {
  const { data } = await client.put<RoleDetailDto>(`/roles/${id}`, request);
  return data;
}

export async function deleteRole(id: string): Promise<void> {
  await client.delete(`/roles/${id}`);
}

export async function getPermissions(): Promise<PermissionDto[]> {
  const { data } = await client.get<PermissionDto[]>("/permissions");
  return data;
}
