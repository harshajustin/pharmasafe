import { UserRole, RBACConfig } from '../types';

// Define permissions for each role
export const RBAC_CONFIG: RBACConfig = {
  admin: {
    users: { read: true, write: true, delete: true },
    patients: { read: true, write: true, delete: true },
    medications: { read: true, write: true, delete: true },
    reports: { read: true, write: true, delete: true, execute: true },
    interactions: { read: true, write: true, delete: true, execute: true },
    audit: { read: true, write: true, delete: true },
    settings: { read: true, write: true, delete: true },
    dashboard: { read: true, write: true, delete: false },
  },
  doctor: {
    users: { read: false, write: false, delete: false },
    patients: { read: true, write: true, delete: false },
    medications: { read: true, write: true, delete: false },
    reports: { read: true, write: true, delete: false, execute: true },
    interactions: { read: true, write: true, delete: false, execute: true },
    audit: { read: true, write: false, delete: false },
    settings: { read: true, write: true, delete: false },
    dashboard: { read: true, write: false, delete: false },
  },
  nurse: {
    users: { read: false, write: false, delete: false },
    patients: { read: true, write: false, delete: false },
    medications: { read: true, write: false, delete: false },
    reports: { read: true, write: false, delete: false, execute: false },
    interactions: { read: true, write: false, delete: false, execute: false },
    audit: { read: true, write: false, delete: false },
    settings: { read: true, write: false, delete: false },
    dashboard: { read: true, write: false, delete: false },
  },
};

// Utility function to check if user has permission
export const hasPermission = (
  userRole: UserRole,
  resource: string,
  action: 'read' | 'write' | 'delete' | 'execute'
): boolean => {
  const rolePermissions = RBAC_CONFIG[userRole];
  const resourcePermissions = rolePermissions[resource];
  
  if (!resourcePermissions) {
    return false;
  }
  
  return resourcePermissions[action] || false;
};

// Check multiple permissions at once
export const hasAnyPermission = (
  userRole: UserRole,
  permissions: Array<{ resource: string; action: 'read' | 'write' | 'delete' | 'execute' }>
): boolean => {
  return permissions.some(({ resource, action }) => 
    hasPermission(userRole, resource, action)
  );
};

// Check if user can access a specific route
export const canAccessRoute = (userRole: UserRole, route: string): boolean => {
  const routePermissions: { [key: string]: { resource: string; action: 'read' | 'write' | 'delete' | 'execute' } } = {
    '/': { resource: 'dashboard', action: 'read' },
    '/patients': { resource: 'patients', action: 'read' },
    '/reports': { resource: 'reports', action: 'read' },
    '/audit': { resource: 'audit', action: 'read' },
    '/settings': { resource: 'settings', action: 'read' },
    '/users': { resource: 'users', action: 'read' },
  };

  const permission = routePermissions[route];
  if (!permission) {
    return false;
  }

  return hasPermission(userRole, permission.resource, permission.action);
};

// Get user's accessible routes
export const getAccessibleRoutes = (userRole: UserRole): string[] => {
  const allRoutes = ['/', '/patients', '/reports', '/audit', '/settings', '/users'];
  return allRoutes.filter(route => canAccessRoute(userRole, route));
};

// Role hierarchy for privilege escalation checks
export const ROLE_HIERARCHY: { [key in UserRole]: number } = {
  nurse: 1,
  doctor: 2,
  admin: 3,
};

// Check if user has higher or equal privilege
export const hasHigherOrEqualPrivilege = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

// Get role display name
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames = {
    admin: 'Administrator',
    doctor: 'Doctor',
    nurse: 'Nurse',
  };
  return roleNames[role];
};

// Get role color for UI
export const getRoleColor = (role: UserRole): string => {
  const roleColors = {
    admin: 'bg-purple-100 text-purple-800',
    doctor: 'bg-blue-100 text-blue-800',
    nurse: 'bg-green-100 text-green-800',
  };
  return roleColors[role];
};