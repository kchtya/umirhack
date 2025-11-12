import express from 'express';
import { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject,
  exportProject,
  duplicateProject
} from '../controllers/projectController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateBody, validateQuery, validateParams } from '../middleware/validationMiddleware.js';
import { projectSchemas, querySchemas, uuidParams } from '../middleware/validationMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// @desc    Get all user projects
// @route   GET /api/projects
// @access  Private
router.get(
  '/', 
  validateQuery(querySchemas.paginationQuery),
  getProjects
);

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
router.get(
  '/:id', 
  validateParams(uuidParams),
  getProjectById
);

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
router.post(
  '/', 
  validateBody(projectSchemas.createProject),
  createProject
);

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
router.put(
  '/:id', 
  validateParams(uuidParams),
  validateBody(projectSchemas.updateProject),
  updateProject
);

// @desc    Duplicate project
// @route   POST /api/projects/:id/duplicate
// @access  Private
router.post(
  '/:id/duplicate', 
  validateParams(uuidParams),
  duplicateProject
);

// @desc    Export project
// @route   POST /api/projects/:id/export
// @access  Private
router.post(
  '/:id/export', 
  validateParams(uuidParams),
  exportProject
);

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
router.delete(
  '/:id', 
  validateParams(uuidParams),
  deleteProject
);

export default router;