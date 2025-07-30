# GoReact 全栈项目

这是一个全栈Web应用项目，包含React前端和Rust后端。

## 项目结构

```text
rustreact/
├── front/          # React前端应用
│   ├── src/         # 前端源代码
│   ├── public/      # 静态资源
│   └── package.json # 前端依赖配置
└── server/          # Rust后端服务
    ├── src/         # 后端源代码
    └── Cargo.toml   # Rust项目配置
```

## 技术栈

### 前端

- **React 18** - 现代化的前端框架
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 快速的构建工具
- **ESLint** - 代码质量检查

### 后端

- **Rust** - 高性能系统编程语言
- **Cargo** - Rust包管理器

## 快速开始

### 前端开发

```bash
# 进入前端目录
cd front

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

前端应用将在 `http://localhost:5173` 运行。

### 后端开发

```bash
# 进入后端目录
cd server

# 运行Rust应用
cargo run
```

## 开发指南

### 前端开发指南

- 使用 `pnpm` 作为包管理器
- 遵循 TypeScript 最佳实践
- 使用 ESLint 保持代码质量

### Rust 服务端开发

- 使用 `cargo` 管理依赖和构建
- 遵循 Rust 编程规范
- 使用 `cargo fmt` 格式化代码
- 使用 `cargo clippy` 进行代码检查

## 部署

### 前端部署

```bash
cd front
pnpm build
```

构建产物将生成在 `front/dist` 目录。

### 后端部署

```bash
cd server
cargo build --release
```

生产环境可执行文件将生成在 `server/target/release` 目录。

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
