<template>
  <div class="home">
    <header class="header">
      <h1>🏗️ Конструктор Лендингов</h1>
      <p>Создайте идеальный лендинг за минуты!</p>
      <div class="toolbar">
        <button @click="saveProject" class="toolbar-btn">💾 Сохранить</button>
        <span class="blocks-count">Блоков: {{ blocksCount }}</span>
      </div>
    </header>
    
    <div class="editor-layout">
      <BlockLibrary />
      <div 
        class="canvas" 
        @drop="handleDrop"
        @dragover.prevent
        @click="clearSelection"
      >
        <div v-if="blocksCount === 0" class="empty-state">
          <h3>🎨 Холст</h3>
          <p>Перетащите блоки сюда чтобы начать создание</p>
          <div>🖱️ Перетащите блоки из левой панели</div>
        </div>
        
        <div 
          v-for="(block, index) in blocks" 
          :key="block.id"
          class="block-wrapper"
          :class="{ active: activeBlock?.id === block.id }"
          @click.stop="setActiveBlock(block.id)"
        >
          <div v-if="block.type === 'heading'" class="block-element heading">
            {{ block.content }}
          </div>
          <div v-else-if="block.type === 'paragraph'" class="block-element paragraph">
            {{ block.content }}
          </div>
          <button v-else-if="block.type === 'button'" class="block-element button">
            {{ block.content }}
          </button>
          <img v-else-if="block.type === 'image'" :src="block.content" class="block-element image" alt="Image"/>
          <div v-else-if="block.type === 'text'" class="block-element text">
            {{ block.content }}
          </div>
          
          <button 
            v-if="activeBlock?.id === block.id"
            @click="deleteBlock(block.id)"
            class="delete-btn"
            title="Удалить блок"
          >
            ×
          </button>
        </div>
      </div>
      
      <BlockEditor v-if="activeBlock" />
    </div>
  </div>
</template>

<script setup>
import { useEditorStore } from '../stores/editor';
import { storeToRefs } from 'pinia';
import BlockLibrary from '../components/BlockLibrary.vue';
import BlockEditor from '../components/BlockEditor.vue';

const editorStore = useEditorStore();
const { blocks, activeBlock, blocksCount } = storeToRefs(editorStore);
const { addBlock, setActiveBlock, deleteBlock } = editorStore;

const handleDrop = (event) => {
  try {
    const blockData = JSON.parse(event.dataTransfer.getData('application/json'));
    addBlock(blockData.type);
  } catch (error) {
    console.error('Ошибка при добавлении блока:', error);
  }
};

const clearSelection = () => {
  setActiveBlock(null);
};

const saveProject = () => {
  const project = {
    blocks: blocks.value,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem('landing-project', JSON.stringify(project));
  alert('Проект сохранен в localStorage!');
};
</script>

<style scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.header p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.editor-layout {
  display: flex;
  flex: 1;
  height: calc(100vh - 120px);
}

.canvas {
  flex: 1;
  padding: 40px;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.canvas h3 {
  color: #6c757d;
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.canvas p {
  color: #adb5bd;
  margin-bottom: 20px;
}

.empty-state {
  padding: 30px;
  background: white;
  border: 3px dashed #dee2e6;
  border-radius: 12px;
  color: #6c757d;
  font-size: 1.2rem;
}

.toolbar {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-top: 15px;
}

.toolbar-btn {
  padding: 8px 16px;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: rgba(255,255,255,0.3);
}

.blocks-count {
  font-size: 0.9rem;
  opacity: 0.8;
}

.block-wrapper {
  position: relative;
  margin: 15px 0;
  padding: 15px;
  background: white;
  border: 2px solid transparent;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
}

.block-wrapper:hover {
  border-color: #dee2e6;
}

.block-wrapper.active {
  border-color: #4dabf7;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.block-element {
  margin: 0;
}

.block-element.heading {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.block-element.paragraph {
  line-height: 1.6;
  color: #666;
}

.block-element.button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.block-element.button:hover {
  background: #0056b3;
}

.block-element.image {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
}

.block-element.text {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  background: #c82333;
}
</style>