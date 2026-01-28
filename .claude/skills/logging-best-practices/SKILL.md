---
name: logging-best-practices
description: 日志最佳实践，专注于宽事件（规范日志行）以实现强大的调试和分析能力
license: MIT
metadata:
  author: boristane
  version: "1.0.0"
---

# 日志最佳实践技能

版本: 1.0.0

## 目的

本技能提供在应用程序中实现有效日志记录的指南。它专注于**宽事件**（也称为规范日志行）- 一种每个请求每个服务只发出一个上下文丰富的事件的模式，从而实现强大的调试和分析能力。

## 适用场景

在以下情况下应用这些指南：
- 编写或审查日志代码
- 添加 console.log、logger.info 或类似调用
- 为新服务设计日志策略
- 搭建日志基础设施

## 核心原则

### 1. 宽事件（关键）

**每个请求每个服务发出一个上下文丰富的事件**。不要在处理器中分散日志行，而是将所有内容整合到请求完成时发出的单个结构化事件中。

```typescript
const wideEvent: Record<string, unknown> = {
  method: 'POST',
  path: '/checkout',
  requestId: c.get('requestId'),
  timestamp: new Date().toISOString(),
};

try {
  const user = await getUser(c.get('userId'));
  wideEvent.user = { id: user.id, subscription: user.subscription };

  const cart = await getCart(user.id);
  wideEvent.cart = { total_cents: cart.total, item_count: cart.items.length };

  wideEvent.status_code = 200;
  wideEvent.outcome = 'success';
  return c.json({ success: true });
} catch (error) {
  wideEvent.status_code = 500;
  wideEvent.outcome = 'error';
  wideEvent.error = { message: error.message, type: error.name };
  throw error;
} finally {
  wideEvent.duration_ms = Date.now() - startTime;
  logger.info(wideEvent);
}
```

### 2. 高基数与高维度（关键）

包含高基数字段（用户 ID、请求 ID - 数百万个唯一值）和高维度（每个事件多个字段）。这使得可以按特定用户查询，并回答你尚未预料到的问题。

### 3. 业务上下文（关键）

始终包含业务上下文：用户订阅级别、购物车价值、功能开关、账户年龄。目标是了解"一位高级客户无法完成 2,499 美元的购买"，而不仅仅是"结账失败"。

### 4. 环境特征（关键）

在每个事件中包含环境和部署信息：提交哈希、服务版本、区域、实例 ID。这使得可以将问题与部署关联，并识别特定区域的问题。

### 5. 单一日志器（高优先级）

使用一个在启动时配置的日志器实例，并在所有地方导入它。这确保了一致的格式和自动的环境上下文。

### 6. 中间件模式（高优先级）

使用中间件处理宽事件基础设施（计时、状态、环境、发送）。处理器只需添加业务上下文。

### 7. 结构与一致性（高优先级）

- 始终使用 JSON 格式
- 跨服务保持一致的字段名称
- 简化为两个日志级别：`info` 和 `error`
- 永远不要记录非结构化字符串

## 应避免的反模式

1. **分散的日志**：每个请求多次 console.log() 调用
2. **多个日志器**：不同文件中使用不同的日志器实例
3. **缺少环境上下文**：没有提交哈希或部署信息
4. **缺少业务上下文**：只记录技术细节而没有用户/业务数据
5. **非结构化字符串**：`console.log('something happened')` 而不是结构化数据
6. **不一致的模式**：跨服务使用不同的字段名称

## 指南

### 宽事件 (`rules/wide-events.md`)
- 每个服务跳转发出一个宽事件
- 包含所有相关上下文
- 使用请求 ID 连接事件
- 在 finally 块中请求完成时发出

### 上下文 (`rules/context.md`)
- 支持高基数字段（user_id、request_id）
- 包含高维度（多个字段）
- 始终包含业务上下文
- 始终包含环境特征（commit_hash、version、region）

### 结构 (`rules/structure.md`)
- 在整个代码库中使用单一日志器
- 使用中间件实现一致的宽事件
- 使用 JSON 格式
- 保持一致的模式
- 简化为 info 和 error 级别
- 永远不要记录非结构化字符串

### 常见陷阱 (`rules/pitfalls.md`)
- 避免每个请求多行日志
- 为未知的未知做设计
- 始终跨服务传播请求 ID

参考资料:
- [Logging Sucks](https://loggingsucks.com)
- [Observability Wide Events 101](https://boristane.com/blog/observability-wide-events-101/)
- [Stripe - Canonical Log Lines](https://stripe.com/blog/canonical-log-lines)
