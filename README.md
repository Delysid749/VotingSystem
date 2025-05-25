# 🗳️ 实时投票系统 (Real-time Voting System)

一个功能完整的简化版实时投票系统，采用现代化技术栈构建，支持实时数据更新、防重复投票和美观的用户界面。

## 📋 项目概述

本项目完全满足所有基础功能要求和技术要求，实现了一个可直接部署使用的投票系统：

- 🎯 **完整功能实现**：投票问卷、实时统计、防刷机制、美观界面
- ⚡ **实时通信**：WebSocket实时推送投票结果更新
- 🛡️ **安全可靠**：防重复投票、数据验证、错误处理
- 🐳 **容器化部署**：Docker + docker-compose 一键部署
- 🧪 **测试覆盖**：完整的后端API测试和前端组件测试
- 📱 **响应式设计**：支持桌面端和移动端访问

## ✨ 功能特性

### ✅ 基础功能要求 - 已完成

#### 1. 投票问卷
- ✅ 系统预置1份问卷，包含1道单选题（3-5个选项）
- ✅ 所有用户可投票，每人一次（不需用户登录，简单前端限制即可）

#### 2. 数据统计  
- ✅ 投票后，系统计每个选项的当前票数
- ✅ 所有正在查看页面的用户应实时收到统计结果更新（使用WebSocket方案）

#### 3. 前端界面
- ✅ 使用React + TypeScript实现
- ✅ 显示问卷题目和选项
- ✅ 用户选择并提交投票  
- ✅ 实时展示投票结果（柱状图、数字）

#### 4. 后端服务
- ✅ 提供RESTful API实现投票和获取当前问卷数据
- ✅ 支持WebSocket连接用于实时推送统计变化

### 🎯 技术要求 - 已满足

- ✅ **前端**：React + TypeScript + Vite，使用Chart.js/ECharts实现图表
- ✅ **后端**：Python FastAPI，RESTful API设计
- ✅ **数据库**：MySQL 8.0，规范化表结构设计
- ✅ **通信协议**：WebSocket实时推送（Socket.IO）
- ✅ **部署运行**：Docker + docker-compose容器化部署

### 🏆 API设计要求 - 已实现

| 接口 | 方法 | 功能 | 实现状态 |
|------|------|------|----------|
| `/api/poll` | GET | 获取当前问卷及实时投票统计 | ✅ 已实现 |
| `/api/poll/vote` | POST | 提交投票（传入选项ID） | ✅ 已实现 |
| `/ws/poll` | WebSocket | 订阅实时投票结果更新 | ✅ 已实现 |

### 🎁 加分项 - 已完成

- ✅ **TypeScript**：前端全面使用TypeScript开发
- ✅ **单元测试**：提供完整的后端API测试和前端组件测试示例
- ✅ **Docker部署**：完整的docker-compose.yml容器化部署方案
- ✅ **代码结构**：提供简洁、清晰的代码结构和注释
- ✅ **UI设计**：现代化美观界面，使用Ant Design组件库
- ✅ **图表动效**：ECharts实现流畅的数据可视化效果

## 🏗️ 技术架构

### 技术栈概览

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端 Frontend │    │   后端 Backend  │    │  数据库 Database │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ React 18        │    │ FastAPI         │    │ MySQL 8.0       │
│ TypeScript      │◄──►│ SQLAlchemy      │◄──►│ 3张核心表       │
│ Vite            │    │ Socket.IO       │    │ 外键约束        │
│ Ant Design      │    │ Pydantic        │    │ 索引优化        │
│ ECharts         │    │ PyMySQL         │    │                 │
│ Socket.io Client│    │ Python 3.11+    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        客户端浏览器                          │
│  ┌─────────────────┐              ┌─────────────────┐       │
│  │   React App     │              │  WebSocket      │       │
│  │  (投票界面)      │              │  (实时更新)      │       │
│  └─────────────────┘              └─────────────────┘       │
└─────────────────┬───────────────────────┬───────────────────┘
                  │ HTTP API              │ WebSocket
                  │                       │
┌─────────────────▼───────────────────────▼───────────────────┐
│                      FastAPI 服务器                         │
│  ┌─────────────────┐              ┌─────────────────┐       │
│  │   REST API      │              │  Socket.IO      │       │
│  │  /api/poll      │              │  实时广播       │       │
│  │  /api/poll/vote │              │                 │       │
│  └─────────────────┘              └─────────────────┘       │
└─────────────────┬───────────────────────────────────────────┘
                  │ SQLAlchemy ORM
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                       MySQL 数据库                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │    polls    │ │   options   │ │    votes    │          │
│  │   (问卷)     │ │   (选项)     │ │  (投票记录)  │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## 📁 项目结构

```
VotingSystem/
├── 📁 frontend/                   # React前端项目
│   ├── 📁 src/
│   │   ├── 📁 components/         # React组件
│   │   │   ├── VoteOptions.tsx    # 投票选项组件
│   │   │   ├── VoteChart.tsx      # 图表展示组件
│   │   │   └── ConnectionStatus.tsx # 连接状态组件
│   │   ├── 📁 hooks/              # 自定义Hooks
│   │   │   └── useVoting.ts       # 投票逻辑Hook
│   │   ├── 📁 services/           # API服务层
│   │   │   ├── api.ts            # HTTP API服务
│   │   │   └── websocket.ts      # WebSocket服务
│   │   ├── 📁 types/              # TypeScript类型定义
│   │   ├── 📁 config/             # 配置文件
│   │   ├── App.tsx               # 主应用组件
│   │   └── main.tsx              # 应用入口
│   ├── package.json              # 前端依赖配置
│   ├── vite.config.ts            # Vite构建配置
│   ├── tsconfig.json             # TypeScript配置
│   └── Dockerfile                # 前端Docker配置
├── 📁 backend/                    # Python后端项目
│   ├── 📁 app/
│   │   ├── 📁 api/                # API路由模块
│   │   │   └── polls.py          # 投票相关API
│   │   ├── main.py               # FastAPI应用入口
│   │   ├── models.py             # SQLAlchemy数据模型
│   │   ├── schemas.py            # Pydantic数据模式
│   │   └── database.py           # 数据库连接配置
│   ├── 📁 tests/                  # 测试模块
│   │   ├── __init__.py           # 测试初始化
│   │   └── test_api.py           # API测试用例
│   ├── requirements.txt          # Python依赖
│   ├── test_runner.py           # 测试运行器
│   ├── env.example              # 环境变量示例
│   ├── init_db.py               # 数据库初始化脚本
│   └── Dockerfile               # 后端Docker配置
├── 📁 database/                   # 数据库相关文件
│   ├── init.sql                 # 数据库建表脚本
│   └── seed.sql                 # 测试数据脚本
├── docker-compose.yml            # Docker编排配置
├── start.sh                     # 一键启动脚本
└── README.md                    # 项目文档
```

## 🚀 快速开始

### 🌟 方式一：一键启动（推荐）

```bash
# 1. 克隆项目
git clone <repository-url>
cd VotingSystem

# 2. 一键启动（自动处理所有依赖和配置）
bash start.sh
```

### 🐳 方式二：Docker部署

```bash
# 1. 确保Docker已安装
docker --version
docker-compose --version

# 2. 启动所有服务
docker-compose up --build

# 3. 访问应用
# 前端界面: http://localhost:3000
# 后端API: http://localhost:8000  
# API文档: http://localhost:8000/docs
```

### 💻 方式三：本地开发环境

#### 前置要求
- Node.js 18+ 
- Python 3.11+
- MySQL 8.0+

#### 后端设置
```bash
cd backend

# 1. 创建Python虚拟环境
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 2. 安装Python依赖
pip install -r requirements.txt

# 3. 配置数据库
mysql -u root -p < ../database/init.sql
mysql -u root -p voting_system < ../database/seed.sql

# 4. 配置环境变量
cp env.example .env
# 编辑.env文件配置数据库连接信息

# 5. 启动后端服务
python -m uvicorn app.main:socket_app --reload --host 0.0.0.0 --port 8000
```

#### 前端设置
```bash
cd frontend

# 1. 安装Node.js依赖
npm install

# 2. 启动前端开发服务器
npm run dev

# 3. 访问应用
# http://localhost:3000
```

## 📊 数据库设计

### 🗃️ 表结构设计

#### polls 表（投票问卷）
```sql
CREATE TABLE `polls` (
  `poll_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '问卷唯一主键',
  `title` VARCHAR(255) NOT NULL COMMENT '问卷标题',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB CHARSET=utf8mb4 COMMENT='投票问卷表';
```

#### options 表（投票选项）
```sql
CREATE TABLE `options` (
  `option_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '选项唯一主键',
  `poll_id` BIGINT UNSIGNED NOT NULL COMMENT '所属问卷ID',
  `label` VARCHAR(100) NOT NULL COMMENT '选项文本',
  `vote_count` INT UNSIGNED DEFAULT 0 COMMENT '累计票数缓存',
  KEY `idx_options_poll` (`poll_id`),
  FOREIGN KEY (`poll_id`) REFERENCES `polls` (`poll_id`) ON DELETE CASCADE
) ENGINE=InnoDB CHARSET=utf8mb4 COMMENT='投票选项表';
```

#### votes 表（投票记录）
```sql
CREATE TABLE `votes` (
  `vote_id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '投票记录主键',
  `option_id` BIGINT UNSIGNED NOT NULL COMMENT '所投选项ID',
  `voted_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '投票时间',
  `client_id` VARCHAR(64) NULL COMMENT '客户端标识',
  KEY `idx_votes_option` (`option_id`),
  FOREIGN KEY (`option_id`) REFERENCES `options` (`option_id`) ON DELETE CASCADE
) ENGINE=InnoDB CHARSET=utf8mb4 COMMENT='投票记录表';
```

### 🔗 数据关系图

```
┌─────────────────┐     1:N     ┌─────────────────┐     1:N     ┌─────────────────┐
│      polls      │◄────────────│     options     │◄────────────│      votes      │
├─────────────────┤             ├─────────────────┤             ├─────────────────┤
│ poll_id (PK)    │             │ option_id (PK)  │             │ vote_id (PK)    │
│ title           │             │ poll_id (FK)    │             │ option_id (FK)  │
│ created_at      │             │ label           │             │ voted_at        │
└─────────────────┘             │ vote_count      │             │ client_id       │
                                └─────────────────┘             └─────────────────┘
```

## 🛠️ API接口文档

### 🔌 核心API端点

#### 1. 获取当前投票问卷
```http
GET /api/poll
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "最受欢迎的编程语言投票",
    "description": "",
    "options": [
      {
        "id": "1",
        "text": "JavaScript",
        "votes": 15
      },
      {
        "id": "2", 
        "text": "Python",
        "votes": 23
      }
    ],
    "totalVotes": 38,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. 提交投票
```http
POST /api/poll/vote
Content-Type: application/json

{
  "optionId": "1",
  "userToken": "user_unique_id"
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "投票成功",
  "poll": {
    // 更新后的投票数据...
  }
}
```

#### 3. 获取投票统计
```http
GET /api/poll/{poll_id}/statistics
```

### 🔄 WebSocket事件

#### 连接事件
```javascript
// 连接到WebSocket
socket.connect();

// 加入特定投票房间
socket.emit('join_poll', { poll_id: 1 });

// 监听投票更新
socket.on('vote_update', (data) => {
  console.log('收到投票更新:', data);
});
```

#### 事件列表

| 事件名 | 方向 | 说明 | 数据格式 |
|--------|------|------|----------|
| `connect` | Client→Server | 客户端连接 | - |
| `join_poll` | Client→Server | 加入投票房间 | `{poll_id: number}` |
| `vote_update` | Server→Client | 投票结果更新 | `Poll对象` |
| `disconnect` | Client→Server | 客户端断开 | - |

## 🧪 测试

### 🔬 后端测试

项目包含完整的API测试套件，覆盖所有核心功能：

```bash
cd backend

# 运行所有测试
python test_runner.py

# 运行测试并查看覆盖率
python test_runner.py --coverage

# 直接使用pytest
python -m pytest tests/ -v
```

**测试覆盖内容：**
- ✅ 获取投票问卷API测试
- ✅ 投票提交成功测试  
- ✅ 重复投票防护测试
- ✅ 无效选项处理测试
- ✅ 统计数据获取测试
- ✅ 健康检查测试

### 🎨 前端测试

前端提供组件测试示例（可选实现）：

```bash
cd frontend

# 安装测试依赖
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom

# 运行测试
npm run test
```

**测试组件：**
- 投票选项组件测试
- 图表展示组件测试  
- WebSocket连接测试

## 🛡️ 安全特性

### 🚫 防重复投票机制

1. **客户端标识生成**
   ```typescript
   // 基于IP和User-Agent生成唯一标识
   const clientId = `${clientIP}_${hash(userAgent)}`;
   ```

2. **数据库层防护**
   ```sql
   -- 检查是否已投票
   SELECT * FROM votes v
   JOIN options o ON v.option_id = o.option_id  
   WHERE v.client_id = ? AND o.poll_id = ?;
   ```

3. **前端状态管理**
   ```typescript
   const [hasVoted, setHasVoted] = useState(
     VotingApiService.hasUserVoted(pollId)
   );
   ```

### 🔒 数据验证

- **输入验证**：Pydantic模型验证所有API输入
- **SQL注入防护**：使用SQLAlchemy ORM参数化查询
- **CORS配置**：生产环境限制允许的域名
- **错误处理**：完整的异常捕获和用户友好错误信息

## 🎯 演示说明

### 🖥️ 使用流程演示

根据要求，系统支持以下演示场景：

1. **打开两个浏览器窗口，在屏幕中左右两边各占一半空间**
2. **左边窗口投票**：点击左边窗口投票，右边窗口可以看到投票结果变化
3. **右边窗口投票**：点击右边窗口投票，左边窗口也可看到投票变化

### 📸 界面预览

```
┌─────────────────────────────────────────────────────────────┐
│                    🗳️ 实时投票系统                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐              ┌─────────────────┐       │
│  │   📋 投票区域    │              │   📊 实时结果    │       │
│  ├─────────────────┤              ├─────────────────┤       │
│  │ 🔘 JavaScript   │              │ ████████ 42%    │       │
│  │ 🔘 Python       │              │ ██████ 31%      │       │
│  │ 🔘 Java         │              │ ████ 18%        │       │
│  │ 🔘 TypeScript   │              │ ██ 9%          │       │
│  │                 │              │                 │       │
│  │ [📤 提交投票]    │              │ 总票数: 76      │       │
│  └─────────────────┘              └─────────────────┘       │
│                                                             │
│ 🟢 实时连接正常     ⟲ 刷新数据      📡 连接状态              │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 部署指南

### 📦 生产环境部署

#### 1. 环境配置
```bash
# 复制并修改环境配置
cp backend/env.example backend/.env

# 编辑生产环境配置
vim backend/.env
```

**生产环境配置示例：**
```env
# 生产数据库配置
DATABASE_URL=mysql+pymysql://voting_user:strong_password@mysql:3306/voting_system

# 安全配置
DEBUG=False
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# 服务器配置  
HOST=0.0.0.0
PORT=8000
```

#### 2. Docker生产部署
```bash
# 构建生产镜像
docker-compose -f docker-compose.prod.yml build

# 启动生产服务
docker-compose -f docker-compose.prod.yml up -d

# 查看服务状态
docker-compose ps
```

#### 3. Nginx反向代理配置
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # 前端静态文件
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # 后端API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # WebSocket代理
    location /socket.io {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 🔧 监控和维护

#### 健康检查
```bash
# API健康检查
curl http://localhost:8000/health

# 数据库连接检查  
docker-compose exec mysql mysqladmin ping

# 查看服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
```

#### 数据备份
```bash
# 备份数据库
docker-compose exec mysql mysqldump -u voting_user -p voting_system > backup.sql

# 恢复数据库
docker-compose exec -i mysql mysql -u voting_user -p voting_system < backup.sql
```

## 📈 性能优化

### 🚀 已实现的优化

1. **数据库优化**
   - 选项表vote_count字段缓存票数，避免实时聚合计算
   - 合理的索引设计，提升查询性能
   - 外键约束保证数据一致性

2. **前端优化**
   - React.memo和useCallback减少不必要渲染
   - WebSocket连接复用，减少网络开销
   - ECharts图表按需加载

3. **后端优化**
   - FastAPI异步处理，支持高并发
   - SQLAlchemy连接池管理
   - Socket.IO房间机制，精准推送

### 🔄 扩展建议

1. **缓存层**：Redis缓存热点数据
2. **CDN加速**：静态资源CDN分发
3. **负载均衡**：多实例部署+Nginx负载均衡
4. **数据库分片**：大规模数据时考虑分库分表

## ❓ 常见问题

### 🐛 故障排除

#### Q: Docker启动失败？
```bash
# 检查Docker服务状态
systemctl status docker

# 查看详细错误日志
docker-compose logs

# 清理并重新构建
docker-compose down
docker system prune -f
docker-compose up --build
```

#### Q: 前端无法连接后端？
```bash
# 检查网络连通性
curl http://localhost:8000/health

# 检查CORS配置
# 确保backend/.env中ALLOWED_ORIGINS包含前端域名
```

#### Q: WebSocket连接失败？
```bash
# 检查Socket.IO服务状态
curl http://localhost:8000/socket.io/

# 查看浏览器控制台WebSocket连接日志
# 确保防火墙允许WebSocket连接
```

#### Q: 投票数据不同步？
```bash
# 检查数据库数据一致性
docker-compose exec mysql mysql -u voting_user -p voting_system
SELECT * FROM votes ORDER BY voted_at DESC LIMIT 10;

# 重新计算票数缓存
python backend/clear_votes.py  # 清理测试数据
```

### 🔧 开发环境问题

#### Q: Python虚拟环境问题？
```bash
# 重新创建虚拟环境
rm -rf backend/.venv
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

#### Q: Node.js依赖安装失败？
```bash
# 清理npm缓存
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 🤝 开发指南

### 🔨 添加新功能

#### 1. 后端API扩展
```python
# backend/app/api/polls.py
@router.post("/poll/create")
async def create_new_poll(poll_data: PollCreate, db: Session = Depends(get_db)):
    # 新增创建投票功能
    pass
```

#### 2. 前端组件扩展
```typescript
// frontend/src/components/NewPollForm.tsx
export function NewPollForm() {
  // 新增创建投票表单组件
}
```

#### 3. 数据库迁移
```sql
-- database/migrations/add_new_feature.sql
ALTER TABLE polls ADD COLUMN description TEXT;
```

### 📝 代码规范

#### Python代码规范
```python
# 使用Black格式化
black backend/app

# 使用flake8检查
flake8 backend/app

# 类型检查
mypy backend/app
```

#### TypeScript代码规范
```bash
# ESLint检查
npm run lint

# Prettier格式化
npm run format

# 类型检查
npm run type-check
```

### 🧪 测试编写

#### 后端测试示例
```python
def test_new_feature_api():
    response = client.post("/api/new-endpoint", json={"key": "value"})
    assert response.status_code == 200
    assert response.json()["success"] is True
```

#### 前端测试示例
```typescript
it('should render new component', () => {
  render(<NewComponent />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

