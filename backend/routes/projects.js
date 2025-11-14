const express = require('express');
const { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject,
  exportProject,
  duplicateProject
} = require('../controllers/projectController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateBody, validateQuery, validateParams } = require('../middleware/validationMiddleware');
const { projectSchemas, querySchemas, uuidParams } = require('../middleware/validationMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', 
  validateQuery(querySchemas.paginationQuery),
  getProjects
);

router.get('/:id', 
  validateParams(uuidParams),
  getProjectById
);

router.post('/', 
  // validateBody(projectSchemas.createProject), // ЗАКОММЕНТИРОВАНО!
  createProject
);

router.put('/:id', 
  validateParams(uuidParams),
  validateBody(projectSchemas.updateProject),
  updateProject
);

router.post('/:id/duplicate', 
  validateParams(uuidParams),
  duplicateProject
);

router.post('/:id/export', 
  validateParams(uuidParams),
  exportProject
);

router.delete('/:id', 
  validateParams(uuidParams),
  deleteProject
);

module.exports = router;