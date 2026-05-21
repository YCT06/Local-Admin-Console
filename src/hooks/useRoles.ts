import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoles,
  getPermissions,
  createRole,
  updateRole,
  deleteRole,
} from "../api/rolesApi";
import type { CreateRoleRequest, UpdateRoleRequest } from "../types/role";

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateRoleRequest) => createRole(request),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] }),
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateRoleRequest }) =>
      updateRole(id, request),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] }),
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] }),
  });
}
