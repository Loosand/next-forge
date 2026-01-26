/**
 * [INPUT]: (无) - 自动检测运行环境（服务端/客户端）
 * [OUTPUT]: Logger - 统一的日志接口，包含 log/info/warn/error/debug/success/start/complete/note/fatal 方法
 * [POS]: 位于 /packages/logger 的核心导出，作为全项目统一的日志输出入口
 *
 * [PROTOCOL]:
 * 1. 一旦本文件的环境检测逻辑、日志方法或 Proxy 机制变更，必须同步更新此 Header
 * 2. 更新后必须上浮检查 /packages/logger/.folder.md 的描述是否依然准确
 * 3. 新增日志方法时，必须同时在 Logger 类型、服务端（signale）和客户端（console 包装器）中实现
 */

import type { Signale } from "signale";

/**
 * Logger 接口：统一的日志方法签名
 *
 * 设计原则：
 * - 服务端和客户端必须提供完全一致的方法
 * - 所有方法接受任意数量的参数
 * - 标准方法（log/info/warn/error/debug）映射到 console 原生方法
 * - 扩展方法（success/start/complete/note/fatal）在客户端使用表情符号增强
 */
type Logger = {
  log: (...args: unknown[]) => void;      // 通用日志输出
  info: (...args: unknown[]) => void;     // 信息提示
  warn: (...args: unknown[]) => void;     // 警告信息
  error: (...args: unknown[]) => void;    // 错误信息
  debug: (...args: unknown[]) => void;    // 调试信息
  success: (...args: unknown[]) => void;  // 成功标记（✅）
  start: (...args: unknown[]) => void;    // 任务开始（⏳）
  complete: (...args: unknown[]) => void; // 任务完成（✓）
  note: (...args: unknown[]) => void;     // 备注信息
  fatal: (...args: unknown[]) => void;    // 致命错误
};

/**
 * Logger 实例缓存
 * 使用 null 初始值配合 Proxy 实现懒加载，避免以下问题：
 * 1. 循环依赖：其他包可能在初始化时导入 logger
 * 2. 环境检测时机：确保 typeof window 检测在真正使用时才执行
 * 3. 副作用隔离：不在模块加载阶段执行任何 require 或环境检测
 */
let loggerInstance: Logger | null = null;

/**
 * 创建环境感知的 Logger 实例
 *
 * 环境检测策略：
 * - typeof window === "undefined" → 服务端 → 使用 signale（美化输出、结构化日志）
 * - typeof window !== "undefined" → 客户端 → 使用 console 包装器（轻量、原生）
 *
 * @returns Logger 实例，保证服务端和客户端 API 完全一致
 */
function createLogger(): Logger {
  if (typeof window === "undefined") {
    // 服务端：使用 signale
    // 延迟 require 避免在客户端 bundle 中包含 signale
    return require("signale") as Signale;
  }

  // 客户端：构造 console 包装器
  // 保存原始 console 方法的引用，避免被浏览器扩展或调试工具修改
  const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
  };

  // 返回符合 Logger 接口的对象
  // 使用 bind 确保 this 指向正确
  return {
    log: originalConsole.log.bind(console),
    info: originalConsole.info.bind(console),
    warn: originalConsole.warn.bind(console),
    error: originalConsole.error.bind(console),
    debug: originalConsole.debug.bind(console),
    // 扩展方法：在客户端使用表情符号模拟 signale 的视觉效果
    success: (...args: unknown[]) =>
      originalConsole.log.call(console, "✅", ...args),
    start: (...args: unknown[]) =>
      originalConsole.log.call(console, "⏳", ...args),
    complete: (...args: unknown[]) =>
      originalConsole.log.call(console, "✓", ...args),
    note: originalConsole.info.bind(console),
    fatal: originalConsole.error.bind(console),
  };
}

/**
 * 导出的 Logger 实例
 *
 * 实现机制：
 * - 使用 ES6 Proxy 拦截所有属性访问
 * - 首次访问任意方法时才创建真正的 Logger 实例（懒加载）
 * - 后续访问直接返回缓存的实例
 *
 * 为什么用 Proxy？
 * 1. 避免循环依赖：模块加载时不执行任何初始化代码
 * 2. 按需初始化：只在真正使用时才检测环境和加载依赖
 * 3. 透明代理：对使用者完全透明，就像直接使用对象一样
 *
 * 使用示例：
 * ```typescript
 * import { logger } from '@repo/logger';
 *
 * logger.info('应用启动');           // 标准日志
 * logger.success('任务完成');        // 成功标记
 * logger.error('发生错误', error);   // 错误日志
 * ```
 */
export const logger = new Proxy({} as Logger, {
  get(_target, prop: string) {
    // 懒加载：首次访问时创建实例
    if (!loggerInstance) {
      loggerInstance = createLogger();
    }
    // 返回实例上的对应方法
    return loggerInstance[prop as keyof Logger];
  },
});
