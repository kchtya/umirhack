// ================================
// templateController.js - ЗАКОММЕНТИРОВАН
// ================================

/*
const supabase = require('../config/supabaseClient');

const templateController = {
  getTemplates: async (req, res) => {
    try {
      const { data: templates, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      // Если шаблонов нет - вернем тестовые данные
      if (!templates || templates.length === 0) {
        const testTemplates = [
          {
            id: 1,
            name: "Базовый шаблон",
            description: "Простой шаблон для начала работы",
            content: {
              sections: ["header", "main", "footer"],
              styles: "basic"
            },
            created_at: new Date().toISOString(),
            user_id: req.user?.id || 'test-user'
          },
          {
            id: 2,
            name: "Бизнес-шаблон", 
            description: "Шаблон для бизнес-сайтов",
            content: {
              sections: ["hero", "services", "about", "contact"],
              styles: "professional"
            },
            created_at: new Date().toISOString(),
            user_id: req.user?.id || 'test-user'
          }
        ];
        
        return res.json({
          success: true,
          data: testTemplates,
          count: testTemplates.length
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
  }
};

module.exports = templateController;
*/