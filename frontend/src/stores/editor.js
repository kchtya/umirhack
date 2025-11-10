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
      console.log('Content updated:', block);
    }
  };

  // НОВЫЙ МЕТОД: Обновление стилей блока
  const updateBlockStyles = (id, newStyles) => {
    const block = blocks.value.find(block => block.id === id);
    if (block) {
      // Сохраняем существующие стили и добавляем новые
      block.styles = { ...block.styles, ...newStyles };
      console.log('Styles updated:', block.styles);
    }
  };

  const deleteBlock = (id) => {
    const blockIndex = blocks.value.findIndex(block => block.id === id);
    if (blockIndex !== -1) {
      blocks.value.splice(blockIndex, 1);
      if (activeBlockId.value === id) {
        activeBlockId.value = null;
      }
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
      'image': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
      'text': 'Простой текст',
      'features': 'Описание функций вашего продукта',
      'testimonials': 'Отзывы клиентов о вашем продукте', 
      'contact': 'Контактная информация',
      'footer': 'Футер сайта с дополнительной информацией'
    };
    return defaults[type] || '';
  };

  // НОВЫЙ МЕТОД: Стандартные стили для блоков
  const getDefaultStyles = (type) => {
    const baseStyles = {
      backgroundColor: '#ffffff',
      color: '#000000',
      fontSize: '16px',
      fontFamily: 'inherit',
      textAlign: 'left',
      padding: '20px',
      margin: '10px 0',
      borderRadius: '8px',
      border: 'none',
      width: '100%',
      minHeight: 'auto'
    };

    const typeStyles = {
      'hero': {
        backgroundColor: '#667eea',
        color: '#ffffff',
        fontSize: '48px',
        textAlign: 'center',
        padding: '80px 20px',
        fontFamily: 'inherit',
        minHeight: '300px'
      },
      'heading': {
        fontSize: '32px',
        color: '#333333',
        fontWeight: 'bold',
        padding: '30px 20px',
        fontFamily: 'inherit'
      },
      'paragraph': {
        fontSize: '18px',
        color: '#666666',
        lineHeight: '1.6',
        padding: '20px',
        fontFamily: 'inherit'
      },
      'button': {
        backgroundColor: '#3b1fa1',
        color: '#ffffff',
        fontSize: '18px',
        padding: '15px 30px',
        border: 'none',
        borderRadius: '8px',
        fontFamily: 'inherit',
        width: 'auto',
        cursor: 'pointer'
      },
      'image': {
        maxWidth: '100%',
        borderRadius: '8px',
        padding: '10px',
        backgroundColor: 'transparent',
        minHeight: '200px'
      },
      'text': {
        fontSize: '16px',
        color: '#333333',
        padding: '15px',
        fontFamily: 'inherit'
      },
      'features': {
        backgroundColor: '#f8f9fa',
        color: '#333333',
        padding: '40px 20px',
        textAlign: 'center',
        fontFamily: 'inherit'
      },
      'testimonials': {
        backgroundColor: '#e9ecef',
        color: '#333333',
        padding: '40px 20px',
        textAlign: 'center',
        fontFamily: 'inherit'
      },
      'contact': {
        backgroundColor: '#dee2e6',
        color: '#333333',
        padding: '40px 20px',
        fontFamily: 'inherit'
      },
      'footer': {
        backgroundColor: '#343a40',
        color: '#ffffff',
        padding: '30px 20px',
        textAlign: 'center',
        fontFamily: 'inherit'
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
    updateBlockStyles,
    deleteBlock,
    moveBlock,
    duplicateBlock,
    loadProject,
    clearAllBlocks,
    getDefaultContent
  };
});