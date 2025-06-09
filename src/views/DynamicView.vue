<template>
  <div class="view-container">
    <!-- 页面头部 -->
    <div class="view-header">
      <div class="header-left">
        <h1>{{ pageTitle }}</h1>
        <div class="breadcrumb" v-if="breadcrumbItems.length > 0">
          <span v-for="(item, index) in breadcrumbItems" :key="index" class="breadcrumb-item">
            {{ item }}
            <el-icon v-if="index < breadcrumbItems.length - 1" class="breadcrumb-separator">
              <ArrowRight />
            </el-icon>
          </span>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="header-actions" v-if="availableActions.length > 0">
        <el-button 
          v-for="action in availableActions" 
          :key="action.id"
          :type="getButtonType(action.name)"
          :icon="getActionIcon(action.name)"
          @click="handleAction(action)"
        >
          {{ action.name }}
        </el-button>
      </div>
    </div>

    <!-- 页面内容 -->
    <div class="view-content">
      <!-- 数据表格区域 -->
      <el-card v-if="isListPage" class="table-card">
        <template #header>
          <div class="card-header">
            <span>{{ pageTitle }}列表</span>
            <div class="card-actions">
              <el-input
                v-model="searchQuery"
                placeholder="搜索..."
                :prefix-icon="Search"
                style="width: 200px; margin-right: 10px;"
                clearable
              />
              <el-button type="primary" :icon="Refresh" @click="refreshData">
                刷新
              </el-button>
            </div>
          </div>
        </template>
        
        <!-- 模拟数据表格 -->
        <el-table 
          :data="tableData" 
          v-loading="loading"
          style="width: 100%"
          empty-text="暂无数据"
        >
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="名称" min-width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === '正常' ? 'success' : 'warning'">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="updateTime" label="更新时间" width="180" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button 
                v-for="action in rowActions" 
                :key="action.id"
                :type="getButtonType(action.name)"
                size="small"
                @click="handleRowAction(action, row)"
              >
                {{ action.name }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>

      <!-- 功能页面内容 -->
      <el-card v-else class="content-card">
        <div class="feature-content">
          <el-empty 
            :image-size="100"
            description="功能页面开发中..."
          >
            <template #image>
              <el-icon size="100" color="#c0c4cc">
                <component :is="pageIcon" />
              </el-icon>
            </template>
            <el-button type="primary" @click="goBack">返回上级</el-button>
          </el-empty>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Search, 
  Refresh, 
  ArrowRight,
  Edit,
  Delete,
  View,
  Plus,
  Setting
} from '@element-plus/icons-vue'

// 路由相关
const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(100)

// 模拟表格数据
const tableData = ref([
  {
    id: 1,
    name: '示例数据1',
    status: '正常',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: '示例数据2',
    status: '待审核',
    createTime: '2024-01-02 10:00:00',
    updateTime: '2024-01-02 10:00:00'
  },
  {
    id: 3,
    name: '示例数据3',
    status: '正常',
    createTime: '2024-01-03 10:00:00',
    updateTime: '2024-01-03 10:00:00'
  }
])

// 计算属性
const pageTitle = computed(() => route.meta.title || '页面')
const pageIcon = computed(() => route.meta.icon || 'Document')
const isListPage = computed(() => route.name && route.name.includes('list'))
const availableActions = computed(() => route.meta.permissions || [])

// 面包屑导航
const breadcrumbItems = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const items = []
  
  if (pathSegments.length > 1) {
    items.push(pathSegments[0]) // 顶级分类
    if (pathSegments.length > 2) {
      items.push(pageTitle.value) // 当前页面
    }
  }
  
  return items
})

// 行操作按钮（过滤出适合表格行的操作）
const rowActions = computed(() => {
  return availableActions.value.filter(action => 
    ['编辑', '删除', '查看'].includes(action.name)
  )
})

// 方法
const getButtonType = (actionName) => {
  const typeMap = {
    '添加': 'primary',
    '编辑': 'primary',
    '删除': 'danger', 
    '查看': 'info',
    '查看所有数据': 'success'
  }
  return typeMap[actionName] || 'default'
}

const getActionIcon = (actionName) => {
  const iconMap = {
    '添加': Plus,
    '编辑': Edit,
    '删除': Delete,
    '查看': View,
    '查看所有数据': View
  }
  return iconMap[actionName] || Setting
}

const handleAction = (action) => {
  ElMessage.info(`执行操作: ${action.name}`)
  // 这里可以根据 action.action 进行路由跳转或其他操作
  console.log('执行操作:', action)
}

const handleRowAction = (action, row) => {
  ElMessage.info(`对 ${row.name} 执行 ${action.name}`)
  console.log('行操作:', action, row)
}

const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据刷新成功')
  }, 1000)
}

const handleSizeChange = (size) => {
  pageSize.value = size
  refreshData()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  refreshData()
}

const goBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  console.log('动态页面加载:', route.path, route.meta)
})
</script>

<style scoped>
.view-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  min-height: calc(100vh - 40px);
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.header-left h1 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
}

.breadcrumb {
  display: flex;
  align-items: center;
  color: #909399;
  font-size: 0.9rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-separator {
  margin: 0 8px;
  font-size: 12px;
}

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.view-content {
  /* 内容区域样式 */
}

.table-card, .content-card {
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-actions {
  display: flex;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.feature-content {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 767px) {
  .view-container {
    padding: 20px;
  }
  
  .view-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .header-left h1 {
    font-size: 1.4rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .card-actions {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .view-container {
    padding: 15px;
  }
  
  .header-left h1 {
    font-size: 1.2rem;
  }
  
  .pagination-container {
    justify-content: center;
  }
}
</style> 