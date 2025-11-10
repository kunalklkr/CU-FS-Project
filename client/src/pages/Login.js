import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock } from 'react-icons/fi';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/posts');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-shield-large">
              <div className="shield-layer shield-back"></div>
              <div className="shield-layer shield-front"></div>
              <div className="shield-check">✓</div>
            </div>
          </div>
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Role Based Access Control</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>
              <FiMail size={16} style={{ marginRight: '8px' }} />
              Email
            </label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="input-group">
            <label>
              <FiLock size={16} style={{ marginRight: '8px' }} />
              Password
            </label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="text-secondary">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>

        <div className="demo-accounts">
          <p className="text-secondary" style={{ fontSize: '13px', marginBottom: '8px' }}>
            Demo Accounts:
          </p>
          <div className="demo-list">
            <div className="demo-item">
              <span className="badge badge-admin">Admin</span>
              <span>admin@example.com / admin123</span>
            </div>
            <div className="demo-item">
              <span className="badge badge-editor">Editor</span>
              <span>editor1@example.com / editor123</span>
            </div>
            <div className="demo-item">
              <span className="badge badge-viewer">Viewer</span>
              <span>viewer@example.com / viewer123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
