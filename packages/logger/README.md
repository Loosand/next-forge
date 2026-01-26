# @repo/logger

统一的日志输出包，提供环境感知的日志记录能力。

## 特性

- 🌍 **环境感知**：自动检测运行环境，服务端使用 signale，客户端使用 console
- 🎨 **美化输出**：服务端提供结构化和美化的日志输出
- 🚀 **零配置**：开箱即用，无需任何配置
- 🔄 **懒加载**：使用 Proxy 实现按需初始化，避免循环依赖
- 📦 **体积优化**：客户端 bundle 不包含 signale 依赖

## 安装

在需要使用 logger 的应用或包中添加依赖：

```json
{
  "dependencies": {
    "@repo/logger": "workspace:*"
  }
}
```

## 使用方法

### 基础使用

```typescript
import { logger } from '@repo/logger';

// 标准日志方法
logger.log('这是一条日志');
logger.info('信息提示');
logger.warn('警告信息');
logger.error('错误信息');
logger.debug('调试信息');

// 扩展方法（来自 signale）
logger.success('操作成功');    // ✅
logger.start('任务开始...');   // ⏳
logger.complete('任务完成');   // ✓
logger.note('备注信息');
logger.fatal('致命错误');
```

### 在 Server Actions 中使用

```typescript
'use server';

import { logger } from '@repo/logger';

export async function createUser(data: FormData) {
  logger.start('创建用户...');

  try {
    const user = await db.user.create({ ... });
    logger.success('用户创建成功', user.id);
    return { success: true };
  } catch (error) {
    logger.error('创建用户失败', error);
    return { success: false };
  }
}
```

### 在 API 路由中使用

```typescript
import { logger } from '@repo/logger';

export async function GET(request: Request) {
  logger.info('收到请求', request.url);

  // ... 处理逻辑

  logger.debug('返回响应', response);
  return response;
}
```

### 在客户端组件中使用

```typescript
'use client';

import { logger } from '@repo/logger';

export function MyComponent() {
  const handleClick = () => {
    logger.info('按钮被点击');
    // ...
  };

  return <button onClick={handleClick}>点击</button>;
}
```

## 环境差异

### 服务端（Node.js）

使用 [signale](https://github.com/klaussinani/signale)：
- ✅ 美化的彩色输出
- ✅ 结构化的日志格式
- ✅ 时间戳和作用域支持
- ✅ 多种日志级别和图标

### 客户端（浏览器）

使用原生 console 包装器：
- ✅ 轻量级实现
- ✅ 保留原生 console 的所有特性
- ✅ 扩展方法使用表情符号增强（✅ ⏳ ✓）
- ✅ 不增加 bundle 体积

## 技术实现

### 懒加载机制

使用 ES6 Proxy 实现懒加载，避免以下问题：

1. **循环依赖**：其他包可能在初始化时导入 logger
2. **环境检测时机**：确保环境检测在真正使用时才执行
3. **副作用隔离**：模块加载阶段不执行任何初始化代码

```typescript
export const logger = new Proxy({} as Logger, {
  get(_target, prop: string) {
    if (!loggerInstance) {
      loggerInstance = createLogger(); // 首次访问时才创建
    }
    return loggerInstance[prop as keyof Logger];
  },
});
```

### 环境检测

通过 `typeof window === "undefined"` 判断运行环境：

```typescript
function createLogger(): Logger {
  if (typeof window === "undefined") {
    // 服务端：延迟 require signale
    return require("signale") as Signale;
  }

  // 客户端：返回 console 包装器
  return { /* ... */ };
}
```

## API 参考

### Logger 接口

所有方法接受任意数量的参数，参数会被传递给底层的日志实现。

| 方法 | 说明 | 服务端 | 客户端 |
|------|------|--------|--------|
| `log(...args)` | 通用日志输出 | signale.log | console.log |
| `info(...args)` | 信息提示 | signale.info | console.info |
| `warn(...args)` | 警告信息 | signale.warn | console.warn |
| `error(...args)` | 错误信息 | signale.error | console.error |
| `debug(...args)` | 调试信息 | signale.debug | console.debug |
| `success(...args)` | 成功标记 | signale.success | console.log('✅', ...) |
| `start(...args)` | 任务开始 | signale.start | console.log('⏳', ...) |
| `complete(...args)` | 任务完成 | signale.complete | console.log('✓', ...) |
| `note(...args)` | 备注信息 | signale.note | console.info |
| `fatal(...args)` | 致命错误 | signale.fatal | console.error |

## 文档结构

本包遵循[分形文档结构指南](../../.claude/rules/fractal-documentation-guide.md)：

- **Level 1**: `/CLAUDE.md` - 包含在 monorepo 架构描述中
- **Level 2**: `.folder.md` - 三行极简文档（地位/逻辑/约束）
- **Level 3**: `index.ts` - 文件 Header（INPUT/OUTPUT/POS/PROTOCOL）

## 维护指南

### 添加新的日志方法

如果需要添加新的日志方法，必须：

1. ✅ 更新 `Logger` 类型定义
2. ✅ 在服务端实现（确保 signale 支持）
3. ✅ 在客户端实现（使用 console 方法或表情符号增强）
4. ✅ 更新 `index.ts` 顶部的 PROTOCOL 注释
5. ✅ 检查并更新 `.folder.md`
6. ✅ 更新本 README 的 API 参考表格

### 同步协议

遵循分形文档结构的同步协议：

```
代码变更 → 更新 index.ts Header → 检查 .folder.md → 上浮到 CLAUDE.md
```

## 依赖

- **signale**: 服务端日志美化库（仅服务端）
- **@types/signale**: TypeScript 类型定义（开发依赖）

## License

MIT
