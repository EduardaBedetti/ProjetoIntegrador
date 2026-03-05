// ========================
// RBAC - Role Based Access Control
// ========================

export type Role = 'ADMIN' | 'GESTOR' | 'USER'

export type Action = 'create' | 'read' | 'update' | 'delete' | 'review' | 'manage'

export type Resource =
  | 'processos'
  | 'conferencia'
  | 'ce-mercante'
  | 'relatorios'
  | 'usuarios'
  | 'configuracoes'
  | 'dashboard'

export interface Permission {
  resource: Resource
  actions: Action[]
}

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrador',
  GESTOR: 'Gestor',
  USER: 'Funcionario',
}

export const ROLE_COLORS: Record<Role, string> = {
  ADMIN: 'bg-purple-100 text-purple-700',
  GESTOR: 'bg-blue-100 text-blue-700',
  USER: 'bg-slate-100 text-slate-700',
}

// Definicao centralizada de permissoes por role
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    { resource: 'dashboard', actions: ['read'] },
    { resource: 'processos', actions: ['create', 'read', 'update', 'delete', 'review'] },
    { resource: 'conferencia', actions: ['create', 'read', 'update'] },
    { resource: 'ce-mercante', actions: ['create', 'read', 'update'] },
    { resource: 'relatorios', actions: ['read'] },
    { resource: 'usuarios', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'configuracoes', actions: ['read', 'update', 'manage'] },
  ],
  GESTOR: [
    { resource: 'dashboard', actions: ['read'] },
    { resource: 'processos', actions: ['read', 'update', 'review'] },
    { resource: 'conferencia', actions: ['read', 'update'] },
    { resource: 'ce-mercante', actions: ['read', 'update'] },
    { resource: 'relatorios', actions: ['read'] },
  ],
  USER: [
    { resource: 'dashboard', actions: ['read'] },
    { resource: 'processos', actions: ['create', 'read', 'update'] },
    { resource: 'conferencia', actions: ['read'] },
    { resource: 'ce-mercante', actions: ['read', 'update'] },
  ],
}

export function getPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || []
}

export function hasPermission(role: Role, resource: Resource, action: Action): boolean {
  const permissions = getPermissions(role)
  const resourcePermission = permissions.find((p) => p.resource === resource)
  if (!resourcePermission) return false
  return resourcePermission.actions.includes(action)
}

export function hasAccess(role: Role, resource: Resource): boolean {
  const permissions = getPermissions(role)
  return permissions.some((p) => p.resource === resource)
}

// Mapeamento de rotas para resources (para protecao de rotas)
export const ROUTE_RESOURCE_MAP: Record<string, Resource> = {
  '/': 'dashboard',
  '/processos': 'processos',
  '/processos/novo': 'processos',
  '/conferencia': 'conferencia',
  '/ce-mercante': 'ce-mercante',
  '/relatorios': 'relatorios',
  '/usuarios': 'usuarios',
  '/configuracoes': 'configuracoes',
}
