<script setup>
import FroalaEditor from './components/FroalaEditor.vue';
import { ref } from 'vue';

const recieveContent = ref('');

const handleContentUpdate = (content) => {
  recieveContent.value = content;
}

</script>

<template>
  <div class="app">
    <h1>Froala 编辑器示例</h1>
    <FroalaEditor @update:modelValue="handleContentUpdate" :height="200" />
    <div class="content" v-html="recieveContent">
      
    </div>
  </div>
</template>

<style>
.app {
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}
</style>
