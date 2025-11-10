const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  tags: [String]
}, {
  timestamps: true
});

// Index for efficient queries
postSchema.index({ author: 1, status: 1 });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
