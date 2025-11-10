const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => `${err.path}: ${err.msg}`).join(', ');
    return res.status(400).json({
      error: 'Validation failed',
      message: errorMessages,
      details: errors.array()
    });
  }
  next();
};

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  validate
];

const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 }),
  validate
];

const postValidation = [
  body('title')
    .exists().withMessage('Title is required')
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('content')
    .exists().withMessage('Content is required')
    .trim()
    .isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  body('tags')
    .optional(),
  validate
];

const userUpdateValidation = [
  body('name').optional().trim().isLength({ min: 2 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('role').optional().isIn(['Admin', 'Editor', 'Viewer']),
  body('isActive').optional().isBoolean(),
  validate
];

const idValidation = [
  param('id').isMongoId(),
  validate
];

module.exports = {
  loginValidation,
  registerValidation,
  postValidation,
  userUpdateValidation,
  idValidation,
  validate
};
