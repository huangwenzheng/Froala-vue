<template>
  <div class="view-container">
    <div class="not-found">
      <div class="error-icon">
        <el-icon :size="120" color="#ddd">
          <Warning />
        </el-icon>
      </div>
      
      <h1>404</h1>
      <h2>页面不存在</h2>
      <p>抱歉，您访问的页面不存在或已被移除。</p>
      
      <div class="actions">
        <el-button type="primary" @click="goHome">
          <el-icon><House /></el-icon>
          返回首页
        </el-button>
        <el-button @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回上页
        </el-button>
      </div>
      
      <div class="suggestion">
        <h3>您可以尝试：</h3>
        <ul>
          <li>检查网址是否正确</li>
          <li>返回上一页重新操作</li>
          <li>使用导航菜单找到您需要的页面</li>
          <li>联系管理员获取帮助</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { Warning, House, ArrowLeft } from '@element-plus/icons-vue';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.go(-1);
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

.not-found {
  text-align: center;
  padding: 60px 20px;
  max-width: 600px;
  margin: 0 auto;
}

.error-icon {
  margin-bottom: 30px;
}

h1 {
  font-size: 5rem;
  font-weight: bold;
  color: #ddd;
  margin: 0 0 20px 0;
  line-height: 1;
}

h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0 0 15px 0;
  font-weight: 600;
}

p {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 40px;
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 50px;
}

.suggestion {
  text-align: left;
  background: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.suggestion h3 {
  color: #2c3e50;
  margin: 0 0 20px 0;
  font-size: 1.2rem;
}

.suggestion ul {
  margin: 0;
  padding-left: 20px;
  color: #5a6c7d;
}

.suggestion li {
  margin-bottom: 8px;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 767px) {
  .view-container {
    padding: 25px;
  }
  
  .not-found {
    padding: 40px 10px;
  }
  
  h1 {
    font-size: 4rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .actions {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  .actions .el-button {
    width: 200px;
  }
}

@media (max-width: 480px) {
  .view-container {
    padding: 15px;
  }
  
  h1 {
    font-size: 3rem;
  }
  
  h2 {
    font-size: 1.3rem;
  }
  
  p {
    font-size: 1rem;
  }
  
  .suggestion {
    padding: 20px;
  }
}
</style> 