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
      styles: {}
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

  const getDefaultContent = (type) => {
    const defaults = {
      'text': 'Текст блока',
      'image': 'https://via.placeholder.com/300x200',
      'button': 'Нажмите меня',
      'heading': 'Заголовок',
      'paragraph': 'Абзац текста'
    };
    return defaults[type] || '';
  };

  return {
    blocks,
    activeBlockId,
    activeBlock,
    blocksCount,
    addBlock,
    setActiveBlock,
    updateBlockContent,
    deleteBlock,
    moveBlock
  };
});