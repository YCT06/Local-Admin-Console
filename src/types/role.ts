export interface PermissionDto {
  id: string;
  code: string;
  displayName: string;
  description: string | null;
  category: string;
}

export interface RoleDetailDto {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  isSystemRole: boolean;
  isActive: boolean;
  permissions: PermissionDto[];
  menuItemIds: string[];
}

export interface CreateRoleRequest {
  name: string;
  displayName: string;
  description: string | null;
  permissionIds: string[];
  menuItemIds: string[];
}

export interface UpdateRoleRequest {
  displayName: string;
  description: string | null;
  isActive: boolean;
  permissionIds: string[];
  menuItemIds: string[];
}

// 前端 UI 用：將 PermissionDto[] 依 category 分組顯示
export interface PermissionGroup {
  group: string;
  perms: { key: string; label: string }[];
}

export type RolePerms = Record<string, Set<string>>;
