## 项目概述

next-forge 是一个生产级的 Turborepo Next.js 应用模板。它是一个全面的 SaaS 启动套件，开箱即用地提供身份验证、支付、数据库、邮件等功能。

关于本项目的详细文档，请参见 `docs/content/docs/` 中的文档。

## 命令

### 根目录命令

```bash
# 开发
bun run dev              # 并发启动所有应用（不包括 docs、cms、storybook）
bun run build            # 构建所有包和应用（先运行测试）
bun run test             # 在整个 monorepo 中运行 Vitest

# 代码质量
bun run check            # 代码检查和格式检查（ultracite/biome）
bun run fix              # 自动修复格式问题

# 数据库（packages/database 命令的快捷方式）
bun run db:generate      # 从 schema 生成 Drizzle 客户端
bun run db:migrate       # 运行迁移
bun run db:push          # 推送 schema 更改到数据库
bun run db:studio        # 打开 Drizzle Studio

# 后台任务（Trigger.dev）
bun run trigger:dev      # 启动 Trigger.dev 本地开发服务器
bun run trigger:deploy   # 部署任务到 Trigger.dev 云端

# 维护
bun run analyze          # Bundle 大小分析
bun run clean            # 深度清理所有 node_modules
bun run bump-deps        # 更新所有依赖（recharts 除外）
bun run bump-ui          # 更新所有 shadcn/ui 组件
```

### 单个应用开发

在应用目录中（例如 `apps/app/`）：
```bash
bun run dev              # 启动单个应用（使用 dotenv 加载 ../../.env 和 .env）
bun run build            # 构建应用
bun run test             # 运行应用测试
bun run typecheck        # TypeScript 类型检查
```

### 数据库包命令

在 `packages/database/` 中：
```bash
bun run generate         # 从 schema.ts 生成 Drizzle 客户端
bun run migrate          # 运行迁移
bun run push             # 推送 schema 到数据库（比 migrate 快）
bun run studio           # 打开 Drizzle Studio UI
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
├── trigger/            # Trigger.dev v4 后台任务队列（异步任务、定时任务）
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

### 后台任务（Trigger.dev）

配置文件 `trigger.config.ts` 和任务文件都放在 `packages/trigger/` 目录：

```
packages/trigger/
├── trigger.config.ts   # Trigger.dev 配置
├── tasks/              # 任务定义目录
│   └── hello-world.ts
└── index.ts            # 导出入口
```

```typescript
// 在应用中触发任务
import { helloWorldTask } from "@repo/trigger";

const handle = await helloWorldTask.trigger({ name: "User" });
const result = await handle.wait(); // 可选：等待结果
```
