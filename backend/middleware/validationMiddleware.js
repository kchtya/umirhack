// ================================
// validationMiddleware.js - ЗАКОММЕНТИРОВАН
// ================================

/*
const validateBody = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Неверные данные',
      details: error.errors
    });
  }
};

const validateParams = (schema) => (req, res, next) => {
  try {
    schema.parse(req.params);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Неверные параметры',
      details: error.errors
    });
  }
};

const validateQuery = (schema) => (req, res, next) => {
  try {
    schema.parse(req.query);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Неверные параметры запроса',
      details: error.errors
    });
  }
};

// Схемы валидации для проектов
const projectSchemas = {
  createProject: {
    parse: (data) => {
      if (!data.title || !data.content) {
        throw new Error('Название и содержание обязательны');
      }
      return data;
    }
  },
  updateProject: {
    parse: (data) => {
      if (data.title && data.title.length < 1) {
        throw new Error('Название не может быть пустым');
      }
      return data;
    }
  }
};

// Схемы для query параметров
const querySchemas = {
  paginationQuery: {
    parse: (data) => {
      if (data.page && (isNaN(data.page) || data.page < 1)) {
        throw new Error('Страница должна быть положительным числом');
      }
      return data;
    }
  }
};

// Валидация UUID параметров
const uuidParams = {
  parse: (data) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(data.id)) {
      throw new Error('Неверный формат UUID');
    }
    return data;
  }
};

module.exports = {
  validateBody,
  validateParams,
  validateQuery,
  projectSchemas,
  querySchemas,
  uuidParams
};
*/