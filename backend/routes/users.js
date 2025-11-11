import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  changePassword, 
  deleteAccount, 
  exportData 
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { userSchemas } from '../middleware/validationMiddleware.js';

const router = express.Router();

// All routes are protected and require authentication
router.use(authenticateToken);

// @desc    Get user profile with stats
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', getProfile);

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put(
  '/profile', 
  validateBody(userSchemas.updateProfile),
  updateProfile
);

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
router.put(
  '/change-password', 
  validateBody(userSchemas.changePassword),
  changePassword
);

// @desc    Export user data
// @route   GET /api/users/export-data
// @access  Private
router.get('/export-data', exportData);

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
router.delete(
  '/account', 
  validateBody(userSchemas.deleteAccount),
  deleteAccount
);

export default router;