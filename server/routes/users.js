const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { userUpdateValidation, idValidation } = require('../middleware/validation');
const auditLog = require('../middleware/audit');

router.get('/', authenticate, authorize('users', 'read'), userController.getUsers);

router.get('/:id', authenticate, idValidation, authorize('users', 'read'), userController.getUser);

router.put(
  '/:id',
  authenticate,
  idValidation,
  authorize('users', 'update'),
  userUpdateValidation,
  auditLog('update', 'user'),
  userController.updateUser
);

router.delete(
  '/:id',
  authenticate,
  idValidation,
  authorize('users', 'delete'),
  auditLog('delete', 'user'),
  userController.deleteUser
);

module.exports = router;
