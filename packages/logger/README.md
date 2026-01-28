# @repo/logger

基于 [evlog](https://evlog.dev) 的 Wide Events 日志包，每个请求输出一条包含所有上下文的结构化日志。

## Wide Events 是什么？

传统日志方式会产生分散的多条日志：

```
console.log('Request received')
console.log('User:', user.id)
console.log('Cart loaded')
console.log('Payment failed')
```

Wide Events 模式将所有上下文合并为一条日志：

```json
{
  "timestamp": "2025-01-28T10:23:45.612Z",
  "level": "info",
  "method": "POST",
  "path": "/api/checkout",
  "duration": "1.2s",
  "user": { "id": "123", "plan": "premium" },
  "cart": { "items": 3, "total": 9999 },
  "status": 200
}
```

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

### API Route 中使用

```typescript
import { createRequestLogger } from '@repo/logger';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const log = createRequestLogger(request);

  // 累积上下文
  log.set({ user: { id: "123", plan: "premium" } });
  log.set({ cart: { items: 3, total: 9999 } });

  try {
    const result = await processOrder();
    log.set({ result });
    log.emit(); // 输出一条完整的日志
    return NextResponse.json({ success: true });
  } catch (error) {
    log.error(error as Error, { step: "payment" });
    log.emit();
    throw error;
  }
}
```

### Server Action 中使用

```typescript
'use server';

import { createActionLogger, createError } from '@repo/logger';

export async function checkout(formData: FormData) {
  const log = createActionLogger("checkout");

  log.set({ user: { id: "123" } });
  log.set({ input: Object.fromEntries(formData) });

  try {
    const order = await processOrder();
    log.set({ result: { orderId: order.id } });
    log.emit();
    return { success: true, orderId: order.id };
  } catch (error) {
    log.error(error as Error, { step: "payment" });
    log.emit();

    // 返回结构化错误
    throw createError({
      message: "Checkout failed",
      status: 500,
      why: (error as Error).message,
      fix: "Please try again or contact support",
    });
  }
}
```

### 简单日志 API

对于不需要请求上下文的场景，可以使用简单日志 API：

```typescript
import { log } from '@repo/logger';

log.info("startup", "Server started");
log.error("db", "Connection failed");
log.debug("cache", "Cache hit", { key: "user:123" });
```

## API 参考

### createRequestLogger(request: Request)

为 API Route 创建请求日志器。

```typescript
const log = createRequestLogger(request);
log.set({ key: value });  // 添加上下文
log.error(error, ctx);    // 记录错误
log.emit();               // 输出日志
```

### createActionLogger(actionName: string)

为 Server Action 创建日志器。

```typescript
const log = createActionLogger("checkout");
log.set({ user: { id: "123" } });
log.emit();
```

### createError(options)

创建结构化错误。

```typescript
throw createError({
  message: "Payment failed",    // 错误消息
  status: 402,                  // HTTP 状态码
  why: "Card declined",         // 错误原因
  fix: "Try another card",      // 建议修复方式
});
```

### parseError(error)

解析错误为结构化格式。

```typescript
try {
  await checkout();
} catch (err) {
  const error = parseError(err);
  console.log(error.message, error.why, error.fix);
}
```

### log

简单日志 API，支持 `info`、`error`、`debug`、`warn` 等方法。

```typescript
log.info("tag", "message", { context });
log.error("tag", "message", { context });
```

## 日志输出格式

开发环境会输出美化的 JSON：

```
[next-forge-app] POST /api/checkout 200 1.2s
{
  user: { id: "123", plan: "premium" },
  cart: { items: 3, total: 9999 },
  result: { orderId: "order_789" }
}
```

生产环境输出单行 JSON，便于日志聚合：

```json
{"timestamp":"2025-01-28T10:23:45.612Z","level":"info","service":"next-forge-app","method":"POST","path":"/api/checkout","status":200,"duration":"1.2s","user":{"id":"123"},"cart":{"items":3}}
```

## 最佳实践

### 1. 每个请求只输出一条日志

```typescript
// 正确：累积上下文，最后 emit
log.set({ step1: "done" });
log.set({ step2: "done" });
log.emit();

// 错误：多次独立输出
console.log("step1 done");
console.log("step2 done");
```

### 2. 使用结构化数据

```typescript
// 正确：结构化数据
log.set({ user: { id: "123", plan: "premium" } });

// 避免：字符串拼接
log.set({ info: `User 123 with plan premium` });
```

### 3. 错误时也要 emit

```typescript
try {
  // ...
  log.emit();
} catch (error) {
  log.error(error as Error);
  log.emit(); // 不要忘记 emit
  throw error;
}
```

### 4. 敏感数据脱敏

```typescript
// 不要记录敏感信息
log.set({
  user: { id: user.id }, // 只记录 ID
  // 不要: password, token, creditCard 等
});
```

## 配置

通过 `initEvlog` 自定义配置（通常不需要手动调用）：

```typescript
import { initEvlog } from '@repo/logger';

initEvlog({
  service: "my-app",
  environment: "production",
  version: "1.0.0",
  pretty: false, // 生产环境关闭美化输出
});
```

## 依赖

- **evlog**: Wide Events 日志库

## License

MIT
