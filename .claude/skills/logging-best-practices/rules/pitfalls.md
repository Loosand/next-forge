---
title: 常见陷阱
impact: 中等
tags: logging, anti-patterns, pitfalls
---

## 常见陷阱

**影响级别: 中等**

避免这些会削弱日志有效性的反模式。

### 陷阱 1：每个请求日志行过多

每个请求发出多行日志会产生噪音而无实际价值。这些分散的日志无法被高效查询。

**错误做法：**

```typescript
app.post('/checkout', async (c) => {
  console.log('Received checkout request');                    // 第 1 行
  console.log(`User ID: ${c.get('userId')}`);                  // 第 2 行
  const user = await getUser(c.get('userId'));
  console.log(`User fetched: ${user.email}`);                  // 第 3 行
  const cart = await getCart(user.id);
  console.log(`Cart fetched: ${cart.items.length} items`);     // 第 4 行
  const payment = await processPayment(cart);
  console.log(`Payment processed: ${payment.status}`);         // 第 5 行
  console.log('Checkout completed successfully');              // 第 6 行
  return c.json({ orderId: payment.orderId });
});
// 每个请求 6 行日志 = 噪音
```

**正确做法：**

```typescript
// 单个宽事件包含所有内容
const wideEvent = {
  method: 'POST',
  path: '/checkout',
  user: { id: user.id, email: user.email },
  cart: { item_count: cart.items.length, total: cart.total },
  payment: { status: payment.status, order_id: payment.orderId },
  status_code: 200,
  duration_ms: 1247,
};
```

### 陷阱 2：没有为未知的未知做设计

传统日志记录捕获的是"已知的未知" - 你预料到的问题。但生产环境的 bug 往往是"未知的未知" - 你从未预测的问题。具有丰富上下文的宽事件能够调查你未曾预料的问题。

**错误做法：**

```typescript
// 只为预料到的问题记录日志
app.post('/articles', async (c) => {
  const article = await createArticle(c.req.body, user);
  if (!article.published) {
    console.log('Article created but not published');  // 预料到的问题
  }
  return c.json({ article });
});

// Bug："免费试用的用户看不到他们的文章"
// 你的日志显示："Article created successfully" ✓
// 但你对以下内容没有可见性：
// - 哪些用户受到影响（免费试用？全部？）
// - 哪些订阅计划出现这个问题
// - 何时开始的
```

**正确做法：**

```typescript
// 宽事件捕获所有内容
wideEvent.user = {
  id: user.id,
  subscription: user.subscription,
  trial: user.trial,
  trial_expiration: user.trialExpiration,
};

wideEvent.article = {
  id: article.id,
  published: article.published,  // 即使我们没有预料到这个 bug 也会被捕获
};

// 现在你可以查询：WHERE article.published = false GROUP BY user.trial
// 结果：95% 的未发布文章来自试用用户！
```

### 陷阱 3：缺少请求关联

没有跨服务传播的请求 ID，你无法追踪请求的完整路径。

**错误做法：**

```typescript
// 服务 A 的日志
{ message: 'Order created', order_id: 'ord_123' }

// 服务 B 的日志
{ message: 'Inventory reserved', items: 3 }

// 无法连接这两个事件！
```

**正确做法：**

```typescript
// 两个服务包含相同的 request_id
{ request_id: 'req_abc', message: 'Order created', order_id: 'ord_123' }
{ request_id: 'req_abc', message: 'Inventory reserved', items: 3 }

// 查询：WHERE request_id = 'req_abc' 显示完整流程
```
