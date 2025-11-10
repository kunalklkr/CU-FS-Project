import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FiArrowLeft, FiEdit2, FiTrash2, FiUser, FiCalendar } from 'react-icons/fi';
import './Posts.css';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { canModify } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/posts/${id}`);
        setPost(response.data.post);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${id}`);
      navigate('/posts');
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

  if (error || !post) {
    return (
      <div className="container" style={{ marginTop: '40px' }}>
        <div className="alert alert-error">{error || 'Post not found'}</div>
        <Link to="/posts" className="btn btn-secondary">
          <FiArrowLeft size={18} />
          Back to Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <div className="post-detail">
        <Link to="/posts" className="btn btn-secondary btn-sm mb-3">
          <FiArrowLeft size={16} />
          Back to Posts
        </Link>

        <div className="card">
          <div className="post-detail-header">
            <div>
              <h1>{post.title}</h1>
              <div className="post-detail-meta">
                <div className="flex gap-2">
                  <FiUser size={16} />
                  <span>{post.author?.name}</span>
                </div>
                <div className="flex gap-2">
                  <FiCalendar size={16} />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {canModify(post.author?._id) && (
              <div className="post-detail-actions">
                <Link to={`/posts/${post._id}/edit`} className="btn btn-secondary">
                  <FiEdit2 size={18} />
                  Edit
                </Link>
                <button onClick={handleDelete} className="btn btn-danger">
                  <FiTrash2 size={18} />
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="post-detail-content">
            <p>{post.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
