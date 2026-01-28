---
title: 结构与格式
impact: 高
tags: logging, json, structured-logging, schema, middleware
---

## 结构与格式

**影响级别: 高**

具有一致格式的结构化日志记录能够实现高效的查询和分析。正确的结构将日志从文本文件转变为可查询的数据。

### 在整个代码库中使用单一日志器

使用一个在应用程序启动时配置的日志器实例，并在所有地方导入它。这确保了所有模块之间一致的格式、日志级别和输出目标。

```typescript
// lib/logger.ts - 单一日志器配置
import pino from 'pino';

// 启动时配置一次
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: {
    // 环境上下文自动添加到所有日志中
    service: process.env.SERVICE_NAME,
    version: process.env.SERVICE_VERSION,
    commit_hash: process.env.COMMIT_SHA,
    region: process.env.AWS_REGION,
    environment: process.env.NODE_ENV,
  },
});

// 其他地方使用 - 只需导入
// services/checkout.ts
import { logger } from '../lib/logger';

logger.info({ event: 'checkout_completed', orderId });
```

**好处：**
- 所有模块之间一致的日志格式
- 自动包含环境上下文
- 更改日志级别或目标只需修改一处
- 不会出现不同文件中日志器配置错误的风险

**避免：**
```typescript
// 不要在每个文件中创建新的日志器
const logger = new Logger(); // 每个文件创建自己的
console.log('some event');   // 完全绕过日志器
```

### 使用中间件实现一致的宽事件

将宽事件收集实现为包装所有请求处理器的中间件。中间件初始化事件、捕获计时、在 finally 块中处理发送，并使事件可供处理器进行丰富。

```typescript
// middleware/wideEvent.ts
import { logger } from '../lib/logger';

// 启动时捕获一次环境
const envContext = {
  service: process.env.SERVICE_NAME,
  version: process.env.SERVICE_VERSION,
  commit_hash: process.env.COMMIT_SHA,
  region: process.env.AWS_REGION,
  environment: process.env.NODE_ENV,
  instance_id: process.env.HOSTNAME,
};

export function wideEventMiddleware() {
  return async (c: Context, next: Next) => {
    const startTime = Date.now();

    // 用标准字段 + 环境初始化事件
    const wideEvent: Record<string, unknown> = {
      request_id: c.get('requestId') || crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      method: c.req.method,
      path: c.req.path,
      user_agent: c.req.header('user-agent'),
      ...envContext,  // 自动包含环境
    };

    // 使事件可供处理器进行丰富
    c.set('wideEvent', wideEvent);

    try {
      await next();
      wideEvent.status_code = c.res.status;
      wideEvent.outcome = c.res.status < 400 ? 'success' : 'error';
    } catch (error) {
      wideEvent.status_code = 500;
      wideEvent.outcome = 'error';
      wideEvent.error = {
        type: error.name,
        message: error.message,
      };
      throw error;
    } finally {
      wideEvent.duration_ms = Date.now() - startTime;
      logger.info(wideEvent);  // 使用单一日志器
    }
  };
}

// 全局应用中间件
app.use('*', wideEventMiddleware());
```

**处理器只需添加业务上下文：**

```typescript
app.post('/checkout', async (c) => {
  const wideEvent = c.get('wideEvent');
  const user = c.get('user');

  // 添加业务上下文 - 环境已由中间件包含
  wideEvent.user = { id: user.id, subscription: user.subscription };

  const cart = await getCart(user.id);
  wideEvent.cart = { id: cart.id, total: cart.total };

  const order = await createOrder(cart);
  wideEvent.order = { id: order.id };

  return c.json(order, 201);
});
// 中间件处理：计时、状态、环境、发送
// 处理器处理：仅业务上下文
```

### 使用 JSON 格式

使用 JSON 作为日志格式。JSON 是通用支持的，能够为复杂上下文启用嵌套对象，适用于所有编程语言，并且易于解析。

```typescript
const wideEvent = {
  timestamp: '2024-09-08T06:14:05.680Z',
  service: 'articles',
  requestId: 'req_abc123',
  message: 'Article created',
  user: { id: 'user_123', subscription: 'premium' },
  article: { id: 'article_456', title: 'My Post' },
  duration_ms: 268,
  status_code: 201,
};

// 作为单行 JSON 发出
logger.info(wideEvent);
```

### 保持一致的模式

在所有服务中使用一致的字段名称。如果一个服务使用 `user_id` 而另一个使用 `userId`，查询会变得很痛苦。

```typescript
// 所有服务使用相同的模式
{
  request_id: 'req_abc',
  user: { id: 'user_123' },
  duration_ms: 268,
  status_code: 200,
}
```

定义一次模式，并通过公共库或文档标准在服务之间共享。

### 简化日志级别

将自己限制在两个日志级别：`info` 和 `error`。debug、trace、warn、info、notice 和 critical 之间的区别会造成混淆而不会增加价值。

- **INFO**：正常操作，所有宽事件
- **ERROR**：需要关注的意外故障

如果你发现自己想要 debug 日志，将该上下文添加到你的宽事件中。

### 永远不要记录非结构化字符串

每个日志都必须是具有可查询字段的结构化数据。`console.log('User logged in')` 在规模化调试时毫无用处。

```typescript
// 将数据添加到你的宽事件中
wideEvent.order = { id: orderId, status: 'created' };
wideEvent.payment = { error: { message: error.message } };
// 现在可以查询：WHERE order.status = 'created'
```

如果你想写 `console.log('something happened')`，问问自己："什么字段能使这可查询？"然后将这些字段添加到你的宽事件中。
