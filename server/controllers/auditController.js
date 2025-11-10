const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, userId, resource, action } = req.query;

    let query = {};
    if (userId) query.userId = userId;
    if (resource) query.resource = resource;
    if (action) query.action = action;

    const logs = await AuditLog.find(query)
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await AuditLog.countDocuments(query);

    res.json({
      logs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    logger.error('Get audit logs error', {
      error: error.message,
      correlationId: req.correlationId
    });
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

module.exports = {
  getAuditLogs
};
