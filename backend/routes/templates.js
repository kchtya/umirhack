import express from 'express';
import { 
  getTemplates, 
  getTemplateById, 
  useTemplate, 
  getCategories,
  createTemplate,
  updateTemplate,
  deleteTemplate
} from '../controllers/templateController.js';
import { authenticateToken, optionalAuth, requireAdmin } from '../middleware/authMiddleware.js';
import { validateBody, validateQuery, validateParams } from '../middleware/validationMiddleware.js';
import { templateSchemas, querySchemas, uuidParams } from '../middleware/validationMiddleware.js';

const router = express.Router();

// @desc    Get all templates with filtering and pagination
// @route   GET /api/templates
// @access  Public (optional auth for personalized results)
router.get(
  '/', 
  optionalAuth,
  validateQuery(querySchemas.templatesQuery),
  getTemplates
);

// @desc    Get template categories
// @route   GET /api/templates/categories
// @access  Public
router.get('/categories', getCategories);

// @desc    Get template by ID
// @route   GET /api/templates/:id
// @access  Public
router.get(
  '/:id', 
  validateParams(uuidParams),
  getTemplateById
);

// @desc    Use template (create project from template)
// @route   POST /api/templates/:id/use
// @access  Private
router.post(
  '/:id/use', 
  authenticateToken,
  validateParams(uuidParams),
  useTemplate
);

// @desc    Create new template
// @route   POST /api/templates
// @access  Private (Admin only)
router.post(
  '/', 
  authenticateToken,
  requireAdmin,
  validateBody(templateSchemas.createTemplate),
  createTemplate
);

// @desc    Update template
// @route   PUT /api/templates/:id
// @access  Private (Admin only)
router.put(
  '/:id', 
  authenticateToken,
  requireAdmin,
  validateParams(uuidParams),
  validateBody(templateSchemas.updateTemplate),
  updateTemplate
);

// @desc    Delete template
// @route   DELETE /api/templates/:id
// @access  Private (Admin only)
router.delete(
  '/:id', 
  authenticateToken,
  requireAdmin,
  validateParams(uuidParams),
  deleteTemplate
);

export default router;