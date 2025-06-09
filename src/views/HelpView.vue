<template>
  <div class="view-container">
    <h1>帮助中心</h1>
    
    <!-- 搜索框 -->
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        placeholder="搜索帮助内容..."
        size="large"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 帮助分类 -->
    <div class="help-categories">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="category in helpCategories" :key="category.id">
          <el-card 
            class="category-card" 
            :body-style="{ padding: '20px' }"
            @click="selectCategory(category)"
          >
            <div class="category-header">
              <el-icon :size="32" :color="category.color">
                <component :is="category.icon" />
              </el-icon>
              <h3>{{ category.title }}</h3>
            </div>
            <p class="category-description">{{ category.description }}</p>
            <div class="category-count">{{ category.articles.length }} 篇文章</div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 详细内容 -->
    <div v-if="selectedCategory" class="help-content">
      <el-card>
        <template #header>
          <div class="content-header">
            <el-button @click="selectedCategory = null" text>
              <el-icon><ArrowLeft /></el-icon>
              返回分类
            </el-button>
            <h2>{{ selectedCategory.title }}</h2>
          </div>
        </template>
        
        <el-collapse v-model="activeArticles" accordion>
          <el-collapse-item 
            v-for="article in filteredArticles" 
            :key="article.id"
            :title="article.title" 
            :name="article.id"
          >
            <div class="article-content" v-html="article.content"></div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>

    <!-- 快速链接 -->
    <div v-if="!selectedCategory" class="quick-links">
      <h2>快速链接</h2>
      <el-row :gutter="15">
        <el-col :xs="12" :sm="6" v-for="link in quickLinks" :key="link.id">
          <el-button 
            class="quick-link-btn" 
            @click="handleQuickLink(link)"
            text
          >
            <el-icon>
              <component :is="link.icon" />
            </el-icon>
            <span>{{ link.title }}</span>
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 联系支持 -->
    <div v-if="!selectedCategory" class="contact-support">
      <el-card>
        <template #header>
          <h2>需要更多帮助？</h2>
        </template>
        <p>如果您没有找到所需的答案，可以通过以下方式联系我们：</p>
        <div class="contact-methods">
          <el-button type="primary" @click="openSupport">
            <el-icon><Message /></el-icon>
            在线客服
          </el-button>
          <el-button @click="sendFeedback">
            <el-icon><EditPen /></el-icon>
            意见反馈
          </el-button>
          <el-button @click="viewFAQ">
            <el-icon><QuestionFilled /></el-icon>
            常见问题
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { 
  Search, 
  ArrowLeft, 
  Edit, 
  Setting, 
  QuestionFilled,
  Document,
  Monitor,
  Message,
  EditPen,
  Key,
  Connection,
  VideoPlay
} from '@element-plus/icons-vue';

// 响应式数据
const searchQuery = ref('');
const selectedCategory = ref(null);
const activeArticles = ref([]);

// 帮助分类
const helpCategories = ref([
  {
    id: 'editor',
    title: '编辑器使用',
    description: '学习如何使用富文本编辑器的各种功能',
    icon: 'Edit',
    color: '#409eff',
    articles: [
      {
        id: 'editor-1',
        title: '如何使用编辑器？',
        content: `
          <h3>基本操作</h3>
          <p>Froala编辑器是一个功能强大的富文本编辑器，您可以：</p>
          <ul>
            <li>输入和编辑文本内容</li>
            <li>插入图片、链接和媒体文件</li>
            <li>设置文本格式（加粗、斜体、下划线等）</li>
            <li>创建表格和列表</li>
            <li>插入代码块和公式</li>
          </ul>
          <h3>高级功能</h3>
          <p>编辑器还支持以下高级功能：</p>
          <ul>
            <li>实时协作编辑</li>
            <li>版本历史记录</li>
            <li>自动保存草稿</li>
            <li>导入/导出多种格式</li>
          </ul>
        `
      },
      {
        id: 'editor-2',
        title: '快捷键大全',
        content: `
          <h3>常用快捷键</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
            <tr style="background: #f5f5f5;">
              <th style="border: 1px solid #ddd; padding: 8px;">功能</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Windows/Linux</th>
              <th style="border: 1px solid #ddd; padding: 8px;">macOS</th>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">加粗</td>
              <td style="border: 1px solid #ddd; padding: 8px;">Ctrl + B</td>
              <td style="border: 1px solid #ddd; padding: 8px;">Cmd + B</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">斜体</td>
              <td style="border: 1px solid #ddd; padding: 8px;">Ctrl + I</td>
              <td style="border: 1px solid #ddd; padding: 8px;">Cmd + I</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">下划线</td>
              <td style="border: 1px solid #ddd; padding: 8px;">Ctrl + U</td>
              <td style="border: 1px solid #ddd; padding: 8px;">Cmd + U</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">撤销</td>
              <td style="border: 1px solid #ddd; padding: 8px;">Ctrl + Z</td>
              <td style="border: 1px solid #ddd; padding: 8px;">Cmd + Z</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">重做</td>
              <td style="border: 1px solid #ddd; padding: 8px;">Ctrl + Y</td>
              <td style="border: 1px solid #ddd; padding: 8px;">Cmd + Shift + Z</td>
            </tr>
          </table>
        `
      }
    ]
  },
  {
    id: 'layout',
    title: '布局系统',
    description: '了解应用的布局组件和响应式设计',
    icon: 'Monitor',
    color: '#67c23a',
    articles: [
      {
        id: 'layout-1',
        title: '侧边栏操作指南',
        content: `
          <h3>侧边栏功能</h3>
          <p>侧边栏是应用的主要导航组件，提供以下功能：</p>
          <ul>
            <li><strong>始终可见</strong>：侧边栏不会完全隐藏，确保导航始终可用</li>
            <li><strong>智能折叠</strong>：根据屏幕尺寸自动调整展开/折叠状态</li>
            <li><strong>手动控制</strong>：点击顶部折叠按钮可手动切换状态</li>
          </ul>
          <h3>响应式行为</h3>
          <ul>
            <li><strong>大屏设备（≥768px）</strong>：默认展开，宽度280px</li>
            <li><strong>小屏设备（<768px）</strong>：默认折叠，展开时宽度240px</li>
            <li><strong>折叠状态</strong>：所有设备折叠时宽度64px，仅显示图标</li>
          </ul>
        `
      },
      {
        id: 'layout-2',
        title: '响应式设计说明',
        content: `
          <h3>设计理念</h3>
          <p>应用采用移动优先的响应式设计，确保在不同设备上都有最佳体验：</p>
          <ul>
            <li><strong>自适应布局</strong>：内容区域会根据侧边栏状态自动调整</li>
            <li><strong>智能断点</strong>：在关键屏幕尺寸处优化显示效果</li>
            <li><strong>触摸友好</strong>：移动端优化了按钮大小和间距</li>
          </ul>
          <h3>使用建议</h3>
          <ul>
            <li>桌面端可充分利用展开的侧边栏进行快速导航</li>
            <li>移动端建议使用折叠状态以节省屏幕空间</li>
            <li>平板端可根据使用场景灵活切换</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 'settings',
    title: '系统设置',
    description: '自定义应用的各种设置和偏好',
    icon: 'Setting',
    color: '#e6a23c',
    articles: [
      {
        id: 'settings-1',
        title: '个性化配置',
        content: `
          <h3>编辑器设置</h3>
          <p>您可以根据个人喜好调整编辑器的各种设置：</p>
          <ul>
            <li><strong>主题选择</strong>：支持默认、暗色、明亮三种主题</li>
            <li><strong>字体大小</strong>：12px-24px可调节</li>
            <li><strong>自动保存</strong>：开启后会自动保存编辑内容</li>
            <li><strong>拼写检查</strong>：实时检查拼写错误</li>
          </ul>
          <h3>系统设置</h3>
          <ul>
            <li><strong>语言</strong>：支持简体中文、English、繁體中文</li>
            <li><strong>时区</strong>：选择您所在的时区</li>
            <li><strong>通知</strong>：控制是否接收系统通知</li>
          </ul>
        `
      },
      {
        id: 'settings-2',
        title: '数据管理',
        content: `
          <h3>数据保存</h3>
          <p>应用使用本地存储来保存您的设置和数据：</p>
          <ul>
            <li>设置会自动保存到浏览器本地存储</li>
            <li>编辑的文档内容支持自动保存</li>
            <li>清除数据会删除所有本地存储的信息</li>
          </ul>
          <h3>安全提示</h3>
          <ul>
            <li>定期备份重要文档</li>
            <li>清除浏览器数据前请确认已备份</li>
            <li>在共享设备上使用后建议清除数据</li>
          </ul>
        `
      }
    ]
  }
]);

// 快速链接
const quickLinks = ref([
  { id: 1, title: '快捷键', icon: 'Key', action: 'shortcuts' },
  { id: 2, title: '视频教程', icon: 'VideoPlay', action: 'videos' },
  { id: 3, title: '更新日志', icon: 'Document', action: 'changelog' },
  { id: 4, title: '技术支持', icon: 'Connection', action: 'support' }
]);

// 计算属性
const filteredArticles = computed(() => {
  if (!selectedCategory.value) return [];
  
  if (!searchQuery.value) {
    return selectedCategory.value.articles;
  }
  
  return selectedCategory.value.articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 方法
const selectCategory = (category) => {
  selectedCategory.value = category;
  activeArticles.value = [];
};

const handleQuickLink = (link) => {
  switch (link.action) {
    case 'shortcuts':
      selectCategory(helpCategories.value[0]);
      activeArticles.value = ['editor-2'];
      break;
    case 'videos':
      ElMessage.info('视频教程功能开发中...');
      break;
    case 'changelog':
      ElMessage.info('更新日志功能开发中...');
      break;
    case 'support':
      openSupport();
      break;
  }
};

const openSupport = () => {
  ElMessage.info('正在连接在线客服...');
};

const sendFeedback = () => {
  ElMessage.info('意见反馈功能开发中...');
};

const viewFAQ = () => {
  ElMessage.info('常见问题功能开发中...');
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

h2 {
  color: #2c3e50;
  margin: 25px 0 15px 0;
  font-size: 1.3rem;
}

.search-section {
  margin-bottom: 30px;
}

.help-categories {
  margin-bottom: 30px;
}

.category-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.category-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 15px;
}

.category-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.category-description {
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 15px;
}

.category-count {
  color: #999;
  font-size: 0.8rem;
}

.help-content {
  margin-bottom: 30px;
}

.content-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.content-header h2 {
  margin: 0;
}

.article-content {
  line-height: 1.6;
  color: #5a6c7d;
}

.article-content h3 {
  color: #2c3e50;
  margin: 20px 0 10px 0;
}

.article-content ul {
  margin: 10px 0;
  padding-left: 25px;
}

.article-content li {
  margin-bottom: 5px;
}

.quick-links {
  margin-bottom: 30px;
}

.quick-link-btn {
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  margin-bottom: 10px;
}

.quick-link-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.contact-support {
  margin-top: 30px;
}

.contact-methods {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.el-row{
    row-gap: 10px;
}

/* 响应式设计 */
@media (max-width: 767px) {
  .view-container {
    padding: 25px;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  .category-header {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  
  .contact-methods {
    flex-direction: column;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .view-container {
    padding: 15px;
  }
  
  h1 {
    font-size: 1.3rem;
  }
  
  .quick-link-btn {
    height: 50px;
  }
}
</style> 