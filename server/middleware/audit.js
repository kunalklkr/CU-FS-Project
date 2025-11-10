const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

const auditLog = (action, resource) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = async function(data) {
      // Only log successful operations (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          await AuditLog.create({
            userId: req.user?.userId,
            action,
            resource,
            resourceId: req.params.id || data?._id,
            details: {
              method: req.method,
              path: req.path,
              body: req.body,
              query: req.query
            },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            correlationId: req.correlationId
          });
        } catch (error) {
          logger.error('Audit log error', {
            error: error.message,
            correlationId: req.correlationId
          });
        }
      }

      return originalJson(data);
    };

    next();
  };
};

module.exports = auditLog;
