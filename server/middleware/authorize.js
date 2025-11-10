const { hasPermission } = require('../config/permissions');
const logger = require('../utils/logger');

// Middleware factory for permission checks
const authorize = (resource, action) => {
  return (req, res, next) => {
    const { role, userId } = req.user;

    if (!hasPermission(role, resource, action)) {
      logger.warn('Authorization denied', {
        correlationId: req.correlationId,
        userId,
        role,
        resource,
        action,
        path: req.path
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: `You don't have permission to ${action} ${resource}`
      });
    }

    next();
  };
};

// Check if user can access specific resource (ownership check)
const authorizeOwnership = (resource, action, getOwnerId) => {
  return async (req, res, next) => {
    const { role, userId } = req.user;

    // Admins can access everything
    if (hasPermission(role, resource, `${action}:all`)) {
      return next();
    }

    // Check ownership for :own permissions
    if (hasPermission(role, resource, `${action}:own`)) {
      try {
        const ownerId = await getOwnerId(req);
        
        if (ownerId && ownerId.toString() === userId) {
          return next();
        }
      } catch (error) {
        logger.error('Ownership check error', {
          error: error.message,
          correlationId: req.correlationId
        });
      }
    }

    logger.warn('Authorization denied: Ownership check failed', {
      correlationId: req.correlationId,
      userId,
      role,
      resource,
      action
    });

    return res.status(403).json({
      error: 'Forbidden',
      message: 'You can only access your own resources'
    });
  };
};

module.exports = {
  authorize,
  authorizeOwnership
};
