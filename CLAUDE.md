## 项目概述

next-forge 是一个生产级的 Turborepo Next.js 应用模板。它是一个全面的 SaaS 启动套件，开箱即用地提供身份验证、支付、数据库、邮件等功能。

关于本项目的详细文档，请参见 `docs/content/docs/` 中的文档。

## 命令

### 根目录命令

```bash
# 开发
pnpm dev              # 并发启动所有应用（不包括 docs、cms、storybook）
pnpm build            # 构建所有包和应用（先运行测试）
pnpm test             # 在整个 monorepo 中运行 Vitest

# 代码质量
pnpm check            # 代码检查和格式检查（ultracite/biome）
pnpm fix              # 自动修复格式问题

# 数据库（packages/database 命令的快捷方式）
pnpm db:generate      # 从 schema 生成 Drizzle 客户端
pnpm db:migrate       # 运行迁移
pnpm db:push          # 推送 schema 更改到数据库
pnpm db:studio        # 打开 Drizzle Studio

# 维护
pnpm analyze          # Bundle 大小分析
pnpm clean            # 深度清理所有 node_modules
pnpm bump-deps        # 更新所有依赖（recharts 除外）
pnpm bump-ui          # 更新所有 shadcn/ui 组件
```

### 单个应用开发

在应用目录中（例如 `apps/app/`）：
```bash
pnpm dev              # 启动单个应用（使用 dotenv 加载 ../../.env 和 .env）
pnpm build            # 构建应用
pnpm test             # 运行应用测试
pnpm typecheck        # TypeScript 类型检查
```

### 数据库包命令

在 `packages/database/` 中：
```bash
pnpm generate         # 从 schema.ts 生成 Drizzle 客户端
pnpm migrate          # 运行迁移
pnpm push             # 推送 schema 到数据库（比 migrate 快）
pnpm studio           # 打开 Drizzle Studio UI
```


## 架构

### Monorepo 结构

```
apps/
├── app/       # 主应用 - Next.js App Router + shadcn/ui
├── api/       # API 服务器（端口 3002）- webhooks、定时任务、健康检查
├── docs/      # 文档（端口 3004）- Mintlify
├── email/     # 邮件预览 - React Email
├── storybook/ # 组件开发
└── studio/    # 数据库管理工具

packages/
├── design-system/      # shadcn/ui 组件
├── database/           # Drizzle ORM + PostgreSQL/Neon
├── auth/               # Better Auth 身份验证
├── payments/           # Stripe 集成（@stripe/agent-toolkit）
├── analytics/          # Google Analytics + PostHog
├── observability/      # Sentry + BetterStack 日志
├── security/           # Arcjet 安全 + 速率限制
├── email/              # Resend 邮件集成
├── webhooks/           # Svix webhook 处理
├── collaboration/      # Liveblocks 实时协作功能
├── notifications/      # Knock 通知
├── feature-flags/      # Vercel 特性开关
├── cms/                # Basehub CMS
├── seo/                # SEO 元数据工具
├── storage/            # 文件存储
├── internationalization/ # 国际化支持
├── logger/             # 统一日志输出（环境感知：服务端 signale / 客户端 console）
├── ai/                 # AI 工具
└── ...                 # 其他共享包
```

### 环境变量模式

每个包导出一个带 Zod 验证的 `keys()` 函数：

```typescript
// packages/auth/keys.ts
export const keys = () => createEnv({
  server: { BETTER_AUTH_SECRET: z.string().min(16) },
  client: {},
  runtimeEnv: { BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET },
});
```

应用在其 `env.ts` 中组合这些配置：

```typescript
// apps/app/env.ts
export const env = createEnv({
  extends: [auth(), database(), analytics(), /* ... */],
});
```

### Next.js 配置组合

包导出 `with*` 包装函数来组合配置：

```typescript
// apps/app/next.config.ts
let nextConfig = withToolbar(withLogging(config));
if (env.VERCEL) nextConfig = withSentry(nextConfig);
if (env.ANALYZE === "true") nextConfig = withAnalyzer(nextConfig);
```

### 包引用

所有内部包使用 `@repo/*` 命名空间和 workspace 协议：
```json
"@repo/design-system": "workspace:*"
```
