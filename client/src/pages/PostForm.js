import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { FiSave, FiX } from 'react-icons/fi';
import './Posts.css';

const PostForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        const response = await api.get(`/posts/${id}`);
        const post = response.data.post;
        setFormData({
          title: post.title,
          content: post.content
        });
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch post');
      }
    };

    if (isEdit) {
      fetchPost();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        status: 'published', // Always published
        tags: [] // No tags
      };

      if (isEdit) {
        await api.put(`/posts/${id}`, postData);
      } else {
        await api.post('/posts', postData);
      }

      navigate('/posts');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <div className="post-form">
        <h1>{isEdit ? 'Edit Post' : 'Create Post'}</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="input-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                className="input"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter post title"
                required
              />
            </div>

            <div className="input-group">
              <label>Content</label>
              <textarea
                name="content"
                className="input textarea"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your content here..."
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/posts')}
                className="btn btn-secondary"
              >
                <FiX size={18} />
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <FiSave size={18} />
                {loading ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
