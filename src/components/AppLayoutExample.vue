<template>
  <AppLayout 
    title="我的应用"
    :menu-items="customMenuItems"
    :default-active-item="'dashboard'"
    :show-user-info="true"
    :user-name="'管理员'"
    :auto-collapse="true"
    @menu-change="handleMenuChange"
    @collapse-change="handleCollapseChange"
  >
    <template #content="{ currentView, sidebarCollapsed }">
      <!-- 仪表板视图 -->
      <div v-if="currentView === 'dashboard'" class="view-container">
        <h1>仪表板</h1>
        <div class="dashboard-stats">
          <div class="stat-card">
            <h3>总用户数</h3>
            <p class="stat-number">1,234</p>
          </div>
          <div class="stat-card">
            <h3>今日访问</h3>
            <p class="stat-number">567</p>
          </div>
          <div class="stat-card">
            <h3>系统状态</h3>
            <p class="stat-status">正常</p>
          </div>
        </div>
      </div>

      <!-- 用户管理视图 -->
      <div v-else-if="currentView === 'users'" class="view-container">
        <h1>用户管理</h1>
        <div class="user-table">
          <table>
            <thead>
              <tr>
                <th>用户名</th>
                <th>邮箱</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.status }}</td>
                <td>
                  <button class="btn-edit">编辑</button>
                  <button class="btn-delete">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 设置视图 -->
      <div v-else-if="currentView === 'settings'" class="view-container">
        <h1>系统设置</h1>
        <div class="settings-form">
          <div class="form-group">
            <label>系统名称：</label>
            <input type="text" v-model="systemName" />
          </div>
          <div class="form-group">
            <label>侧边栏状态：</label>
            <span>{{ sidebarCollapsed ? '已折叠' : '已展开' }}</span>
          </div>
          <div class="form-group">
            <label>主题模式：</label>
            <select v-model="themeMode">
              <option value="light">明亮模式</option>
              <option value="dark">暗色模式</option>
              <option value="auto">自动</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 报告视图 -->
      <div v-else-if="currentView === 'reports'" class="view-container">
        <h1>数据报告</h1>
        <div class="reports-content">
          <div class="chart-placeholder">
            <p>图表区域</p>
            <p>这里可以集成图表库如 ECharts 或 Chart.js</p>
          </div>
        </div>
      </div>
    </template>
  </AppLayout>
</template>

<script setup>
import AppLayout from './AppLayout.vue';
import { ref } from 'vue';

// 自定义菜单项
const customMenuItems = [
  {
    key: 'dashboard',
    title: '仪表板',
    icon: 'Monitor'
  },
  {
    key: 'users',
    title: '用户管理',
    icon: 'User'
  },
  {
    key: 'reports',
    title: '数据报告',
    icon: 'DataAnalysis'
  },
  {
    key: 'settings',
    title: '系统设置',
    icon: 'Setting'
  }
];

// 响应式数据
const systemName = ref('我的管理系统');
const themeMode = ref('light');
const users = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com', status: '激活' },
  { id: 2, name: '李四', email: 'lisi@example.com', status: '激活' },
  { id: 3, name: '王五', email: 'wangwu@example.com', status: '禁用' }
]);

// 事件处理
const handleMenuChange = (menuItem) => {
  console.log('切换到菜单项:', menuItem);
};

const handleCollapseChange = (collapsed) => {
  console.log('侧边栏折叠状态:', collapsed);
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

/* 仪表板样式 */
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 10px 0;
  font-size: 1rem;
  opacity: 0.9;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
}

.stat-status {
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
  color: #4CAF50;
}

/* 用户表格样式 */
.user-table {
  margin-top: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.btn-edit, .btn-delete {
  padding: 4px 12px;
  margin: 0 4px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-edit {
  background: #409eff;
  color: white;
}

.btn-delete {
  background: #f56c6c;
  color: white;
}

/* 设置表单样式 */
.settings-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.form-group label {
  min-width: 100px;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input,
.form-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 200px;
}

.form-group span {
  color: #409eff;
  font-weight: 500;
}

/* 报告样式 */
.reports-content {
  margin-top: 20px;
}

.chart-placeholder {
  height: 400px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  background: #f8f9fa;
}

.chart-placeholder p {
  margin: 5px 0;
  font-size: 1.1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-stats {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .form-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .form-group label {
    min-width: auto;
  }
  
  .user-table {
    font-size: 0.9rem;
  }
  
  th, td {
    padding: 8px;
  }
}
</style> 