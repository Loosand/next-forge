import { logger } from "@trigger.dev/sdk";

/**
 * 简化的任务日志工具
 *
 * 设计原则：
 * - 只记录关键阶段和错误
 * - 移除成功日志（成功是预期行为，不需要记录）
 * - 保持日志简洁、易于调试
 */
export const taskLogger = {
  /**
   * 记录任务开始
   */
  start(taskName: string, details?: Record<string, unknown>) {
    logger.info(`▶️  ${taskName}`, details);
  },

  /**
   * 记录关键阶段
   */
  phase(phaseName: string, details?: Record<string, unknown>) {
    logger.info(`📍 ${phaseName}`, details);
  },

  info(message: string, details?: Record<string, unknown>) {
    logger.info(`ℹ️ ${message}`, details);
  },

  /**
   * 记录错误（带完整错误信息）
   */
  error(message: string, error: unknown, details?: Record<string, unknown>) {
    logger.error(`❌ ${message}`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...details,
    });
  },

  /**
   * 记录警告
   */
  warn(message: string, details?: Record<string, unknown>) {
    logger.warn(`⚠️  ${message}`, details);
  },
};
