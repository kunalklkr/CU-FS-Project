import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiUsers, FiFileText, FiShield } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <div className="logo">
              <div className="logo-icon">
                <div className="logo-shield">
                  <div className="shield-layer shield-back"></div>
                  <div className="shield-layer shield-front"></div>
                  <div className="shield-check">✓</div>
                </div>
              </div>
            </div>
            <span className="brand-text">
              <span className="brand-main">Role Based</span>
              <span className="brand-sub">Access Control</span>
            </span>
          </Link>

          <div className="navbar-links">
            <Link to="/posts" className="nav-link">
              <FiFileText size={18} />
              <span>Posts</span>
            </Link>

            {hasPermission('users', 'read') && (
              <Link to="/users" className="nav-link">
                <FiUsers size={18} />
                <span>Users</span>
              </Link>
            )}

            {hasPermission('admin', 'access:panel') && (
              <Link to="/admin" className="nav-link">
                <FiShield size={18} />
                <span>Admin</span>
              </Link>
            )}
          </div>

          <div className="navbar-user">
            <div className="user-info">
              <FiUser size={18} />
              <div>
                <div className="user-name">{user.name}</div>
                <div className={`badge badge-${user.role.toLowerCase()}`}>
                  {user.role}
                </div>
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
