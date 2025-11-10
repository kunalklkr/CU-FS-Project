const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authenticate = require('../middleware/auth');
const { authorize, authorizeOwnership } = require('../middleware/authorize');
const { postValidation, idValidation } = require('../middleware/validation');
const auditLog = require('../middleware/audit');
const Post = require('../models/Post');

// Get post owner ID helper
const getPostOwnerId = async (req) => {
  const post = await Post.findById(req.params.id);
  return post?.author;
};

router.get('/', authenticate, authorize('posts', 'read'), postController.getPosts);

router.get('/:id', authenticate, idValidation, authorize('posts', 'read'), postController.getPost);

router.post(
  '/',
  authenticate,
  authorize('posts', 'create'),
  // postValidation, // Temporarily disabled for debugging
  auditLog('create', 'post'),
  postController.createPost
);

router.put(
  '/:id',
  authenticate,
  idValidation,
  authorizeOwnership('posts', 'update', getPostOwnerId),
  postValidation,
  auditLog('update', 'post'),
  postController.updatePost
);

router.delete(
  '/:id',
  authenticate,
  idValidation,
  authorizeOwnership('posts', 'delete', getPostOwnerId),
  auditLog('delete', 'post'),
  postController.deletePost
);

module.exports = router;
