// Role-based permission matrix
const PERMISSIONS = {
  ADMIN: {
    posts: ['create', 'read', 'update', 'delete', 'read:all', 'update:all', 'delete:all'],
    users: ['create', 'read', 'update', 'delete', 'manage:roles'],
    admin: ['access:panel', 'view:logs', 'manage:system']
  },
  EDITOR: {
    posts: ['create', 'read', 'read:all', 'update:own', 'delete:own'],
    users: ['read:own']
  },
  VIEWER: {
    posts: ['read', 'read:all'],
    users: ['read:own']
  }
};

const ROLES = {
  ADMIN: 'Admin',
  EDITOR: 'Editor',
  VIEWER: 'Viewer'
};

// Check if role has permission
const hasPermission = (role, resource, action) => {
  const rolePerms = PERMISSIONS[role.toUpperCase()];
  if (!rolePerms) return false;
  
  const resourcePerms = rolePerms[resource];
  if (!resourcePerms) return false;
  
  return resourcePerms.includes(action);
};

// Check ownership for :own permissions
const canAccessOwn = (role, resource, action, userId, resourceOwnerId) => {
  if (hasPermission(role, resource, `${action}:all`)) return true;
  if (hasPermission(role, resource, `${action}:own`) && userId === resourceOwnerId) return true;
  return false;
};

module.exports = {
  PERMISSIONS,
  ROLES,
  hasPermission,
  canAccessOwn
};
