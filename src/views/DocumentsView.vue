<template>
  <div class="view-container">
    <h1>文档管理</h1>
    <div class="toolbar">
      <el-button type="primary" @click="createDocument">
        <el-icon><Plus /></el-icon>
        新建文档
      </el-button>
      <el-input 
        v-model="searchQuery" 
        placeholder="搜索文档..." 
        class="search-input"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    
    <div class="documents-grid">
      <div 
        v-for="doc in filteredDocuments" 
        :key="doc.id" 
        class="document-card"
        @click="openDocument(doc)"
      >
        <div class="document-icon">📄</div>
        <h3>{{ doc.title }}</h3>
        <p>{{ doc.description }}</p>
        <div class="document-meta">
          <span class="date">{{ formatDate(doc.updatedAt) }}</span>
          <div class="actions">
            <el-button size="small" type="primary" @click.stop="editDocument(doc)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button size="small" type="danger" @click.stop="deleteDocument(doc)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredDocuments.length === 0" class="empty-state">
      <el-icon size="64" color="#ddd"><Document /></el-icon>
      <h3>{{ searchQuery ? '未找到匹配的文档' : '暂无文档' }}</h3>
      <p>{{ searchQuery ? '尝试调整搜索条件' : '点击新建文档开始创作' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Search, Edit, Delete, Document } from '@element-plus/icons-vue';

// 响应式数据
const searchQuery = ref('');
const documents = ref([
  {
    id: 1,
    title: '项目文档',
    description: '这是一个重要的项目文档，包含了项目的详细说明...',
    updatedAt: new Date('2024-01-15'),
    content: '<h1>项目文档</h1><p>这里是文档内容...</p>'
  },
  {
    id: 2,
    title: '用户手册',
    description: '完整的用户使用手册，帮助用户快速上手...',
    updatedAt: new Date('2024-01-10'),
    content: '<h1>用户手册</h1><p>使用说明...</p>'
  },
  {
    id: 3,
    title: '技术规范',
    description: '系统的技术实现规范和标准...',
    updatedAt: new Date('2024-01-05'),
    content: '<h1>技术规范</h1><p>技术细节...</p>'
  }
]);

// 计算属性
const filteredDocuments = computed(() => {
  if (!searchQuery.value) {
    return documents.value;
  }
  return documents.value.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 方法
const formatDate = (date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

const createDocument = () => {
  ElMessage.info('创建新文档功能开发中...');
};

const openDocument = (doc) => {
  ElMessage.success(`打开文档: ${doc.title}`);
};

const editDocument = (doc) => {
  ElMessage.info(`编辑文档: ${doc.title}`);
};

const deleteDocument = async (doc) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除文档 "${doc.title}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    const index = documents.value.findIndex(d => d.id === doc.id);
    if (index > -1) {
      documents.value.splice(index, 1);
      ElMessage.success('文档已删除');
    }
  } catch {
    ElMessage.info('已取消删除');
  }
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

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.search-input {
  max-width: 300px;
  min-width: 200px;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.document-card {
  padding: 20px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  background: white;
}

.document-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: #409eff;
}

.document-icon {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 15px;
}

.document-card h3 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.1rem;
  font-weight: 600;
}

.document-card p {
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.document-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.date {
  color: #999;
  font-size: 0.8rem;
}

.actions {
  display: flex;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state h3 {
  margin: 20px 0 10px 0;
  color: #666;
}

.empty-state p {
  color: #999;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 767px) {
  .view-container {
    padding: 25px;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  .toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .search-input {
    max-width: none;
  }
  
  .documents-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .view-container {
    padding: 15px;
  }
  
  h1 {
    font-size: 1.3rem;
  }
  
  .document-card {
    padding: 15px;
  }
  
  .document-icon {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }
}
</style> 