import { supabase, handleSupabaseError } from '../config/supabaseClient.js';
import { generateProjectName, deepClone } from '../utils/helpers.js';

// Get all user projects
export const getProjects = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20 } = req.query;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: projects, error, count } = await supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .range(from, to);

    if (error) {
      return res.status(500).json(handleSupabaseError(error));
    }

    res.status(200).json({
      success: true,
      data: {
        projects: projects || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROJECTS_FETCH_FAILED',
        message: 'Failed to fetch projects'
      }
    });
  }
};

// Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !project) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        project
      }
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROJECT_FETCH_FAILED',
        message: 'Failed to fetch project'
      }
    });
  }
};

// Create new project
export const createProject = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, description, blocks, thumbnail, template_id } = req.body;

    // Validate required fields
    if (!name || !blocks) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name and blocks are required'
        }
      });
    }

    const projectData = {
      name,
      description: description || '',
      blocks,
      thumbnail: thumbnail || null,
      user_id: userId,
      template_id: template_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: project, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) {
      return res.status(500).json(handleSupabaseError(error));
    }

    res.status(201).json({
      success: true,
      data: {
        project
      },
      message: 'Project created successfully'
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROJECT_CREATION_FAILED',
        message: 'Failed to create project'
      }
    });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { name, description, blocks, thumbnail } = req.body;

    // Check if project exists and belongs to user
    const { data: existingProject, error: checkError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (checkError || !existingProject) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found'
        }
      });
    }

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (blocks !== undefined) updateData.blocks = blocks;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;

    const { data: project, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json(handleSupabaseError(error));
    }

    res.status(200).json({
      success: true,
      data: {
        project
      },
      message: 'Project updated successfully'
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROJECT_UPDATE_FAILED',
        message: 'Failed to update project'
      }
    });
  }
};

// Duplicate project
export const duplicateProject = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Get original project
    const { data: originalProject, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !originalProject) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found'
        }
      });
    }

    // Create duplicate
    const duplicateData = {
      name: `${originalProject.name} - Копия`,
      description: originalProject.description,
      blocks: deepClone(originalProject.blocks),
      thumbnail: originalProject.thumbnail,
      user_id: userId,
      template_id: originalProject.template_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: duplicatedProject, error: duplicateError } = await supabase
      .from('projects')
      .insert([duplicateData])
      .select()
      .single();

    if (duplicateError) {
      return res.status(500).json(handleSupabaseError(duplicateError));
    }

    res.status(201).json({
      success: true,
      data: {
        project: duplicatedProject
      },
      message: 'Project duplicated successfully'
    });

  } catch (error) {
    console.error('Duplicate project error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROJECT_DUPLICATION_FAILED',
        message: 'Failed to duplicate project'
      }
    });
  }
};

// Export project
export const exportProject = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { format = 'json' } = req.body;

    // Get project
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !project) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found'
        }
      });
    }

    // Log export (for analytics)
    await supabase
      .from('project_exports')
      .insert([{
        project_id: id,
        format: format,
        exported_at: new Date().toISOString()
      }]);

    let exportData;
    
    switch (format) {
      case 'html':
        // Simple HTML export (В РЕАЛЕ ДОЛЖНО ГЕНЕРИТЬ ПОЛНЫЙ html)
        exportData = generateHTMLExport(project);
        break;
      case 'json':
      default:
        exportData = {
          project: {
            name: project.name,
            description: project.description,
            blocks: project.blocks,
            exportedAt: new Date().toISOString(),
            version: '1.0'
          }
        };
        break;
    }

    res.status(200).json({
      success: true,
      data: exportData,
      message: 'Project exported successfully'
    });

  } catch (error) {
    console.error('Export project error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROJECT_EXPORT_FAILED',
        message: 'Failed to export project'
      }
    });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Check if project exists and belongs to user
    const { data: project, error: checkError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (checkError || !project) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROJECT_NOT_FOUND',
          message: 'Project not found'
        }
      });
    }

    // Delete project
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return res.status(500).json(handleSupabaseError(deleteError));
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROJECT_DELETION_FAILED',
        message: 'Failed to delete project'
      }
    });
  }
};

// Helper function for HTML export
const generateHTMLExport = (project) => {
  // (УПРОЩЕННАЯ ВЕРСИЯ, В РЕАЛЕ ГЕНЕРИРУЕТСЯ НОРМАЛЬНЫ АДРЕС html)
  const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .block { margin-bottom: 20px; padding: 20px; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <h1>${project.name}</h1>
    ${project.description ? `<p>${project.description}</p>` : ''}
    <div id="blocks">
        <!-- Blocks would be rendered here -->
    </div>
    <script>
        // Project data
        const projectData = ${JSON.stringify(project.blocks, null, 2)};
        console.log('Project blocks:', projectData);
    </script>
</body>
</html>`;

  return {
    html: html,
    downloadUrl: `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
  };
};

export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  duplicateProject,
  exportProject,
  deleteProject
};