import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!authChecked) {
      checkAuth();
    }
  }, [authChecked]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setUser(null);
        setLoading(false);
        setAuthChecked(true);
        return;
      }

      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
      localStorage.removeItem('accessToken');
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    setUser(response.data.user);
    return response.data;
  };

  const register = async (email, password, name) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  const hasPermission = (resource, action) => {
    if (!user) return false;

    const permissions = {
      Admin: {
        posts: ['create', 'read', 'update', 'delete', 'read:all', 'update:all', 'delete:all'],
        users: ['create', 'read', 'update', 'delete', 'manage:roles'],
        admin: ['access:panel', 'view:logs']
      },
      Editor: {
        posts: ['create', 'read', 'read:all', 'update:own', 'delete:own'],
        users: ['read:own']
      },
      Viewer: {
        posts: ['read', 'read:all'],
        users: ['read:own']
      }
    };

    const rolePerms = permissions[user.role];
    if (!rolePerms) return false;

    const resourcePerms = rolePerms[resource];
    if (!resourcePerms) return false;

    return resourcePerms.includes(action);
  };

  const canModify = (resourceOwnerId) => {
    if (!user) return false;
    if (hasPermission('posts', 'update:all')) return true;
    if (hasPermission('posts', 'update:own') && resourceOwnerId === user._id) return true;
    return false;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    hasPermission,
    canModify
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
