import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useEditorStore = defineStore('editor', () => {
  const blocks = ref([]);
  const activeBlockId = ref(null);
  
  const activeBlock = computed(() => 
    blocks.value.find(block => block.id === activeBlockId.value)
  );
  
  const blocksCount = computed(() => blocks.value.length);

  const addBlock = (blockType) => {
    const newBlock = {
      id: Date.now().toString(),
      type: blockType,
      content: getDefaultContent(blockType),
      styles: getDefaultStyles(blockType)
    };
    blocks.value.push(newBlock);
    setActiveBlock(newBlock.id);
  };

  const setActiveBlock = (id) => {
    activeBlockId.value = id;
  };

  const updateBlockContent = (id, newContent) => {
    const block = blocks.value.find(block => block.id === id);
    if (block) {
      block.content = newContent;
    }
  };

  // НОВЫЙ МЕТОД: Обновление стилей блока
  const updateBlockStyles = (id, newStyles) => {
    const block = blocks.value.find(block => block.id === id);
    if (block) {
      block.styles = { ...block.styles, ...newStyles };
    }
  };

  const deleteBlock = (id) => {
    blocks.value = blocks.value.filter(block => block.id !== id);
    if (activeBlockId.value === id) {
      activeBlockId.value = null;
    }
  };

  const moveBlock = (fromIndex, toIndex) => {
    if (fromIndex < 0 || fromIndex >= blocks.value.length || 
        toIndex < 0 || toIndex >= blocks.value.length) return;
    
    const block = blocks.value.splice(fromIndex, 1)[0];
    blocks.value.splice(toIndex, 0, block);
  };

  // НОВЫЙ МЕТОД: Дублирование блока
  const duplicateBlock = (id) => {
    const originalBlock = blocks.value.find(block => block.id === id);
    if (originalBlock) {
      const duplicatedBlock = {
        ...JSON.parse(JSON.stringify(originalBlock)),
        id: Date.now().toString()
      };
      const originalIndex = blocks.value.findIndex(block => block.id === id);
      blocks.value.splice(originalIndex + 1, 0, duplicatedBlock);
      setActiveBlock(duplicatedBlock.id);
    }
  };

  // НОВЫЙ МЕТОД: Загрузка проекта
  const loadProject = (projectBlocks) => {
    blocks.value = JSON.parse(JSON.stringify(projectBlocks));
    activeBlockId.value = null;
  };

  // НОВЫЙ МЕТОД: Очистка всех блоков
  const clearAllBlocks = () => {
    blocks.value = [];
    activeBlockId.value = null;
  };

  const getDefaultContent = (type) => {
    const defaults = {
      'hero': 'Заголовок героя',
      'heading': 'Заголовок раздела',
      'paragraph': 'Текст параграфа...', 
      'button': 'Нажмите меня',
      'image': 'https://via.placeholder.com/300x200',
      'text': 'Простой текст',
      'features': 'Блок функций',
      'testimonials': 'Блок отзывов', 
      'contact': 'Контактная форма',
      'footer': 'Футер сайта'
    };
    return defaults[type] || '';
  };

  // НОВЫЙ МЕТОД: Стандартные стили для блоков
  const getDefaultStyles = (type) => {
    const baseStyles = {
      backgroundColor: '#ffffff',
      padding: '15px',
      textAlign: 'left'
    };

    const typeStyles = {
      'hero': {
        backgroundColor: '#667eea',
        color: '#ffffff',
        fontSize: '48px',
        textAlign: 'center',
        padding: '60px 20px'
      },
      'heading': {
        fontSize: '32px',
        color: '#333333',
        fontWeight: 'bold'
      },
      'paragraph': {
        fontSize: '16px',
        color: '#666666',
        lineHeight: '1.6'
      },
      'button': {
        backgroundColor: '#3b1fa1',
        color: '#ffffff',
        fontSize: '16px',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '6px'
      },
      'image': {
        maxWidth: '100%',
        borderRadius: '8px'
      }
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  return {
    blocks,
    activeBlockId,
    activeBlock,
    blocksCount,
    addBlock,
    setActiveBlock,
    updateBlockContent,
    updateBlockStyles, // ЭКСПОРТИРУЕМ НОВЫЙ МЕТОД
    deleteBlock,
    moveBlock,
    duplicateBlock, // ЭКСПОРТИРУЕМ НОВЫЙ МЕТОД
    loadProject, // ЭКСПОРТИРУЕМ НОВЫЙ МЕТОД
    clearAllBlocks // ЭКСПОРТИРУЕМ НОВЫЙ МЕТОД
  };
});