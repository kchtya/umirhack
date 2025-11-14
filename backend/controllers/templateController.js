const supabase = require('../config/supabaseClient');

const templateController = {
  // Создание шаблона (только админ)
  async createTemplate(req, res) {
    try {
      const { name, content, is_public } = req.body;

      const { data: template, error } = await supabase
        .from('templates')
        .insert([
          {
            name,
            content,
            user_id: req.user.id,
            is_public: is_public || false
          }
        ])
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
        message: 'Шаблон создан',
        data: template
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Получение всех шаблонов (публичные + пользовательские)
  async getTemplates(req, res) {
    try {
      const { data: templates, error } = await supabase
        .from('templates')
        .select('*')
        .or(`is_public.eq.true,user_id.eq.${req.user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.json({
        success: true,
        data: templates,
        count: templates.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Получение шаблона по ID
  async getTemplateById(req, res) {
    try {
      const { data: template, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', req.params.id)
        .or(`is_public.eq.true,user_id.eq.${req.user.id}`)
        .single();

      if (error || !template) {
        return res.status(404).json({
          success: false,
          error: 'Шаблон не найден'
        });
      }

      res.json({
        success: true,
        data: template
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Обновление шаблона
  async updateTemplate(req, res) {
    try {
      // Сначала проверяем права доступа
      const { data: existingTemplate, error: checkError } = await supabase
        .from('templates')
        .select('user_id')
        .eq('id', req.params.id)
        .single();

      if (checkError || !existingTemplate) {
        return res.status(404).json({
          success: false,
          error: 'Шаблон не найден'
        });
      }

      if (existingTemplate.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Нет прав для редактирования этого шаблона'
        });
      }

      const { data: template, error } = await supabase
        .from('templates')
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
        message: 'Шаблон обновлен',
        data: template
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  // Удаление шаблона
  async deleteTemplate(req, res) {
    try {
      // Сначала проверяем права доступа
      const { data: existingTemplate, error: checkError } = await supabase
        .from('templates')
        .select('user_id')
        .eq('id', req.params.id)
        .single();

      if (checkError || !existingTemplate) {
        return res.status(404).json({
          success: false,
          error: 'Шаблон не найден'
        });
      }

      if (existingTemplate.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Нет прав для удаления этого шаблона'
        });
      }

      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', req.params.id);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.json({
        success: true,
        message: 'Шаблон удален'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = templateController;