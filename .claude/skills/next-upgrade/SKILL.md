---
name: next-upgrade
description: 按照官方迁移指南和 codemods 升级 Next.js 到最新版本
argument-hint: "[目标版本]"
---

# 升级 Next.js

按照官方迁移指南将当前项目升级到最新的 Next.js 版本。

## 说明

1. **检测当前版本**：读取 `package.json` 以识别当前的 Next.js 版本和相关依赖项（React、React DOM 等）

2. **获取最新的升级指南**：使用 WebFetch 获取官方升级文档：
   - Codemods：https://nextjs.org/docs/app/building-your-application/upgrading/codemods
   - 特定版本指南（根据需要调整版本）：
     - https://nextjs.org/docs/app/building-your-application/upgrading/version-15
     - https://nextjs.org/docs/app/building-your-application/upgrading/version-14

3. **确定升级路径**：基于当前版本，确定哪些迁移步骤适用。对于主要版本跳跃，逐步升级（例如，13 → 14 → 15）。

4. **首先运行 codemods**：Next.js 提供 codemods 来自动化破坏性更改：
   ```bash
   npx @next/codemod@latest <transform> <path>
   ```
   常见的转换：
   - `next-async-request-api` - 更新异步请求 API（v15）
   - `next-request-geo-ip` - 迁移 geo/ip 属性（v15）
   - `next-dynamic-access-named-export` - 转换动态导入（v15）

5. **更新依赖项**：一起升级 Next.js 和对等依赖项：
   ```bash
   npm install next@latest react@latest react-dom@latest
   ```

6. **审查破坏性更改**：检查升级指南中需要手动更改的内容：
   - API 更改（例如，v15 中的异步参数）
   - `next.config.js` 中的配置更改
   - 正在删除的已弃用功能

7. **更新 TypeScript 类型**（如果适用）：
   ```bash
   npm install @types/react@latest @types/react-dom@latest
   ```

8. **测试升级**：
   - 运行 `npm run build` 检查构建错误
   - 运行 `npm run dev` 并测试关键功能
