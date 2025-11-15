// ================================
// projectController.js - ЗАКОММЕНТИРОВАН
// ================================

/*
const supabase = require('../config/supabaseClient');

const projectController = {
  // Получение всех проектов пользователя
  async getProjects(req, res) {
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', req.user.id)
        .order('project_order', { ascending: true });

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.json({
        success: true,
        data: projects,
        count: projects.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Получение проекта по ID
  async getProjectById(req, res) {
    try {
      const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (error || !project) {
        return res.status(404).json({
          success: false,
          error: 'Проект не найден'
        });
      }

      // Проверяем, что проект принадлежит пользователю
      if (project.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Нет доступа к этому проекту'
        });
      }

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Создание проекта
  async createProject(req, res) {
    try {
      const { title, description, content } = req.body;

      // Получаем текущий максимальный порядок
      const { data: maxOrder } = await supabase
        .from('projects')
        .select('project_order')
        .eq('user_id', req.user.id)
        .order('project_order', { ascending: false })
        .limit(1)
        .single();

      const projectData = {
        title: title || 'Новый проект',
        description: description || '',
        content: content || {},
        user_id: req.user.id,
        project_order: (maxOrder?.project_order || 0) + 1
      };

      const { data: project, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.status(201).json({
        success: true,
        message: 'Проект успешно создан',
        data: project
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Обновление проекта
  async updateProject(req, res) {
    try {
      // Сначала проверяем доступ к проекту
      const { data: existingProject, error: checkError } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', req.params.id)
        .single();

      if (checkError || !existingProject) {
        return res.status(404).json({
          success: false,
          error: 'Проект не найден'
        });
      }

      if (existingProject.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Нет прав для редактирования этого проекта'
        });
      }

      const { data: project, error } = await supabase
        .from('projects')
        .update(req.body)
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.json({
        success: true,
        message: 'Проект обновлен',
        data: project
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Удаление проекта
  async deleteProject(req, res) {
    try {
      // Сначала проверяем доступ к проекту
      const { data: existingProject, error: checkError } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', req.params.id)
        .single();

      if (checkError || !existingProject) {
        return res.status(404).json({
          success: false,
          error: 'Проект не найден'
        });
      }

      if (existingProject.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Нет прав для удаления этого проекта'
        });
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', req.params.id);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      // Обновляем порядок оставшихся проектов
      const { data: remainingProjects } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', req.user.id)
        .order('project_order', { ascending: true });

      if (remainingProjects && remainingProjects.length > 0) {
        const updates = remainingProjects.map((project, index) =>
          supabase
            .from('projects')
            .update({ project_order: index })
            .eq('id', project.id)
        );

        await Promise.all(updates);
      }

      res.json({
        success: true,
        message: 'Проект удален'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Дублирование проекта
  async duplicateProject(req, res) {
    try {
      const { data: existingProject, error: checkError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (checkError || !existingProject) {
        return res.status(404).json({
          success: false,
          error: 'Проект не найден'
        });
      }

      if (existingProject.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Нет прав для дублирования этого проекта'
        });
      }

      // Получаем текущий максимальный порядок
      const { data: maxOrder } = await supabase
        .from('projects')
        .select('project_order')
        .eq('user_id', req.user.id)
        .order('project_order', { ascending: false })
        .limit(1)
        .single();

      const newProject = {
        ...existingProject,
        id: undefined, // Генерируется автоматически
        title: `${existingProject.title} (копия)`,
        project_order: (maxOrder?.project_order || 0) + 1,
        created_at: new Date(),
        updated_at: new Date()
      };

      delete newProject.id;

      const { data: project, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select()
        .single();

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.status(201).json({
        success: true,
        message: 'Проект дублирован',
        data: project
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Обновление порядка проектов
  async updateProjectOrder(req, res) {
    try {
      const { projects } = req.body;

      // Проверяем, что все проекты принадлежат пользователю
      for (const project of projects) {
        const { data: existingProject } = await supabase
          .from('projects')
          .select('user_id')
          .eq('id', project.id)
          .single();

        if (!existingProject || existingProject.user_id !== req.user.id) {
          return res.status(403).json({
            success: false,
            error: 'Нет прав для изменения порядка проектов'
          });
        }
      }

      // Обновляем порядок всех проектов
      const updates = projects.map(project =>
        supabase
          .from('projects')
          .update({ project_order: project.order })
          .eq('id', project.id)
      );

      await Promise.all(updates);

      res.json({
        success: true,
        message: 'Порядок проектов обновлен'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Экспорт проекта
  async exportProject(req, res) {
    try {
      const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (error || !project) {
        return res.status(404).json({
          success: false,
          error: 'Проект не найден'
        });
      }

      if (project.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Нет прав для экспорта этого проекта'
        });
      }

      res.json({
        success: true,
        message: 'Экспорт проекта',
        data: project
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = projectController;
*/