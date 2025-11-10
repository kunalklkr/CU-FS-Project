const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const logger = require('../utils/logger');

const authenticate = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.accessToken;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      logger.warn('Authentication failed: No token provided', {
        correlationId: req.correlationId,
        ip: req.ip
      });
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      logger.warn('Authentication failed: Invalid token', {
        correlationId: req.correlationId,
        ip: req.ip
      });
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      logger.warn('Authentication failed: User not found or inactive', {
        correlationId: req.correlationId,
        userId: decoded.userId
      });
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    req.user = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    logger.error('Authentication error', {
      error: error.message,
      correlationId: req.correlationId
    });
    res.status(500).json({ error: 'Authentication error' });
  }
};

module.exports = authenticate;
