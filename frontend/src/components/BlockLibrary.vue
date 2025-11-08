<template>
  <div class="block-library">
    <h3>📚 Библиотека блоков</h3>
    <div class="block-item" draggable="true">
      📝 Текст
    </div>
    <div class="block-item" draggable="true">
      🖼️ Изображение
    </div>
    <div class="block-item" draggable="true">
      🔘 Кнопка
    </div>
  </div>
</template>

<script setup>
// Логику добавим позже
</script>

<style scoped>
.block-library {
  width: 250px;
  padding: 20px;
  background: #f8f9fa;
  border-right: 2px solid #dee2e6;
  min-height: 100vh;
}

.block-item {
  padding: 15px;
  margin: 10px 0;
  background: white;
  border: 2px dashed #adb5bd;
  border-radius: 8px;
  cursor: grab;
  text-align: center;
  font-weight: bold;
}

.block-item:hover {
  background: #e9ecef;
  border-color: #4dabf7;
  transform: translateY(-2px);
  transition: all 0.2s;
}

.block-item:active {
  cursor: grabbing;
}
</style>