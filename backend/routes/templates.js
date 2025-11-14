const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Все роуты требуют аутентификации
router.use(authenticateToken);

// @desc    Получить все шаблоны
// @route   GET /api/templates
// @access  Private
router.get('/', templateController.getTemplates);

// @desc    Получить шаблон по ID
// @route   GET /api/templates/:id
// @access  Private
router.get('/:id', templateController.getTemplateById);

// @desc    Создать шаблон
// @route   POST /api/templates
// @access  Private/Admin
router.post('/', requireAdmin, templateController.createTemplate);

// @desc    Обновить шаблон
// @route   PUT /api/templates/:id
// @access  Private
router.put('/:id', templateController.updateTemplate);

// @desc    Удалить шаблон
// @route   DELETE /api/templates/:id
// @access  Private
router.delete('/:id', templateController.deleteTemplate);

module.exports = router;