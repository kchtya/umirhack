import { supabase, handleSupabaseError } from '../config/supabaseClient.js';

// Get all templates with filtering and pagination (запросить все шаблоны с фильтрацией и постраничным выводом)
export const getTemplates = async (req, res) => {
  try {
    const { 
      category = 'all', 
      sort = 'newest', 
      search = '', 
      page = 1, 
      limit = 12 
    } = req.query;

    // Base query
    let query = supabase
      .from('templates')
      .select(`
        *,
        author:users(name)
      `, { count: 'exact' });

    // Apply filters (применить фильтры)
    if (category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`);
    }

    // Apply sorting
    switch (sort) {
      case 'popular':
        query = query.order('views', { ascending: false });
        break;
      case 'name':
        query = query.order('name', { ascending: true });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: templates, error, count } = await query;

    if (error) {
      return res.status(500).json(handleSupabaseError(error));
    }

    res.status(200).json({
      success: true,
      data: {
        templates: templates || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'TEMPLATES_FETCH_FAILED',
        message: 'Failed to fetch templates'
      }
    });
  }
};

// Get template by ID (найти шаблон по ID)
export const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: template, error } = await supabase
      .from('templates')
      .select(`
        *,
        author:users(name, avatar)
      `)
      .eq('id', id)
      .single();

    if (error || !template) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TEMPLATE_NOT_FOUND',
          message: 'Template not found'
        }
      });
    }

    // Increment view count (увеличить счётчик просмотров)
    await supabase
      .from('templates')
      .update({ views: (template.views || 0) + 1 })
      .eq('id', id);

    res.status(200).json({
      success: true,
      data: {
        template
      }
    });

  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'TEMPLATE_FETCH_FAILED',
        message: 'Failed to fetch template'
      }
    });
  }
};

// Use template (create project from template)
export const useTemplate = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Get template
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (templateError || !template) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TEMPLATE_NOT_FOUND',
          message: 'Template not found'
        }
      });
    }

    // Create project from template
    const projectData = {
      name: `${template.name} - Copy`,
      description: `Created from template: ${template.name}`,
      blocks: template.blocks,
      thumbnail: template.preview_image,
      user_id: userId,
      template_id: id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (projectError) {
      return res.status(500).json(handleSupabaseError(projectError));
    }

    // Increment template downloads (увеличить счётчик скачиваний шаблона)
    await supabase
      .from('templates')
      .update({ downloads: (template.downloads || 0) + 1 })
      .eq('id', id);

    res.status(201).json({
      success: true,
      data: {
        project_id: project.id
      },
      message: 'Template used successfully'
    });

  } catch (error) {
    console.error('Use template error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'TEMPLATE_USE_FAILED',
        message: 'Failed to use template'
      }
    });
  }
};

// Get template categories (запросить категории шаблонов)
export const getCategories = async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('template_categories')
      .select('*')
      .order('name');

    if (error) {
      return res.status(500).json(handleSupabaseError(error));
    }

    // If no categories in DB, return default ones (при отсутствии категорий в БД вернуть категории по умолчанию)
    const defaultCategories = [
      { id: 1, name: 'Бизнес', slug: 'business', description: 'Бизнес-шаблоны' },
      { id: 2, name: 'Портфолио', slug: 'portfolio', description: 'Портфолио шаблоны' },
      { id: 3, name: 'Интернет-магазин', slug: 'ecommerce', description: 'E-commerce шаблоны' },
      { id: 4, name: 'Лендинг', slug: 'landing', description: 'Лендинг страницы' },
      { id: 5, name: 'Блог', slug: 'blog', description: 'Блог шаблоны' }
    ];

    res.status(200).json({
      success: true,
      data: {
        categories: categories && categories.length > 0 ? categories : defaultCategories
      }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CATEGORIES_FETCH_FAILED',
        message: 'Failed to fetch categories'
      }
    });
  }
};

// Create new template (admin only)
export const createTemplate = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      name,
      description,
      category,
      difficulty = 'medium',
      tags = [],
      preview_image,
      blocks,
      price = 0,
      is_free = true
    } = req.body;

    // Validate required fields (проверить обязательные поля)
    if (!name || !description || !category || !blocks) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name, description, category and blocks are required'
        }
      });
    }

    const templateData = {
      name,
      description,
      category,
      difficulty,
      tags,
      preview_image,
      blocks,
      price,
      is_free,
      author_id: userId,
      views: 0,
      downloads: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: template, error } = await supabase
      .from('templates')
      .insert([templateData])
      .select(`
        *,
        author:users(name, avatar)
      `)
      .single();

    if (error) {
      return res.status(500).json(handleSupabaseError(error));
    }

    res.status(201).json({
      success: true,
      data: {
        template
      },
      message: 'Template created successfully'
    });

  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'TEMPLATE_CREATION_FAILED',
        message: 'Failed to create template'
      }
    });
  }
};

// Update template (admin only)
export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      difficulty,
      tags,
      preview_image,
      blocks,
      price,
      is_free
    } = req.body;

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (tags !== undefined) updateData.tags = tags;
    if (preview_image !== undefined) updateData.preview_image = preview_image;
    if (blocks !== undefined) updateData.blocks = blocks;
    if (price !== undefined) updateData.price = price;
    if (is_free !== undefined) updateData.is_free = is_free;

    const { data: template, error } = await supabase
      .from('templates')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        author:users(name, avatar)
      `)
      .single();

    if (error) {
      return res.status(500).json(handleSupabaseError(error));
    }

    res.status(200).json({
      success: true,
      data: {
        template
      },
      message: 'Template updated successfully'
    });

  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'TEMPLATE_UPDATE_FAILED',
        message: 'Failed to update template'
      }
    });
  }
};

// Delete template (admin only)
export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json(handleSupabaseError(error));
    }

    res.status(200).json({
      success: true,
      message: 'Template deleted successfully'
    });

  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'TEMPLATE_DELETION_FAILED',
        message: 'Failed to delete template'
      }
    });
  }
};

export {
  getTemplates,
  getTemplateById,
  useTemplate,
  getCategories,
  createTemplate,
  updateTemplate,
  deleteTemplate
};