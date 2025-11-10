import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FiEdit2, FiTrash2, FiSave, FiX, FiUserPlus } from 'react-icons/fi';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Viewer'
  });
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  const handleChange = (field, value) => {
    setEditingUser({ ...editingUser, [field]: value });
  };

  const handleSave = async () => {
    try {
      const response = await api.put(`/users/${editingUser._id}`, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        isActive: editingUser.isActive
      });

      setUsers(users.map(u => u._id === editingUser._id ? response.data.user : u));
      setEditingUser(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      setSuccess('User deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/auth/register', newUser);
      setSuccess('User created successfully!');
      setShowCreateForm(false);
      setNewUser({ name: '', email: '', password: '', role: 'Viewer' });
      fetchUsers(); // Refresh the user list
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
    }
  };

  const handleNewUserChange = (field, value) => {
    setNewUser({ ...newUser, [field]: value });
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
          <h1>Users</h1>
          <p className="text-secondary">Manage user accounts and roles</p>
        </div>
        {hasPermission('users', 'create') && (
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)} 
            className="btn btn-primary"
          >
            <FiUserPlus size={18} />
            {showCreateForm ? 'Cancel' : 'Create User'}
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showCreateForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '24px' }}>Create New User</h3>
          <form onSubmit={handleCreateUser}>
            <div className="user-form-grid">
              <div className="input-group">
                <label>Name</label>
                <input
                  type="text"
                  className="input"
                  value={newUser.name}
                  onChange={(e) => handleNewUserChange('name', e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  className="input"
                  value={newUser.email}
                  onChange={(e) => handleNewUserChange('email', e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  className="input"
                  value={newUser.password}
                  onChange={(e) => handleNewUserChange('password', e.target.value)}
                  placeholder="Enter password (min 6 characters)"
                  minLength="6"
                  required
                />
              </div>

              <div className="input-group">
                <label>Role</label>
                <select
                  className="input select"
                  value={newUser.role}
                  onChange={(e) => handleNewUserChange('role', e.target.value)}
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Editor">Editor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: '24px' }}>
              <button 
                type="button" 
                onClick={() => {
                  setShowCreateForm(false);
                  setNewUser({ name: '', email: '', password: '', role: 'Viewer' });
                  setError('');
                }} 
                className="btn btn-secondary"
              >
                <FiX size={18} />
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <FiUserPlus size={18} />
                Create User
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                {hasPermission('users', 'update') && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  {editingUser?._id === user._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          className="input"
                          value={editingUser.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          className="input"
                          value={editingUser.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          className="input select"
                          value={editingUser.role}
                          onChange={(e) => handleChange('role', e.target.value)}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Editor">Editor</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                      </td>
                      <td>
                        <select
                          className="input select"
                          value={editingUser.isActive}
                          onChange={(e) => handleChange('isActive', e.target.value === 'true')}
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="table-actions">
                          <button onClick={handleSave} className="btn btn-primary btn-sm">
                            <FiSave size={14} />
                          </button>
                          <button onClick={handleCancel} className="btn btn-secondary btn-sm">
                            <FiX size={14} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td><strong>{user.name}</strong></td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge badge-${user.role.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${user.isActive ? 'badge-published' : 'badge-archived'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      {hasPermission('users', 'update') && (
                        <td>
                          <div className="table-actions">
                            <button
                              onClick={() => handleEdit(user)}
                              className="btn btn-secondary btn-sm"
                            >
                              <FiEdit2 size={14} />
                            </button>
                            {hasPermission('users', 'delete') && (
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="btn btn-danger btn-sm"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
