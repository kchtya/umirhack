<template>
  <div class="home">
    <header class="header">
      <h1>🏗️ Конструктор Лендингов</h1>
      <p>Создайте идеальный лендинг за минуты!</p>
    </header>
    
    <div class="editor-layout">
      <BlockLibrary />
      <div class="canvas">
        <h3>🎨 Холст</h3>
        <p>Перетащите блоки сюда чтобы начать создание</p>
        <div class="empty-state">
          🖱️ Перетащите блоки из левой панели
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BlockLibrary from '../components/BlockLibrary.vue'
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
</style>