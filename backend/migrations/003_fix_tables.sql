-- migrations/003_fix_tables.sql
-- Упрощенная миграция для добавления недостающих полей

-- Добавляем поле роли для пользователей
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Создаем таблицу шаблонов (без связей для избежания ошибок)
CREATE TABLE IF NOT EXISTS templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    content JSONB NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Добавляем порядок проектов и поле для контента
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_order INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS content JSONB;