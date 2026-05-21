import { useState, useMemo } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import Icon from "../components/Icon";
import {
  useRoles,
  usePermissions,
  useUpdateRole,
  useCreateRole,
  useDeleteRole,
} from "../hooks/useRoles";
import type {
  RoleDetailDto,
  PermissionGroup,
  CreateRoleRequest,
} from "../types/role";

type Matrix = Record<string, Set<string>>;

function buildMatrix(roles: RoleDetailDto[]): Matrix {
  const m: Matrix = {};
  for (const r of roles) m[r.id] = new Set(r.permissions.map((p) => p.id));
  return m;
}

// 將後端 PermissionDto[] 依 category 重組為前端分組
function groupPermissions(
  perms: import("../types/role").PermissionDto[],
): PermissionGroup[] {
  const map = new Map<string, { key: string; label: string }[]>();
  for (const p of perms) {
    if (!map.has(p.category)) map.set(p.category, []);
    map.get(p.category)!.push({ key: p.id, label: p.displayName });
  }
  return Array.from(map.entries()).map(([group, ps]) => ({ group, perms: ps }));
}

export default function RolesPage() {
  const { data: roles = [], isLoading } = useRoles();
  const { data: permissionsFlat = [] } = usePermissions();
  const updateRole = useUpdateRole();
  const createRole = useCreateRole();
  const deleteRole = useDeleteRole();

  const permissionGroups = groupPermissions(permissionsFlat);

  const [selected, setSelected] = useState<string>("");
  const [localMatrix, setLocalMatrix] = useState<Matrix | null>(null);
  const [dirty, setDirty] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const serverMatrix = useMemo(() => buildMatrix(roles), [roles]);
  const matrix = localMatrix ?? serverMatrix;

  const effectiveSelected = selected || roles[0]?.id || "";
  const current = roles.find((r) => r.id === effectiveSelected);

  function toggle(permId: string) {
    if (current?.isSystemRole) return;
    setLocalMatrix((m) => {
      const next = { ...(m ?? serverMatrix) };
      const set = new Set(next[effectiveSelected]);
      if (set.has(permId)) set.delete(permId);
      else set.add(permId);
      next[effectiveSelected] = set;
      return next;
    });
    setDirty(true);
  }

  function handleSave() {
    if (!current) return;
    updateRole.mutate({
      id: effectiveSelected,
      request: {
        displayName: current.displayName,
        description: current.description,
        isActive: current.isActive,
        permissionIds: Array.from(matrix[effectiveSelected] ?? []),
        menuItemIds: current.menuItemIds,
      },
    }, {
      onSuccess: () => {
        setLocalMatrix(null);
        setDirty(false);
      },
    });
  }

  function handleCancel() {
    setLocalMatrix(null);
    setDirty(false);
  }

  function handleCreateRole() {
    const req: CreateRoleRequest = {
      name: newRoleName,
      displayName: newRoleName,
      description: newRoleDesc || null,
      permissionIds: [],
      menuItemIds: [],
    };
    createRole.mutate(req);
    setNewRoleName("");
    setNewRoleDesc("");
    onClose();
  }

  if (isLoading || !current)
    return (
      <div className="page">
        <div
          style={{
            textAlign: "center",
            padding: 60,
            color: "var(--color-text-tertiary)",
          }}
        >
          載入中…
        </div>
      </div>
    );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">身分治理</div>
          <h1 className="page-title">角色與權限</h1>
          <p className="page-desc">
            以角色為單位調整功能模組與資料層級的存取授權。共 {roles.length}{" "}
            個角色。
          </p>
        </div>
        <div className="page-actions">
          {dirty && (
            <span
              style={{
                fontSize: 11,
                color: "var(--color-warning-accent)",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Icon name="alert" size={11} /> 有未儲存的變更
            </span>
          )}
          <button
            className="btn btn-secondary"
            disabled={!dirty}
            onClick={handleCancel}
          >
            取消變更
          </button>
          <button
            className="btn btn-primary"
            disabled={!dirty}
            onClick={handleSave}
          >
            <Icon name="check" size={13} /> 儲存權限
          </button>
        </div>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "minmax(260px, 300px) minmax(0, 1fr)",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* Role list */}
        <div className="card" style={{ padding: 0 }}>
          <div
            style={{
              padding: "12px 14px",
              borderBottom: "0.5px solid var(--color-border-tertiary)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="section-label" style={{ margin: 0 }}>
              角色清單
            </div>
            <button className="btn btn-ghost btn-sm" onClick={onOpen}>
              <Icon name="plus" size={12} /> 新增角色
            </button>
          </div>
          <div>
            {roles.map((r) => {
              const isActive = r.id === effectiveSelected;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelected(r.id)}
                  style={{
                    padding: "12px 14px",
                    cursor: "pointer",
                    background: isActive
                      ? "var(--color-brand-50)"
                      : "transparent",
                    borderLeft: isActive
                      ? "2px solid var(--color-brand-500)"
                      : "2px solid transparent",
                    transition: "background 0.12s linear",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLDivElement).style.background =
                        "var(--color-background-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLDivElement).style.background =
                        "transparent";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: isActive
                            ? "var(--color-brand-600)"
                            : "var(--color-text-primary)",
                        }}
                      >
                        {r.displayName}
                      </span>
                      {r.isSystemRole && (
                        <span
                          className="pill pill-neutral"
                          style={{ fontSize: 9 }}
                        >
                          系統
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--color-text-tertiary)",
                      }}
                    >
                      {r.permissions.length} 項權限
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--color-text-secondary)",
                      marginTop: 4,
                      lineHeight: 1.5,
                    }}
                  >
                    {r.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Permissions panel */}
        <div className="card card-padded">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div>
              <h2 className="card-title" style={{ fontSize: 16 }}>
                {current.displayName}
              </h2>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--color-text-secondary)",
                  marginTop: 4,
                  maxWidth: 460,
                }}
              >
                {current.description}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {!current.isSystemRole && (
                <>
                  <button className="btn btn-ghost btn-sm">
                    <Icon name="edit" size={12} /> 重新命名
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: "var(--color-error-text)" }}
                    onClick={() => deleteRole.mutate(current.id)}
                  >
                    <Icon name="trash" size={12} /> 刪除
                  </button>
                </>
              )}
            </div>
          </div>

          {current.isSystemRole && (
            <div className="notice" style={{ marginBottom: 14 }}>
              <Icon name="lock" size={14} />
              <span>
                系統角色的權限由平台預先定義，無法修改。如需自訂授權請新增自訂角色。
              </span>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {permissionGroups.map((g) => {
              const granted = g.perms.filter((p) =>
                matrix[effectiveSelected]?.has(p.key),
              ).length;
              return (
                <div
                  key={g.group}
                  style={{
                    border: "0.5px solid var(--color-border-tertiary)",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 14px",
                      background: "var(--color-background-secondary)",
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 500 }}>
                      {g.group}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {granted} / {g.perms.length} 已授權
                    </span>
                  </div>
                  {g.perms.map((p) => {
                    const checked = matrix[effectiveSelected]?.has(p.key) ?? false;
                    return (
                      <div
                        key={p.key}
                        onClick={() => toggle(p.key)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 14px",
                          borderTop: "0.5px solid rgba(0,0,0,.06)",
                          cursor: current.isSystemRole
                            ? "not-allowed"
                            : "pointer",
                          opacity: current.isSystemRole ? 0.7 : 1,
                          transition: "background 0.12s linear",
                        }}
                        onMouseEnter={(e) => {
                          if (!current.isSystemRole)
                            (
                              e.currentTarget as HTMLDivElement
                            ).style.background =
                              "var(--color-background-secondary)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.background =
                            "transparent";
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 12 }}>{p.label}</div>
                          <div
                            className="mono"
                            style={{
                              fontSize: 10,
                              color: "var(--color-text-tertiary)",
                              marginTop: 2,
                            }}
                          >
                            {p.key}
                          </div>
                        </div>
                        <span className={"toggle" + (checked ? " on" : "")} />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* New Role Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="rgba(8,6,13,0.32)" />
        <ModalContent
          borderRadius="10px"
          maxW="460px"
          border="0.5px solid var(--color-border-tertiary)"
        >
          <ModalHeader
            style={{
              fontSize: 14,
              fontWeight: 500,
              borderBottom: "0.5px solid var(--color-border-tertiary)",
              padding: "16px 18px",
            }}
          >
            新增自訂角色
          </ModalHeader>
          <ModalBody
            style={{
              padding: 18,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div className="field">
              <label className="field-label">角色名稱</label>
              <input
                className="input"
                placeholder="例如：機房巡檢員"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field-label">描述</label>
              <textarea
                className="input"
                placeholder="說明此角色的職責與授權範圍"
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter
            style={{
              borderTop: "0.5px solid var(--color-border-tertiary)",
              padding: "12px 18px",
              gap: 8,
            }}
          >
            <button className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button
              className="btn btn-primary"
              onClick={handleCreateRole}
              disabled={!newRoleName.trim()}
            >
              建立角色
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
