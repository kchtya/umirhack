import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  logout 
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { authSchemas } from '../middleware/validationMiddleware.js';

const router = express.Router();

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post(
  '/register', 
  validateBody(authSchemas.register),
  register
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post(
  '/login', 
  validateBody(authSchemas.login),
  login
);

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get(
  '/me', 
  authenticateToken,
  getMe
);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post(
  '/logout', 
  authenticateToken,
  logout
);

// @desc    Refresh token (optional - for future implementation)
// @route   POST /api/auth/refresh
// @access  Public
router.post('/refresh', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token refresh endpoint - to be implemented'
  });
});

export default router;