<template>
  <div class="view-container">
    <h1>设置</h1>
    
    <!-- 编辑器设置 -->
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <el-icon><Edit /></el-icon>
          <span>编辑器设置</span>
        </div>
      </template>
      
      <el-form :model="editorSettings" label-width="120px">
        <el-form-item label="编辑器主题">
          <el-select v-model="editorSettings.theme" placeholder="选择主题">
            <el-option label="默认" value="default"></el-option>
            <el-option label="暗色" value="dark"></el-option>
            <el-option label="明亮" value="light"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="字体大小">
          <el-slider 
            v-model="editorSettings.fontSize" 
            :min="12" 
            :max="24" 
            :step="1"
            show-input
            :format-tooltip="formatTooltip"
          />
        </el-form-item>
        
        <el-form-item label="自动保存">
          <el-switch v-model="editorSettings.autoSave" />
          <span class="help-text">{{ editorSettings.autoSave ? '已开启' : '已关闭' }}</span>
        </el-form-item>
        
        <el-form-item label="拼写检查">
          <el-switch v-model="editorSettings.spellCheck" />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 系统设置 -->
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </div>
      </template>
      
      <el-form :model="systemSettings" label-width="120px">
        <el-form-item label="语言">
          <el-select v-model="systemSettings.language" placeholder="选择语言">
            <el-option label="简体中文" value="zh-CN"></el-option>
            <el-option label="English" value="en-US"></el-option>
            <el-option label="繁體中文" value="zh-TW"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="时区">
          <el-select v-model="systemSettings.timezone" placeholder="选择时区">
            <el-option label="北京时间 (UTC+8)" value="Asia/Shanghai"></el-option>
            <el-option label="东京时间 (UTC+9)" value="Asia/Tokyo"></el-option>
            <el-option label="纽约时间 (UTC-5)" value="America/New_York"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="通知">
          <el-switch v-model="systemSettings.notifications" />
          <span class="help-text">接收系统通知</span>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 布局设置 -->
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <el-icon><Monitor /></el-icon>
          <span>布局设置</span>
        </div>
      </template>
      
      <el-form :model="layoutSettings" label-width="120px">
        <el-form-item label="侧边栏状态">
          <el-tag :type="layoutSettings.sidebarCollapsed ? 'warning' : 'success'">
            {{ layoutSettings.sidebarCollapsed ? '已折叠' : '已展开' }}
          </el-tag>
        </el-form-item>
        
        <el-form-item label="当前设备类型">
          <el-tag :type="layoutSettings.screenWidth >= 768 ? 'primary' : 'info'">
            {{ layoutSettings.screenWidth >= 768 ? '大屏设备（桌面端）' : '小屏设备（移动端）' }}
          </el-tag>
        </el-form-item>
        
        <el-form-item label="屏幕宽度">
          <el-input 
            :model-value="layoutSettings.screenWidth + 'px'" 
            readonly
          />
        </el-form-item>
        
        <el-form-item label="自动折叠">
          <el-switch v-model="layoutSettings.autoCollapse" />
          <span class="help-text">根据屏幕尺寸自动调整侧边栏状态</span>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮 -->
    <div class="actions">
      <el-button type="primary" @click="saveSettings">
        <el-icon><Check /></el-icon>
        保存设置
      </el-button>
      <el-button @click="resetSettings">
        <el-icon><Refresh /></el-icon>
        重置为默认值
      </el-button>
      <el-button type="danger" @click="clearData">
        <el-icon><Delete /></el-icon>
        清除所有数据
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { 
  Edit, 
  Setting, 
  Monitor, 
  Check, 
  Refresh, 
  Delete 
} from '@element-plus/icons-vue';

// 注入布局状态（从父组件传递）
const layoutState = inject('layoutState', {
  sidebarCollapsed: ref(false),
  screenWidth: ref(0)
});

// 编辑器设置
const editorSettings = ref({
  theme: 'default',
  fontSize: 14,
  autoSave: true,
  spellCheck: true
});

// 系统设置
const systemSettings = ref({
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
  notifications: true
});

// 布局设置
const layoutSettings = ref({
  sidebarCollapsed: layoutState.sidebarCollapsed.value,
  screenWidth: layoutState.screenWidth.value,
  autoCollapse: true
});

// 监听布局状态变化
watch(() => layoutState.sidebarCollapsed.value, (newValue) => {
  layoutSettings.value.sidebarCollapsed = newValue;
});

watch(() => layoutState.screenWidth.value, (newValue) => {
  layoutSettings.value.screenWidth = newValue;
});

// 方法
const formatTooltip = (value) => {
  return `${value}px`;
};

const saveSettings = () => {
  // 这里可以实现保存到localStorage或发送到服务器
  localStorage.setItem('editorSettings', JSON.stringify(editorSettings.value));
  localStorage.setItem('systemSettings', JSON.stringify(systemSettings.value));
  
  ElMessage.success('设置已保存');
};

const resetSettings = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要重置所有设置为默认值吗？',
      '确认重置',
      {
        confirmButtonText: '重置',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    // 重置为默认值
    editorSettings.value = {
      theme: 'default',
      fontSize: 14,
      autoSave: true,
      spellCheck: true
    };
    
    systemSettings.value = {
      language: 'zh-CN',
      timezone: 'Asia/Shanghai',
      notifications: true
    };
    
    ElMessage.success('设置已重置为默认值');
  } catch {
    ElMessage.info('已取消重置');
  }
};

const clearData = async () => {
  try {
    await ElMessageBox.confirm(
      '这将清除所有本地存储的数据，包括设置和文档，此操作不可撤销！',
      '危险操作',
      {
        confirmButtonText: '确认清除',
        cancelButtonText: '取消',
        type: 'error',
        dangerouslyUseHTMLString: true
      }
    );
    
    // 清除localStorage
    localStorage.clear();
    
    ElMessage.success('所有数据已清除');
  } catch {
    ElMessage.info('已取消清除操作');
  }
};

// 组件挂载时加载保存的设置
const loadSettings = () => {
  const savedEditorSettings = localStorage.getItem('editorSettings');
  const savedSystemSettings = localStorage.getItem('systemSettings');
  
  if (savedEditorSettings) {
    editorSettings.value = { ...editorSettings.value, ...JSON.parse(savedEditorSettings) };
  }
  
  if (savedSystemSettings) {
    systemSettings.value = { ...systemSettings.value, ...JSON.parse(savedSystemSettings) };
  }
};

// 初始化
loadSettings();
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

.settings-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #2c3e50;
}

.help-text {
  margin-left: 10px;
  color: #999;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-form-item__label) {
  color: #2c3e50;
  font-weight: 500;
}

:deep(.el-card__header) {
  background: #f8f9fa;
  border-bottom: 1px solid #e1e5e9;
}

/* 响应式设计 */
@media (max-width: 767px) {
  .view-container {
    padding: 25px;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  .actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  :deep(.el-form) {
    .el-form-item__label {
      width: 100px !important;
    }
  }
}

@media (max-width: 480px) {
  .view-container {
    padding: 15px;
  }
  
  h1 {
    font-size: 1.3rem;
  }
  
  :deep(.el-form) {
    .el-form-item__label {
      width: 80px !important;
      font-size: 0.9rem;
    }
  }
  
  .help-text {
    display: block;
    margin-left: 0;
    margin-top: 5px;
  }
}
</style> 