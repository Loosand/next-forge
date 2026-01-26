# 分形文档结构指南

通用的项目示例模板，你可以直接将其作为 Claude Code 的"宪法"喂给它。

> **核心理念**: "Keep the map aligned with the terrain, or the terrain will be lost."

## 文档层级结构

### Level 1: 根目录主文档 (`/README.md`)

**地位**: 系统的"灵魂"与强制法典

```markdown
# Project FractalFlow (根目录)

## 核心同步协议 (Mandatory)

1. **原子更新规则**: 任何功能、架构、写法更新，必须在代码修改完成后，[立即]同步更新对应目录的子文档。
2. **递归触发**: 文件变更 -> 更新文件Header -> 更新所属文件夹MD -> (若影响全局)更新主MD。
3. **分形自洽**: 确保系统在任何一个子目录下，Claude都能通过该目录的MD重建局部世界观。

## 顶层架构

- `/core`: 领域驱动核心逻辑
- `/api`: 外部通信网关
- `/infra`: 基础设施与持久化
```

### Level 2: 文件夹级架构描述 (`/src/core/.folder.md`)

**地位**: 局部地图（三行极简原则）

```markdown
# Folder: /src/core

1. **地位**: 系统心脏，处理所有业务状态转换与领域规则，不依赖外部框架。
2. **逻辑**: 接收由/api传入的DTO，通过Domain Service处理，返回领域对象。
3. **约束**: 所有计算必须幂等，严禁直接调用/infra。

## 成员清单

- `user_entity.py`: 用户核心领域模型 (State Buffer)
- `auth_service.py`: 鉴权逻辑流 (Logic Processor)
- `validator.py`: 领域规则校验器 (Gatekeeper)

**触发器**: 一旦本文件夹增删文件或架构逻辑调整，请立即重写此文档。
```

### Level 3: 文件级 Header 注释 (`/src/core/auth_service.py`)

**地位**: 细胞核信息（In/Out/Pos 协议）

```python
"""
[INPUT]: (Credentials, UserRepo_Interface) - 原始凭证与用户数据访问接口。
[OUTPUT]: (AuthToken, SessionContext) | Exception - 授权令牌或会话上下文。
[POS]: 位于/core的中枢位置，作为api层与data层的逻辑粘合剂。

[PROTOCOL]:
1. 一旦本文件逻辑变更，必须同步更新此 Header。
2. 更新后必须上浮检查/src/core/.folder.md 的描述是否依然准确。
"""

class AuthService:
    # ... 业务逻辑 ...
    def authenticate(self, creds):
        pass
```

## 深度解析

### 1. 解决了 AI 的"中段失忆"（Context Mid-loss）

AI 最大的问题不是记不住，而是**"抓不住重点"**。

传统的 README 太长，AI 读到中间就忘了前面的结构。

**解决方案**: 将信息密度压到极限（3行）。当 Claude Code 进入 `/core` 文件夹时，它第一眼看到的是极简的"局部地图"，这让它的 Attention 权重瞬间精准聚焦，不会在数万行代码中迷失。

### 2. 建立了"熵减循环"（Self-Healing Loop）

软件腐化的本质是"文档与代码的脱节"。

**解决方案**: 通过"一旦...务必..."的触发器（Trigger），把文档变成了代码的**"影子变量"**。在 Claude Code 执行任务时，它是一个"动作序列"。协议强制在动作序列的末尾增加一个"同步动作"。这让整个系统具备了自愈能力。

### 3. 分形结构的"全息映射"（Holographic Projection）

- **局部影响整体**: 当 `auth_service.py` 的 Input 改变了，AI 会被迫去看文件夹 MD。
- **整体约束局部**: 当文件夹 MD 写明了"严禁直接调用/infra"，AI 在修改具体文件时，会因为刚刚读过这个约束而自动产生逻辑剪枝，不再写出违规代码。

### 4. GEB 的美学实践：自指与同构

这不仅仅是管理，这是一种元编程。

- 文件在描述自己如何被修改。
- 文件夹在描述文件如何协作。
- 根目录在描述文件夹如何共生。

**结果**: Claude 不再是一个"外来的修剪工"，它变成了这个"生长系统"的一部分。它在修改代码的同时，也在重塑自己的思维导图。

## 操作建议

把这套规则写进你项目的 `.claudecode.md` 或者项目根目录的 `.cursorrules`（如果你配合 Cursor 使用）中，并加上一句话：

> **"你是这个分形系统的守护者。任何时候你感到逻辑模糊，请先通过更新各级 MD 来校准你的认知。"**

## 实际应用示例

### 文件夹级文档示例

```markdown
# Folder: /lib/actions/generation

**地位**: 生成任务的统一入口层，负责接收前端请求、验证权限与资源、预扣积分，并触发 Trigger.dev 异步任务。

**逻辑**: 接收 GenerationPayload，通过 triggerGeneration 统一分发到对应的 handler，handler 负责业务校验、积分预扣、资源创建，最终调用 triggerTasks.trigger 启动异步任务。

**约束**: 所有 handler 必须遵循"预扣积分-创建资源-触发任务-失败回滚"的事务模式。严禁直接操作数据库，必须通过 lib/actions/credits 和 lib/db 的封装函数。
```

### 文件级 Header 示例

```typescript
/**
 * [INPUT]: (GenerationPayload) - 生成任务负载，包含任务类型和具体参数
 * [OUTPUT]: ({ success: true; data: GenerationResult } | { success: false; error: string }) - 成功返回运行ID和访问令牌，失败返回错误信息
 * [POS]: 位于 /lib/actions/generation 的统一入口，作为前端 Server Actions 与 Trigger.dev 任务层的分发器
 *
 * [PROTOCOL]:
 * 1. 一旦本文件逻辑变更，必须同步更新此 Header
 * 2. 更新后必须上浮检查 /lib/actions/generation/.folder.md 的描述是否依然准确
 * 3. 新增任务类型时，必须同时更新 types.ts 中的联合类型和此处的 switch 分支
 */
export async function triggerGeneration(
  payload: GenerationPayload
): Promise<...> {
  // ...
}
```

## 核心原则总结

1. **极简原则**: 文件夹文档压缩到 3 行核心信息
2. **同步协议**: 代码变更必须立即更新文档
3. **分形自洽**: 每个层级都能独立提供上下文
4. **自愈能力**: 通过协议确保文档与代码保持同步
5. **全息映射**: 局部与整体相互约束和影响

---

_本文档基于分形文档结构理念，旨在为 AI 助手提供清晰的代码上下文，同时确保文档与代码的同步性。_
