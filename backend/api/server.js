import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// middleware
app.use(cors());
app.use(express.json());

// в памяти
let projects = {};

// получить блоки
app.get('/api/projects/:id/blocks', (req, res) => {
  const projectId = req.params.id;
  const project = projects[projectId] || { blocks: [] };
  res.json(project);
});

// сохранить блоки
app.post('/api/projects/:id/blocks', (req, res) => {
  const projectId = req.params.id;
  const { blocks } = req.body;

  if (!projects[projectId]) {
    projects[projectId] = {};
  }

  projects[projectId].blocks = blocks;
  projects[projectId].updatedAt = new Date().toISOString();

  res.json({ success: true });
});

// экспорт проекта в html
app.post('/api/projects/:id/export', (req, res) => {
  const projectId = req.params.id;
  const project = projects[projectId];

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const html = generateHTML(project.blocks);
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// генерация html из блоков
function generateHTML(blocks = []) {
  const blockHTML = blocks.map(block => {
    switch (block.type) {
      case 'heading':
        return `<h1>${block.content}</h1>`;
      case 'paragraph':
        return `<p>${block.content}</p>`;
      case 'button':
        return `<button>${block.content}</button>`;
      case 'image':
        return `<img src="${block.content}" alt="Image" style="max-width:100%;">`;
      default:
        return `<div>${block.content}</div>`;
    }
  }).join('\n');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Landing Page</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    button { padding: 10px 20px; background: #3b1fa1; color: white; border: none; border-radius: 5px; }
  </style>
</head>
<body>
  ${blockHTML}
</body>
</html>`;
}

// запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});