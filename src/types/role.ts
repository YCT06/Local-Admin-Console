export interface Role {
  id: string;
  name: string;
  members: number;
  description: string;
  system: boolean;
}

export interface Permission {
  key: string;
  label: string;
}

export interface PermissionGroup {
  group: string;
  perms: Permission[];
}

export type RolePerms = Record<string, Set<string>>;
