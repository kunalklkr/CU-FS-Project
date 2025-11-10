const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const authenticate = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.get('/', authenticate, authorize('admin', 'view:logs'), auditController.getAuditLogs);

module.exports = router;
