import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import './Posts.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { hasPermission, canModify } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data.posts);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete post');
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
    <div className="posts-page">
      <div className="posts-background"></div>
      <div className="container" style={{ marginTop: '40px', position: 'relative', zIndex: 1 }}>
        <div className="page-header">
          <div>
            <h1>Posts</h1>
            <p className="text-secondary">Share your thoughts with the world</p>
          </div>
          {hasPermission('posts', 'create') && (
            <Link to="/posts/new" className="btn btn-primary">
              <FiPlus size={18} />
              Create Post
            </Link>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {posts.length === 0 ? (
          <div className="card text-center empty-state">
            <p className="text-secondary">No posts yet. Be the first to create one!</p>
            {hasPermission('posts', 'create') && (
              <Link to="/posts/new" className="btn btn-primary" style={{ marginTop: '20px' }}>
                <FiPlus size={18} />
                Create Your First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map(post => (
              <div key={post._id} className="post-card card">
                <div className="post-header">
                  <h3>{post.title}</h3>
                </div>

                <p className="post-content">{post.content}</p>

                <div className="post-meta">
                  <div>
                    <span className="text-secondary">By </span>
                    <strong>{post.author?.name}</strong>
                  </div>
                  <span className="text-secondary">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="post-actions">
                  <Link to={`/posts/${post._id}`} className="btn btn-secondary btn-sm">
                    <FiEye size={16} />
                    View
                  </Link>

                  {canModify(post.author?._id) && (
                    <>
                      <Link to={`/posts/${post._id}/edit`} className="btn btn-secondary btn-sm">
                        <FiEdit2 size={16} />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="btn btn-danger btn-sm"
                      >
                        <FiTrash2 size={16} />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
