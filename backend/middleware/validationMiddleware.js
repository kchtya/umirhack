import Joi from 'joi';

// Validation schemas (схемы проверки данных)
export const authSchemas = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  })
};

export const userSchemas = {
  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),
    bio: Joi.string().max(500).allow('', null).messages({
      'string.max': 'Bio cannot exceed 500 characters'
    }),
    avatar: Joi.string().uri().allow('', null).messages({
      'string.uri': 'Avatar must be a valid URL'
    })
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required'
    }),
    newPassword: Joi.string().min(6).required().messages({
      'string.min': 'New password must be at least 6 characters long',
      'any.required': 'New password is required'
    })
  }),

  deleteAccount: Joi.object({
    password: Joi.string().required().messages({
      'any.required': 'Password is required to delete account'
    })
  })
};

export const templateSchemas = {
  createTemplate: Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      'string.min': 'Template name must be at least 3 characters long',
      'string.max': 'Template name cannot exceed 100 characters',
      'any.required': 'Template name is required'
    }),
    description: Joi.string().min(10).max(500).required().messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 500 characters',
      'any.required': 'Description is required'
    }),
    category: Joi.string().valid('business', 'portfolio', 'ecommerce', 'landing', 'blog').required().messages({
      'any.only': 'Category must be one of: business, portfolio, ecommerce, landing, blog',
      'any.required': 'Category is required'
    }),
    difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium').messages({
      'any.only': 'Difficulty must be one of: easy, medium, hard'
    }),
    tags: Joi.array().items(Joi.string().max(20)).max(10).messages({
      'array.max': 'Cannot have more than 10 tags',
      'string.max': 'Each tag cannot exceed 20 characters'
    }),
    preview_image: Joi.string().uri().allow('', null).messages({
      'string.uri': 'Preview image must be a valid URL'
    }),
    blocks: Joi.object().required().messages({
      'any.required': 'Blocks are required'
    }),
    price: Joi.number().min(0).default(0).messages({
      'number.min': 'Price cannot be negative'
    }),
    is_free: Joi.boolean().default(true)
  }),

  updateTemplate: Joi.object({
    name: Joi.string().min(3).max(100).messages({
      'string.min': 'Template name must be at least 3 characters long',
      'string.max': 'Template name cannot exceed 100 characters'
    }),
    description: Joi.string().min(10).max(500).messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 500 characters'
    }),
    category: Joi.string().valid('business', 'portfolio', 'ecommerce', 'landing', 'blog').messages({
      'any.only': 'Category must be one of: business, portfolio, ecommerce, landing, blog'
    }),
    difficulty: Joi.string().valid('easy', 'medium', 'hard').messages({
      'any.only': 'Difficulty must be one of: easy, medium, hard'
    }),
    tags: Joi.array().items(Joi.string().max(20)).max(10).messages({
      'array.max': 'Cannot have more than 10 tags',
      'string.max': 'Each tag cannot exceed 20 characters'
    }),
    preview_image: Joi.string().uri().allow('', null).messages({
      'string.uri': 'Preview image must be a valid URL'
    }),
    blocks: Joi.object(),
    price: Joi.number().min(0).messages({
      'number.min': 'Price cannot be negative'
    }),
    is_free: Joi.boolean()
  })
};

export const projectSchemas = {
  createProject: Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      'string.min': 'Project name must be at least 3 characters long',
      'string.max': 'Project name cannot exceed 100 characters',
      'any.required': 'Project name is required'
    }),
    description: Joi.string().max(500).allow('', null).messages({
      'string.max': 'Description cannot exceed 500 characters'
    }),
    blocks: Joi.object().required().messages({
      'any.required': 'Blocks are required'
    }),
    thumbnail: Joi.string().uri().allow('', null).messages({
      'string.uri': 'Thumbnail must be a valid URL'
    }),
    template_id: Joi.string().uuid().allow(null).messages({
      'string.uuid': 'Template ID must be a valid UUID'
    })
  }),

  updateProject: Joi.object({
    name: Joi.string().min(3).max(100).messages({
      'string.min': 'Project name must be at least 3 characters long',
      'string.max': 'Project name cannot exceed 100 characters'
    }),
    description: Joi.string().max(500).allow('', null).messages({
      'string.max': 'Description cannot exceed 500 characters'
    }),
    blocks: Joi.object(),
    thumbnail: Joi.string().uri().allow('', null).messages({
      'string.uri': 'Thumbnail must be a valid URL'
    })
  })
};

// Query parameter validation schemas (схемы проверки данных параметров запроса)
export const querySchemas = {
  templatesQuery: Joi.object({
    category: Joi.string().valid('all', 'business', 'portfolio', 'ecommerce', 'landing', 'blog').default('all'),
    sort: Joi.string().valid('newest', 'popular', 'name').default('newest'),
    search: Joi.string().max(100).allow(''),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(12)
  }),

  paginationQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
};

// Generic validation middleware (универсальное промежуточное ПО для проверки данных)
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errorDetails
        }
      });
    }

    // Replace req.body with validated and sanitized data (заменить req.body проверенными и очищенными данными)
    req.body = value;
    next();
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query parameters',
          details: errorDetails
        }
      });
    }

    // Replace req.query with validated data
    req.query = value;
    next();
  };
};

export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid URL parameters',
          details: errorDetails
        }
      });
    }

    // Replace req.params with validated data
    req.params = value;
    next();
  };
};

// UUID validation for URL parameters (проверка UUID для параметров адреса)
export const uuidParams = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.uuid': 'ID must be a valid UUID',
    'any.required': 'ID is required'
  })
});

// Export all schemas and validators
export default {
  authSchemas,
  userSchemas,
  templateSchemas,
  projectSchemas,
  querySchemas,
  validateBody,
  validateQuery,
  validateParams,
  uuidParams
};