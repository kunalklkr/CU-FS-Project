const User = require('../models/User');
const logger = require('../utils/logger');

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;

    let query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .select('-password -refreshTokens')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    logger.error('Get users error', {
      error: error.message,
      correlationId: req.correlationId
    });
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password -refreshTokens');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    logger.error('Get user error', {
      error: error.message,
      correlationId: req.correlationId
    });
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, isActive } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -refreshTokens');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    logger.info('User updated', {
      correlationId: req.correlationId,
      adminId: req.user.userId,
      targetUserId: user._id,
      changes: updateData
    });

    res.json({ user });
  } catch (error) {
    logger.error('Update user error', {
      error: error.message,
      correlationId: req.correlationId
    });
    res.status(500).json({ error: 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    logger.info('User deleted', {
      correlationId: req.correlationId,
      adminId: req.user.userId,
      deletedUserId: user._id
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Delete user error', {
      error: error.message,
      correlationId: req.correlationId
    });
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser
};
