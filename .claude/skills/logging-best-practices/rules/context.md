---
title: 上下文、基数与维度
impact: 关键
tags: logging, context, cardinality, dimensionality
---

## 上下文、基数与维度

**影响级别: 关键**

宽事件必须具有丰富的上下文、高基数和高维度。这使你能够回答尚未预料到的问题 - 传统日志记录所遗漏的"未知的未知"。

### 高基数

高基数意味着一个字段可以有数百万或数十亿个唯一值。用户 ID、请求 ID 和事务 ID 都是高基数字段。你的日志系统必须支持针对这些字段的任何特定值进行查询。没有高基数支持，你无法调试特定用户的问题。

### 高维度

高维度意味着你的事件有许多字段（20-100+）。更多的维度意味着无需重新部署代码就能回答更多问题。

```typescript
const wideEvent = {
  // 时间
  timestamp: '2024-09-08T06:14:05.680Z',
  duration_ms: 268,

  // 请求上下文
  method: 'POST',
  path: '/checkout',
  requestId: 'req_abc123',

  // 基础设施
  service: 'checkout-service',
  version: '2.4.1',
  region: 'us-east-1',
  commit_hash: '690de31f',

  // 用户上下文（高基数 - 数百万个唯一值）
  user: {
    id: 'user_456',
    subscription: 'premium',
    account_age_days: 847,
    lifetime_value_cents: 284700,
  },

  // 业务上下文
  cart: {
    id: 'cart_xyz',
    item_count: 3,
    total_cents: 15999,
    coupon_applied: 'SAVE20',
  },

  // 支付详情
  payment: {
    method: 'card',
    provider: 'stripe',
    latency_ms: 189,
  },

  // 功能开关 - 对调试发布至关重要
  feature_flags: {
    new_checkout_flow: true,
  },

  // 结果
  status_code: 200,
  outcome: 'success',
};
```

### 始终包含业务上下文

包含业务特定的上下文，而不仅仅是技术细节。用户订阅级别、购物车价值、功能开关、账户年龄 - 这些上下文有助于确定问题优先级并了解业务影响。

```typescript
const wideEvent = {
  requestId: 'req_123',
  method: 'POST',
  path: '/checkout',
  status_code: 500,

  // 改变响应优先级的业务上下文
  user: {
    id: 'user_456',
    subscription: 'enterprise',        // 高价值客户
    account_age_days: 1247,            // 长期客户
    lifetime_value_cents: 4850000,     // $48,500 终身价值
  },

  cart: {
    total_cents: 249900,               // $2,499 订单
    contains_annual_plan: true,        // 涉及经常性收入
  },

  feature_flags: {
    new_payment_flow: true,            // 是否涉及新代码？
  },

  error: {
    type: 'PaymentError',
    code: 'card_declined',
  },
};
// 现在你知道这是关键问题：企业客户，$48.5k 终身价值，
// 正在尝试完成 $2.5k 的购买，并且 new_payment_flow 已启用
```

业务上下文将调试从"某些东西坏了"转变为"这位价值 $48,500 的客户无法完成 $2,499 的订单"。

### 始终包含环境特征

在每个宽事件中包含环境和部署信息。这些上下文对于将问题与部署关联、识别特定区域的问题以及了解运行时环境至关重要。

**要包含的环境字段：**

```typescript
const wideEvent = {
  // ... 请求和业务上下文

  // 环境特征
  env: {
    // 部署信息
    commit_hash: process.env.COMMIT_SHA || process.env.GIT_COMMIT,
    version: process.env.SERVICE_VERSION || process.env.npm_package_version,
    deployment_id: process.env.DEPLOYMENT_ID,
    deploy_time: process.env.DEPLOY_TIMESTAMP,

    // 基础设施
    service: process.env.SERVICE_NAME,
    region: process.env.AWS_REGION || process.env.REGION,
    availability_zone: process.env.AWS_AVAILABILITY_ZONE,
    instance_id: process.env.INSTANCE_ID || process.env.HOSTNAME,
    container_id: process.env.CONTAINER_ID,

    // 运行时
    node_version: process.version,
    runtime: process.env.AWS_EXECUTION_ENV || 'node',
    memory_limit_mb: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,

    // 环境类型
    environment: process.env.NODE_ENV || process.env.ENVIRONMENT,
    stage: process.env.STAGE,
  },
};
```

**为什么环境上下文很重要：**

- **commit_hash**：立即识别哪个代码版本导致了问题
- **deployment_id**：将错误与特定部署关联
- **region/availability_zone**：识别特定区域的故障
- **instance_id**：调试影响特定实例的问题
- **version**：跨服务版本追踪问题
- **environment**：区分生产环境和预发布环境的问题

这些环境上下文应该在服务启动时添加一次，并通过中间件自动包含在每个宽事件中。
