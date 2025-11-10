import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FiActivity, FiUsers, FiFileText, FiShield } from 'react-icons/fi';
import './Admin.css';

const Admin = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [stats, setStats] = useState({ users: 0, posts: 0, logs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [logsRes, usersRes, postsRes] = await Promise.all([
        api.get('/audit?limit=10'),
        api.get('/users'),
        api.get('/posts')
      ]);

      setAuditLogs(logsRes.data.logs);
      setStats({
        users: usersRes.data.total,
        posts: postsRes.data.total,
        logs: logsRes.data.total
      });
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="text-secondary">System overview and audit logs</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon" style={{ background: 'rgba(0, 122, 255, 0.1)' }}>
            <FiUsers size={24} color="var(--color-primary)" />
          </div>
          <div>
            <div className="stat-value">{stats.users}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon" style={{ background: 'rgba(52, 199, 89, 0.1)' }}>
            <FiFileText size={24} color="var(--color-success)" />
          </div>
          <div>
            <div className="stat-value">{stats.posts}</div>
            <div className="stat-label">Total Posts</div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon" style={{ background: 'rgba(255, 149, 0, 0.1)' }}>
            <FiActivity size={24} color="var(--color-warning)" />
          </div>
          <div>
            <div className="stat-value">{stats.logs}</div>
            <div className="stat-label">Audit Logs</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '32px' }}>
        <div className="flex-between mb-3">
          <h2>Recent Activity</h2>
          <FiShield size={24} color="var(--color-text-secondary)" />
        </div>

        <div className="audit-logs">
          {auditLogs.length === 0 ? (
            <p className="text-secondary text-center">No audit logs found</p>
          ) : (
            auditLogs.map(log => (
              <div key={log._id} className="audit-log-item">
                <div className="audit-log-header">
                  <strong>{log.userId?.name || 'Unknown User'}</strong>
                  <span className="text-secondary">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="audit-log-details">
                  <span className="badge badge-editor">{log.action}</span>
                  <span className="text-secondary">{log.resource}</span>
                  {log.resourceId && (
                    <span className="text-secondary" style={{ fontSize: '12px' }}>
                      ID: {log.resourceId}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
