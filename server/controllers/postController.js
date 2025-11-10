const Post = require('../models/Post');
const { hasPermission } = require('../config/permissions');
const logger = require('../utils/logger');

const getPosts = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};

    // Data scoping based on role
    if (!hasPermission(role, 'posts', 'read:all')) {
      query.author = userId;
    }

    if (status) {
      query.status = status;
    }

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    logger.error('Get posts error', {
      error: error.message,
      correlationId: req.correlationId
    });
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

const getPost = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { id } = req.params;

    const post = await Post.findById(id).populate('author', 'name email');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user can read this post
    if (!hasPermission(role, 'posts', 'read:all') && post.author._id.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ post });
  } catch (error) {
    logger.error('Get post error', {
      error: error.message,
      correlationId: req.correlationId
    });
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

const createPost = async (req, res) => {
  try {
    // Log request body for debugging
    logger.info('Create post request', {
      correlationId: req.correlationId,
      body: req.body,
      userId: req.user.userId
    });

    const { title, content, status, tags } = req.body;
    const { userId } = req.user;

    const post = await Post.create({
      title,
      content,
      status: status || 'draft',
      tags: tags || [],
      author: userId
    });

    await post.populate('author', 'name email');

    logger.info('Post created', {
      correlationId: req.correlationId,
      userId,
      postId: post._id
    });

    res.status(201).json({ post });
  } catch (error) {
    logger.error('Create post error', {
      error: error.message,
      stack: error.stack,
      correlationId: req.correlationId
    });
    res.status(500).json({ error: 'Failed to create post' });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status, tags } = req.body;

    const post = await Post.findByIdAndUpdate(
      id,
      { title, content, status, tags },
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    logger.info('Post updated', {
      correlationId: req.correlationId,
      userId: req.user.userId,
      postId: post._id
    });

    res.json({ post });
  } catch (error) {
    logger.error('Update post error', {
      error: error.message,
      correlationId: req.correlationId
    });
    res.status(500).json({ error: 'Failed to update post' });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    logger.info('Post deleted', {
      correlationId: req.correlationId,
      userId: req.user.userId,
      postId: post._id
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    logger.error('Delete post error', {
      error: error.message,
      correlationId: req.correlationId
    });
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
};
