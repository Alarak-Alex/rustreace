# Rust Web API Server - 分层架构设计

## 项目结构

```text
src/
├── main.rs          # 应用程序入口点
├── api/             # API层 - 处理HTTP请求和响应
│   ├── mod.rs
│   └── user_api.rs  # 用户相关的API控制器
├── model/           # 模型层 - 数据结构定义
│   ├── mod.rs
│   └── user.rs      # 用户数据模型
├── router/          # 路由层 - 路由配置
│   ├── mod.rs
│   └── user_router.rs # 用户路由配置
└── service/         # 服务层 - 业务逻辑
    ├── mod.rs
    └── user_service.rs # 用户业务逻辑
```

## 分层架构说明

### 1. 模型层 (Model Layer)

- **位置**: `src/model/`
- **职责**: 定义数据结构、实体模型和数据传输对象(DTO)
- **特点**:
  - 包含业务实体的定义
  - 定义API请求/响应的数据结构
  - 使用Serde进行序列化/反序列化

### 2. 服务层 (Service Layer)

- **位置**: `src/service/`
- **职责**: 实现核心业务逻辑
- **特点**:
  - 处理业务规则和验证
  - 管理数据状态
  - 提供可复用的业务功能
  - 独立于HTTP层，可以被不同的接口调用

### 3. API层 (API Layer)

- **位置**: `src/api/`
- **职责**: 处理HTTP请求和响应
- **特点**:
  - 解析HTTP请求参数
  - 调用服务层处理业务逻辑
  - 格式化HTTP响应
  - 处理错误和状态码

### 4. 路由层 (Router Layer)

- **位置**: `src/router/`
- **职责**: 配置URL路由和中间件
- **特点**:
  - 定义API端点
  - 配置路由规则
  - 组织路由结构

## API端点

### 用户管理API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/users` | 获取所有用户 |
| POST | `/api/users` | 创建新用户 |
| GET | `/api/users/id/{id}` | 根据ID获取用户 |
| PUT | `/api/users/id/{id}` | 更新用户信息 |
| DELETE | `/api/users/id/{id}` | 删除用户 |
| GET | `/api/users/username/{username}` | 根据用户名获取用户 |

### 系统端点

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/` | 欢迎页面 |
| GET | `/health` | 健康检查 |

## 运行项目

1. 安装依赖:

   ```bash
   cargo build
   ```

1. 运行服务器:

   ```bash
   cargo run
   ```

1. 服务器将在 `http://127.0.0.1:3001` 启动

## 测试API

### 创建用户

```bash
curl -X POST http://127.0.0.1:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "email": "john@example.com"}'
```

### 获取所有用户

```bash
curl http://127.0.0.1:3001/api/users
```

### 根据ID获取用户

```bash
curl http://127.0.0.1:3001/api/users/id/1
```

## 架构优势

1. **关注点分离**: 每一层都有明确的职责
2. **可维护性**: 代码结构清晰，易于维护和扩展
3. **可测试性**: 各层可以独立测试
4. **可复用性**: 服务层可以被不同的接口层调用
5. **松耦合**: 层与层之间依赖关系清晰，便于修改

## 扩展建议

1. **数据持久化**: 添加数据库层(Repository Pattern)
2. **错误处理**: 实现统一的错误处理机制
3. **认证授权**: 添加JWT认证中间件
4. **配置管理**: 使用配置文件管理环境变量
5. **日志系统**: 完善日志记录和监控
6. **API文档**: 集成Swagger/OpenAPI文档
