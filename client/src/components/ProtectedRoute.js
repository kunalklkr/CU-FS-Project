import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission) {
    const parts = requiredPermission.split(':');
    const resource = parts[0];
    const action = parts.slice(1).join(':');
    
    // Check if user has the required permission
    // For :own permissions, also check if user has :all permission
    let hasAccess = hasPermission(resource, action);
    
    // If checking for :own permission, also allow :all permission
    if (!hasAccess && action.endsWith(':own')) {
      const baseAction = action.replace(':own', ':all');
      hasAccess = hasPermission(resource, baseAction);
    }
    
    if (!hasAccess) {
      return (
        <div className="container" style={{ marginTop: '40px' }}>
          <div className="card text-center">
            <h2>Access Denied</h2>
            <p className="text-secondary">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
