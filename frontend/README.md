# 🗳️ 实时投票系统 - 前端

这是一个基于 React + TypeScript + Vite 构建的现代化实时投票系统前端应用。

## ✨ 功能特性

- 📊 **实时投票**：支持多人同时投票，结果实时更新
- 📈 **数据可视化**：使用 ECharts 展示投票结果，支持饼图展示
- 🔗 **实时通信**：基于 WebSocket 实现实时数据推送
- 📱 **响应式设计**：适配桌面端和移动端设备
- 🎨 **现代化 UI**：使用 Ant Design 组件库，界面美观易用
- 🚀 **防重复投票**：基于本地存储的简单防重复投票机制
- ⚡ **高性能**：使用 Vite 构建，开发体验优秀

## 🛠️ 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **UI 组件库**: Ant Design 5
- **图表库**: ECharts + echarts-for-react
- **HTTP 客户端**: Axios
- **实时通信**: Socket.IO Client
- **样式**: CSS3 + CSS Modules
- **状态管理**: React Hooks

## 📁 项目结构

```
frontend/
├── src/
│   ├── components/          # React 组件
│   │   ├── VoteOptions.tsx     # 投票选项组件
│   │   ├── VoteChart.tsx       # 投票结果图表组件
│   │   └── ConnectionStatus.tsx # 连接状态组件
│   ├── hooks/               # 自定义 Hooks
│   │   └── useVoting.ts        # 投票逻辑 Hook
│   ├── services/            # 服务层
│   │   ├── api.ts              # API 服务
│   │   └── websocket.ts        # WebSocket 服务
│   ├── types/               # TypeScript 类型定义
│   │   └── index.ts            # 核心类型
│   ├── config/              # 配置文件
│   │   └── constants.ts        # 应用常量
│   ├── App.tsx              # 主应用组件
│   ├── App.css              # 主样式文件
│   ├── main.tsx             # 应用入口
│   └── vite-env.d.ts        # Vite 环境变量类型
├── public/                  # 静态资源
├── package.json             # 项目依赖
├── vite.config.ts           # Vite 配置
├── tsconfig.json            # TypeScript 配置
└── README.md               # 项目文档
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install
# 或
yarn install
```

### 开发运行

```bash
# 启动开发服务器
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建部署

```bash
# 构建生产版本
npm run build
# 或
yarn build

# 预览构建结果
npm run preview
# 或
yarn preview
```

## 🔧 配置说明

### Vite 配置

项目使用 Vite 作为构建工具，配置文件为 `vite.config.ts`：

- **开发服务器**：端口 3000，支持热更新
- **代理配置**：API 请求代理到后端服务器
- **WebSocket 代理**：Socket.IO 连接代理配置

### 环境变量

支持以下环境变量配置（在 `.env` 文件中设置）：

```bash
# API 基础 URL
VITE_API_BASE_URL=http://localhost:8000

# WebSocket 连接 URL  
VITE_WS_URL=ws://localhost:8000

# 应用配置
VITE_APP_NAME=实时投票系统
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true

# 超时和重连配置
VITE_REQUEST_TIMEOUT=10000
VITE_WS_RECONNECT_ATTEMPTS=5
VITE_WS_RECONNECT_INTERVAL=3000
```

## 📦 核心组件

### VoteOptions 组件

投票选项展示和提交组件：

- 显示投票问卷标题和选项
- 支持单选投票
- 投票后显示结果进度条
- 防重复投票机制

### VoteChart 组件

投票结果可视化组件：

- 使用 ECharts 饼图展示结果
- 支持响应式布局
- 动态更新投票数据
- 自定义颜色主题

### ConnectionStatus 组件

WebSocket 连接状态组件：

- 实时显示连接状态
- 支持手动重连
- 连接异常时的用户提示

## 🔗 API 接口

前端与后端通过以下接口进行通信：

### REST API

- `GET /api/poll` - 获取当前投票问卷
- `POST /api/poll/vote` - 提交投票

### WebSocket 事件

- `connect` - 连接建立
- `poll_update` - 投票结果更新
- `vote_result` - 投票提交结果
- `disconnect` - 连接断开

## 🎨 样式设计

### 设计原则

- **简洁现代**：采用现代化的设计语言
- **响应式**：适配各种屏幕尺寸
- **一致性**：统一的颜色和间距规范
- **可访问性**：良好的对比度和交互反馈

### 主题配色

- **主色调**：蓝色系 (#1890ff)
- **成功色**：绿色系 (#52c41a)  
- **警告色**：橙色系 (#faad14)
- **错误色**：红色系 (#f5222d)

## 🔧 开发指南

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 使用 Prettier 进行代码格式化
- 组件使用函数式组件 + Hooks

### 状态管理

使用 React Hooks 进行状态管理：

- `useState` - 本地状态
- `useEffect` - 副作用处理
- `useCallback` - 函数优化
- `useMemo` - 值缓存
- 自定义 Hook - 业务逻辑封装

### 错误处理

- API 错误统一在 axios 拦截器中处理
- WebSocket 错误通过事件监听处理
- 用户友好的错误提示

## 🚀 性能优化

- **代码分割**：使用动态导入进行路由级代码分割
- **懒加载**：图表组件按需加载
- **缓存优化**：合理使用 useMemo 和 useCallback
- **包大小优化**：按需导入 Ant Design 组件

## 🐛 调试指南

### 开发工具

- **React DevTools**：React 组件调试
- **浏览器开发者工具**：网络请求和 WebSocket 调试
- **Redux DevTools**：状态管理调试（如需要）

### 常见问题

1. **WebSocket 连接失败**
   - 检查后端服务是否启动
   - 确认代理配置是否正确

2. **API 请求失败**
   - 检查网络连接
   - 确认后端 API 地址是否正确

3. **图表不显示**
   - 检查 ECharts 是否正确加载
   - 确认数据格式是否正确

## 📄 许可证

MIT License

## 🤝 贡献指南

欢迎提交 Pull Request 或创建 Issue。

## 📞 联系我们

如有问题或建议，请通过以下方式联系：

- 邮箱：[your-email@example.com]
- GitHub：[github-username] 