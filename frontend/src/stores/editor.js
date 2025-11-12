import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useEditorStore = defineStore('editor', () => {
  // Загружаем из localStorage при инициализации
  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem('editor-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.blocks || [];
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return [];
  };

  const blocks = ref(loadFromStorage());
  const activeBlockId = ref(null);
  const pageSettings = ref({
    title: 'Мой сайт',
    backgroundColor: '#ffffff',
    backgroundImage: '',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  });
  
  const activeBlock = computed(() => 
    findBlockById(blocks.value, activeBlockId.value)
  );
  
  const blocksCount = computed(() => blocks.value.length);

  // Сохраняем в localStorage при изменении blocks
  watch(blocks, (newBlocks) => {
    try {
      localStorage.setItem('editor-state', JSON.stringify({
        blocks: newBlocks,
        lastSaved: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, { deep: true });

  // Инициализация структурных блоков
  const initializeStructuralBlocks = () => {
    if (blocks.value.length === 0) {
      blocks.value = [
        {
          id: 'header',
          type: 'header',
          name: 'Шапка',
          content: '',
          styles: {
            backgroundColor: '#ffffff',
            color: '#333333',
            padding: '20px',
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          },
          children: [],
          isStructural: true
        },
        {
          id: 'body',
          type: 'container',
          name: 'Основное содержимое',
          content: '',
          styles: {
            backgroundColor: 'transparent',
            padding: '40px 20px',
            minHeight: '500px'
          },
          children: [],
          isStructural: true
        },
        {
          id: 'footer',
          type: 'footer',
          name: 'Подвал',
          content: '',
          styles: {
            backgroundColor: '#2c3e50',
            color: '#ffffff',
            padding: '40px 20px',
            minHeight: '200px',
            textAlign: 'center'
          },
          children: [],
          isStructural: true
        }
      ];
    }
  };

  // Рекурсивный поиск блока по ID
  const findBlockById = (blocksList, blockId) => {
    for (const block of blocksList) {
      if (block.id === blockId) return block;
      if (block.children && block.children.length > 0) {
        const found = findBlockById(block.children, blockId);
        if (found) return found;
      }
    }
    return null;
  };

  // НОВЫЙ МЕТОД: Добавление блока с указанием родителя и позиции
  const addBlock = (blockType, parentId = null, position = null) => {
    const newBlock = {
      id: Date.now().toString(),
      type: blockType,
      name: getBlockName(blockType),
      content: getDefaultContent(blockType),
      styles: getDefaultStyles(blockType),
      children: canHaveChildren(blockType) ? [] : undefined
    };

    console.log('Adding block:', { blockType, parentId, position, newBlock });

    if (parentId && parentId !== 'root') {
      const parentBlock = findBlockById(blocks.value, parentId);
      if (parentBlock && parentBlock.children) {
        if (position !== null && position >= 0 && position <= parentBlock.children.length) {
          parentBlock.children.splice(position, 0, newBlock);
        } else {
          parentBlock.children.push(newBlock);
        }
        console.log('Added to parent:', parentBlock.name, 'children:', parentBlock.children.length);
      }
    } else {
      // Добавляем в корень (между структурными блоками)
      const bodyIndex = blocks.value.findIndex(block => block.id === 'body');
      if (bodyIndex !== -1) {
        if (position !== null && position >= 0 && position <= blocks.value.length) {
          blocks.value.splice(position, 0, newBlock);
        } else {
          blocks.value.splice(bodyIndex, 0, newBlock);
        }
      } else {
        if (position !== null && position >= 0 && position <= blocks.value.length) {
          blocks.value.splice(position, 0, newBlock);
        } else {
          blocks.value.push(newBlock);
        }
      }
    }
    
    setActiveBlock(newBlock.id);
    return newBlock;
  };

  // НОВЫЙ МЕТОД: Перемещение блока
  const moveBlockTo = (blockId, targetParentId, targetPosition) => {
    console.log('Moving block:', { blockId, targetParentId, targetPosition });
    
    const blockToMove = findBlockById(blocks.value, blockId);
    if (!blockToMove) {
      console.error('Block not found:', blockId);
      return false;
    }

    // Нельзя перемещать блок в самого себя
    if (blockId === targetParentId) {
      console.error('Cannot move block into itself');
      return false;
    }

    // Удаляем блок из текущего положения
    const removeFromParent = (blocksList, blockId) => {
      const index = blocksList.findIndex(block => block.id === blockId);
      if (index !== -1) {
        blocksList.splice(index, 1);
        return true;
      }
      
      for (const block of blocksList) {
        if (block.children && block.children.length > 0) {
          if (removeFromParent(block.children, blockId)) {
            return true;
          }
        }
      }
      return false;
    };

    // Сохраняем старые данные перед удалением
    const oldParent = findParentBlock(blocks.value, blockId);
    
    // Удаляем блок
    const removed = removeFromParent(blocks.value, blockId);
    if (!removed) {
      console.error('Failed to remove block from old position');
      return false;
    }

    // Добавляем в новое положение
    if (targetParentId && targetParentId !== 'root') {
      const targetParent = findBlockById(blocks.value, targetParentId);
      if (targetParent && targetParent.children) {
        const finalPosition = targetPosition !== null && targetPosition >= 0 && targetPosition <= targetParent.children.length 
          ? targetPosition 
          : targetParent.children.length;
        
        targetParent.children.splice(finalPosition, 0, blockToMove);
        console.log('Moved to parent:', targetParent.name, 'at position:', finalPosition);
      } else {
        console.error('Target parent not found or cannot have children');
        // Восстанавливаем блок на старое место
        if (oldParent && oldParent.children) {
          oldParent.children.push(blockToMove);
        } else {
          blocks.value.push(blockToMove);
        }
        return false;
      }
    } else {
      // Добавляем в корень
      const finalPosition = targetPosition !== null && targetPosition >= 0 && targetPosition <= blocks.value.length 
        ? targetPosition 
        : blocks.value.length;
      
      blocks.value.splice(finalPosition, 0, blockToMove);
      console.log('Moved to root at position:', finalPosition);
    }

    return true;
  };

  const setActiveBlock = (id) => {
    activeBlockId.value = id;
  };

  const updateBlockContent = (id, newContent) => {
    const block = findBlockById(blocks.value, id);
    if (block) {
      block.content = newContent;
    }
  };

  const updateBlockStyles = (id, newStyles) => {
    const block = findBlockById(blocks.value, id);
    if (block) {
      block.styles = { ...block.styles, ...newStyles };
    }
  };

  const deleteBlock = (id) => {
    const block = findBlockById(blocks.value, id);
    if (block && block.isStructural) {
      alert('Нельзя удалять структурные блоки (Шапка, Тело, Подвал)');
      return;
    }

    const deleteRecursive = (blocksList) => {
      const index = blocksList.findIndex(block => block.id === id);
      if (index !== -1) {
        blocksList.splice(index, 1);
        return true;
      }
      
      for (const block of blocksList) {
        if (block.children && block.children.length > 0) {
          if (deleteRecursive(block.children)) {
            return true;
          }
        }
      }
      return false;
    };

    deleteRecursive(blocks.value);
    
    if (activeBlockId.value === id) {
      activeBlockId.value = null;
    }
  };

  const moveBlock = (blockId, direction) => {
    const moveInArray = (arr, blockId, direction) => {
      const index = arr.findIndex(b => b.id === blockId);
      if (index === -1) return false;

      if (direction === 'up' && index > 0) {
        [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
        return true;
      } else if (direction === 'down' && index < arr.length - 1) {
        [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
        return true;
      }
      return false;
    };

    // Пытаемся переместить в корневом массиве
    if (moveInArray(blocks.value, blockId, direction)) {
      return;
    }

    // Ищем в дочерних элементах
    const findAndMove = (blocksList) => {
      for (const block of blocksList) {
        if (block.children && block.children.length > 0) {
          if (moveInArray(block.children, blockId, direction)) {
            return true;
          }
          if (findAndMove(block.children)) {
            return true;
          }
        }
      }
      return false;
    };

    findAndMove(blocks.value);
  };

  const duplicateBlock = (id) => {
    const originalBlock = findBlockById(blocks.value, id);
    if (originalBlock) {
      const duplicatedBlock = {
        ...JSON.parse(JSON.stringify(originalBlock)),
        id: Date.now().toString(),
        name: `${originalBlock.name} (копия)`
      };
      
      const parent = findParentBlock(blocks.value, id);
      if (parent && parent.children) {
        const originalIndex = parent.children.findIndex(block => block.id === id);
        parent.children.splice(originalIndex + 1, 0, duplicatedBlock);
      } else {
        const originalIndex = blocks.value.findIndex(block => block.id === id);
        blocks.value.splice(originalIndex + 1, 0, duplicatedBlock);
      }
      
      setActiveBlock(duplicatedBlock.id);
    }
  };

  const findParentBlock = (blocksList, childId, parent = null) => {
    for (const block of blocksList) {
      if (block.id === childId) return parent;
      if (block.children && block.children.length > 0) {
        const found = findParentBlock(block.children, childId, block);
        if (found) return found;
      }
    }
    return null;
  };

  const canHaveChildren = (blockType) => {
    const containerTypes = ['container', 'section', 'hero', 'header', 'footer', 'columns', 'column'];
    return containerTypes.includes(blockType);
  };

  const updatePageSettings = (newSettings) => {
    pageSettings.value = { ...pageSettings.value, ...newSettings };
  };

  const loadProject = (projectBlocks) => {
    blocks.value = JSON.parse(JSON.stringify(projectBlocks));
    activeBlockId.value = null;
  };

  const clearAllBlocks = () => {
    blocks.value = [];
    activeBlockId.value = null;
  };

  const getBlockName = (type) => {
    const names = {
      'hero': 'Hero секция',
      'heading': 'Заголовок',
      'paragraph': 'Параграф',
      'button': 'Кнопка',
      'image': 'Изображение',
      'text': 'Текст',
      'container': 'Контейнер',
      'section': 'Секция',
      'columns': 'Колонки',
      'column': 'Колонка'
    };
    return names[type] || type;
  };

  const getDefaultContent = (type) => {
    const defaults = {
      'hero': 'Заголовок героя',
      'heading': 'Заголовок раздела',
      'paragraph': 'Текст параграфа...', 
      'button': 'Нажмите меня',
      'image': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop',
      'text': 'Простой текст...',
      'container': '',
      'section': '',
      'columns': '',
      'column': ''
    };
    return defaults[type] || '';
  };

  const getDefaultStyles = (type) => {
    const baseStyles = {
      backgroundColor: 'transparent',
      backgroundImage: 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#000000',
      fontSize: '16px',
      fontFamily: 'inherit',
      textAlign: 'left',
      padding: '20px',
      margin: '0',
      borderRadius: '0px',
      border: 'none',
      width: '100%',
      minHeight: 'auto',
      display: 'block'
    };

    const typeStyles = {
      'hero': {
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        fontSize: '48px',
        textAlign: 'center',
        padding: '100px 20px',
        minHeight: '500px'
      },
      'heading': {
        fontSize: '32px',
        color: '#333333',
        fontWeight: 'bold',
        padding: '10px 0'
      },
      'paragraph': {
        fontSize: '18px',
        color: '#666666',
        lineHeight: '1.6',
        padding: '10px 0'
      },
      'button': {
        backgroundColor: '#3b1fa1',
        color: '#ffffff',
        fontSize: '18px',
        padding: '12px 30px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'inline-block'
      },
      'image': {
        maxWidth: '100%',
        padding: '0',
        display: 'block'
      },
      'text': {
        fontSize: '16px',
        color: '#333333',
        padding: '5px 0'
      },
      'container': {
        backgroundColor: 'transparent',
        padding: '20px',
        minHeight: '200px'
      },
      'section': {
        backgroundColor: '#f8f9fa',
        padding: '60px 20px',
        minHeight: '300px'
      },
      'columns': {
        display: 'flex',
        gap: '20px',
        padding: '20px',
        minHeight: '200px'
      },
      'column': {
        flex: '1',
        padding: '20px',
        backgroundColor: 'transparent',
        minHeight: '150px'
      }
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  return {
    blocks,
    activeBlockId,
    activeBlock,
    blocksCount,
    pageSettings,
    initializeStructuralBlocks,
    addBlock,
    moveBlockTo, // НОВЫЙ МЕТОД
    setActiveBlock,
    updateBlockContent,
    updateBlockStyles,
    deleteBlock,
    moveBlock,
    duplicateBlock,
    updatePageSettings,
    loadProject,
    clearAllBlocks,
    getDefaultContent,
    findParentBlock,
    canHaveChildren
  };
});