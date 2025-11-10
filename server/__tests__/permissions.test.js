const { hasPermission, canAccessOwn } = require('../config/permissions');

describe('Permissions', () => {
  describe('hasPermission', () => {
    it('should allow Admin to create posts', () => {
      expect(hasPermission('Admin', 'posts', 'create')).toBe(true);
    });

    it('should allow Editor to create posts', () => {
      expect(hasPermission('Editor', 'posts', 'create')).toBe(true);
    });

    it('should not allow Viewer to create posts', () => {
      expect(hasPermission('Viewer', 'posts', 'create')).toBe(false);
    });

    it('should allow Admin to manage users', () => {
      expect(hasPermission('Admin', 'users', 'manage:roles')).toBe(true);
    });

    it('should not allow Editor to manage users', () => {
      expect(hasPermission('Editor', 'users', 'manage:roles')).toBe(false);
    });

    it('should allow Admin to access admin panel', () => {
      expect(hasPermission('Admin', 'admin', 'access:panel')).toBe(true);
    });

    it('should not allow Viewer to access admin panel', () => {
      expect(hasPermission('Viewer', 'admin', 'access:panel')).toBe(false);
    });
  });

  describe('canAccessOwn', () => {
    const userId = 'user123';
    const otherUserId = 'user456';

    it('should allow Admin to update any post', () => {
      expect(canAccessOwn('Admin', 'posts', 'update', userId, otherUserId)).toBe(true);
    });

    it('should allow Editor to update own post', () => {
      expect(canAccessOwn('Editor', 'posts', 'update', userId, userId)).toBe(true);
    });

    it('should not allow Editor to update other post', () => {
      expect(canAccessOwn('Editor', 'posts', 'update', userId, otherUserId)).toBe(false);
    });

    it('should not allow Viewer to update any post', () => {
      expect(canAccessOwn('Viewer', 'posts', 'update', userId, userId)).toBe(false);
    });
  });
});
