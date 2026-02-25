---
title: 宽事件 / 规范日志行
impact: 关键
tags: logging, wide-events, canonical-log-lines
---

## 宽事件 / 规范日志行

**影响级别: 关键**

宽事件（也称为规范日志行）是有效日志记录的基础。对于每个请求，**每个服务发出一个上下文丰富的事件**。不要在请求处理器中分散 10-20 行日志，而是将所有内容整合到请求结束时发出的一个综合事件中。

### 模式

在整个请求生命周期中构建事件，然后在 `finally` 块中完成时发出一次。这确保了事件总是带着完整的上下文发出，即使在失败时也是如此。

**错误做法：**

```typescript
app.post('/articles', async (c) => {
  console.log('Received POST /articles request');

  const body = await c.req.json();
  console.log('Request body parsed', { title: body.title });

  const user = await getUser(c.get('userId'));
  console.log('User fetched', { userId: user.id });

  const article = await database.saveArticle({ ...body, ownerId: user.id });
  console.log('Article saved', { articleId: article.id });

  await cache.set(article.id, article);
  console.log('Cache updated');

  console.log('Request completed successfully');
  return c.json({ article }, 201);
});
// 6 行分散的日志行，上下文零散
// 无法查询："显示所有免费试用用户创建的文章"
```

**正确做法：**

```typescript
app.post('/articles', async (c) => {
  const startTime = Date.now();
  const wideEvent: Record<string, unknown> = {
    method: 'POST',
    path: '/articles',
    service: 'articles',
    requestId: c.get('requestId'),
  };

  try {
    const body = await c.req.json();
    const user = await getUser(c.get('userId'));
    wideEvent.user = {
      id: user.id,
      subscription: user.subscription,
      trial: user.trial,
    };

    const article = await database.saveArticle({ ...body, ownerId: user.id });
    wideEvent.article = {
      id: article.id,
      title: article.title,
      published: article.published,
    };

    await cache.set(article.id, article);
    wideEvent.cache = { operation: 'write', key: article.id };

    wideEvent.status_code = 201;
    wideEvent.outcome = 'success';
    return c.json({ article }, 201);
  } catch (error) {
    wideEvent.status_code = 500;
    wideEvent.outcome = 'error';
    wideEvent.error = { message: error.message, type: error.name };
    throw error;
  } finally {
    wideEvent.duration_ms = Date.now() - startTime;
    wideEvent.timestamp = new Date().toISOString();
    logger.info(JSON.stringify(wideEvent));
  }
});
// 单个事件包含所有上下文 - 可按任何字段查询
```

### 使用请求 ID 连接事件

每个宽事件都必须包含一个唯一的请求 ID，该 ID 在所有服务跳转中传播。这是在分布式系统中重建请求完整路径的唯一方法。

```typescript
// 服务 A - 生成并传播
const requestId = c.get('requestId') || crypto.randomUUID();
wideEvent.requestId = requestId;

await fetch('http://downstream-service/endpoint', {
  headers: { 'x-request-id': requestId },
  body: JSON.stringify(data),
});

// 服务 B - 提取并使用
const requestId = c.req.header('x-request-id');
wideEvent.requestId = requestId;  // 相同的 ID 将事件链接在一起
```

### 在 Finally 块中发出

始终在 `finally` 块或等效位置发出宽事件。这确保了无论成功还是失败，事件都会带着完整的上下文发出。

参考：[Stripe 博客 - 规范日志行](https://stripe.com/blog/canonical-log-lines)
