import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import PostForm from './pages/PostForm';
import Users from './pages/Users';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route
              path="/posts"
              element={
                <ProtectedRoute requiredPermission="posts:read">
                  <Posts />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/posts/new"
              element={
                <ProtectedRoute requiredPermission="posts:create">
                  <PostForm />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/posts/:id"
              element={
                <ProtectedRoute requiredPermission="posts:read">
                  <PostDetail />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/posts/:id/edit"
              element={
                <ProtectedRoute requiredPermission="posts:update:own">
                  <PostForm />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/users"
              element={
                <ProtectedRoute requiredPermission="users:read">
                  <Users />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredPermission="admin:access:panel">
                  <Admin />
                </ProtectedRoute>
              }
            />
            
            <Route path="/" element={<Navigate to="/posts" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
