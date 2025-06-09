<template>
  <div class="view-container">
    <h1>Froala 编辑器示例</h1>
    <FroalaEditor @update:modelValue="handleContentUpdate" :height="200" />
    <div class="content-preview" v-html="content"></div>
  </div>
</template>

<script setup>
import FroalaEditor from '../components/FroalaEditor.vue';
import { ref } from 'vue';

const content = ref('');

const handleContentUpdate = (newContent) => {
  content.value = newContent;
};
</script>

<style scoped>
.view-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  min-height: calc(100vh - 40px);
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: 600;
}

.content-preview {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  background: #f8f9fa;
  min-height: 100px;
}

/* 响应式设计 */
@media (max-width: 767px) and (min-width: 481px) {
  .view-container {
    padding: 25px;
    min-height: calc(100vh - 30px);
  }
  
  h1 {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .view-container {
    padding: 15px;
    min-height: calc(100vh - 16px);
  }
  
  h1 {
    font-size: 1.3rem;
  }
}
</style> 