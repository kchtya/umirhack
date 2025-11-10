<template>
  <div class="project-manager">
    <h3>МЕНЕДЖЕР ПРОЕКТОВ</h3>
    
    <div class="project-section">
      <label>Текущий проект:</label>
      <input 
        v-model="projectName" 
        @input="updateProjectName"
        placeholder="Название проекта..."
        class="project-input"
      >
    </div>

    <div class="project-section">
      <label>Действия:</label>
      <div class="project-actions">
        <button @click="saveProject" class="project-btn primary">
          <Save :size="16" />
          Сохранить
        </button>
        <button @click="loadProject" class="project-btn">
          <FolderOpen :size="16" />
          Загрузить
        </button>
        <button @click="newProject" class="project-btn">
          <FilePlus :size="16" />
          Новый
        </button>
      </div>
    </div>

    <div class="project-section" v-if="savedProjects.length > 0">
      <label>Сохраненные проекты:</label>
      <div class="projects-list">
        <div 
          v-for="project in savedProjects" 
          :key="project.id"
          class="project-item"
          @click="loadSpecificProject(project)"
        >
          <div class="project-info">
            <Folder :size="14" class="project-icon" />
            <span class="project-title">{{ project.name }}</span>
          </div>
          <div class="project-meta">
            <span class="project-date">{{ formatDate(project.savedAt) }}</span>
            <button 
              @click.stop="deleteProject(project.id)"
              class="delete-project-btn"
              title="Удалить проект"
            >
              <Trash2 :size="12" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-projects">
      <FolderOpen :size="32" class="empty-icon" />
      <p>Нет сохраненных проектов</p>
    </div>
  </div>
</template>

<script setup>
import { useEditorStore } from '../stores/editor';
import { storeToRefs } from 'pinia';
import { ref, computed, onMounted } from 'vue';
import { 
  Save, 
  FolderOpen, 
  FilePlus, 
  Folder, 
  Trash2 
} from 'lucide-vue-next';

const editorStore = useEditorStore();
const { blocks } = storeToRefs(editorStore);
const { loadProject: loadStoreProject, clearAllBlocks } = editorStore;

const projectName = ref('Мой проект');
const savedProjects = ref([]);

onMounted(() => {
  loadSavedProjects();
});

const loadSavedProjects = () => {
  const projects = JSON.parse(localStorage.getItem('landing-projects') || '[]');
  savedProjects.value = projects;
};

const updateProjectName = () => {
  // Можно добавить автосохранение или другие действия
};

const saveProject = () => {
  const project = {
    id: Date.now().toString(),
    name: projectName.value,
    blocks: [...blocks.value],
    savedAt: new Date().toISOString()
  };

  // Загружаем существующие проекты
  const existingProjects = JSON.parse(localStorage.getItem('landing-projects') || '[]');
  
  // Удаляем старую версию если существует
  const filteredProjects = existingProjects.filter(p => p.name !== projectName.value);
  
  // Добавляем новый проект
  filteredProjects.push(project);
  
  // Сохраняем обратно
  localStorage.setItem('landing-projects', JSON.stringify(filteredProjects));
  localStorage.setItem('landing-current-project', JSON.stringify(project));
  
  // Обновляем список
  loadSavedProjects();
  
  alert(`Проект "${projectName.value}" сохранен!`);
};

const loadProject = () => {
  const saved = localStorage.getItem('landing-current-project');
  if (saved) {
    const project = JSON.parse(saved);
    loadStoreProject(project.blocks);
    projectName.value = project.name;
    alert(`Проект "${project.name}" загружен!`);
  } else {
    alert('Нет сохраненных проектов!');
  }
};

const loadSpecificProject = (project) => {
  if (confirm(`Загрузить проект "${project.name}"?`)) {
    loadStoreProject(project.blocks);
    projectName.value = project.name;
    localStorage.setItem('landing-current-project', JSON.stringify(project));
  }
};

const newProject = () => {
  if (confirm('Создать новый проект? Все несохраненные изменения будут потеряны.')) {
    clearAllBlocks();
    projectName.value = 'Новый проект';
    localStorage.removeItem('landing-current-project');
  }
};

const deleteProject = (projectId) => {
  if (confirm('Удалить этот проект?')) {
    const filteredProjects = savedProjects.value.filter(p => p.id !== projectId);
    savedProjects.value = filteredProjects;
    localStorage.setItem('landing-projects', JSON.stringify(filteredProjects));
    
    // Если удаляем текущий проект
    const current = localStorage.getItem('landing-current-project');
    if (current) {
      const currentProject = JSON.parse(current);
      if (currentProject.id === projectId) {
        localStorage.removeItem('landing-current-project');
      }
    }
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU');
};
</script>

<style scoped>
.project-manager {
  width: 100%;
  padding: 1.5rem;
  background: var(--bg-tertiary);
  min-height: 100%;
  overflow-y: auto;
}

.project-manager h3 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 2px;
  opacity: 0.8;
  text-transform: uppercase;
}

.project-section {
  margin-bottom: 1.5rem;
}

.project-section label {
  display: block;
  margin-bottom: 0.8rem;
  font-weight: 300;
  color: var(--text-secondary);
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.project-input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.9rem;
  font-family: inherit;
}

.project-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.project-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
  justify-content: center;
}

.project-btn.primary {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.project-btn:hover {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
  transform: translateY(-1px);
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.project-item:hover {
  border-color: var(--accent-color);
  transform: translateX(2px);
}

.project-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.project-icon {
  opacity: 0.6;
  color: var(--text-tertiary);
}

.project-title {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.project-date {
  font-size: 0.7rem;
  color: var(--text-tertiary);
}

.delete-project-btn {
  width: 20px;
  height: 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  opacity: 0.7;
}

.delete-project-btn:hover {
  background: #c82333;
  opacity: 1;
  transform: scale(1.1);
}

.empty-projects {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text-tertiary);
  text-align: center;
  gap: 1rem;
}

.empty-icon {
  opacity: 0.3;
}

.empty-projects p {
  margin: 0;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

/* Кастомный скроллбар */
.project-manager::-webkit-scrollbar {
  width: 6px;
}

.project-manager::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
}

.project-manager::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 3px;
}

.project-manager::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}
</style>