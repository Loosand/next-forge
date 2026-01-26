/**
 * [INPUT]: children - React 子节点; privacyUrl/termsUrl/helpUrl - 可选的 URL 配置（保留用于兼容性）
 * [OUTPUT]: AuthProvider - 透传组件（直接返回 children）
 * [POS]: 位于 /packages/auth 的 Provider 导出，用于在应用根部包裹子组件（兼容性层）
 *
 * [PROTOCOL]:
 * 1. 一旦本文件的接口变更，必须同步更新此 Header
 * 2. 更新后必须上浮检查 /packages/auth/.folder.md 的描述是否依然准确
 * 3. 保持此组件为透传组件，Better Auth 不需要 Provider 包裹
 */

"use client";

import type { ReactNode } from "react";

type AuthProviderProperties = {
  children: ReactNode;
  privacyUrl?: string;
  termsUrl?: string;
  helpUrl?: string;
};

/**
 * 认证 Provider 组件（兼容性层）
 *
 * Better Auth 不需要像 Clerk 那样的 Provider 包裹组件。
 * 这是一个透传组件，仅用于保持 API 兼容性。
 *
 * 如果从其他认证库（如 Clerk）迁移过来，可以保留这个组件调用，
 * 不会产生任何副作用。
 *
 * @param children - 子组件
 * @param privacyUrl - 隐私政策 URL（保留用于未来扩展）
 * @param termsUrl - 服务条款 URL（保留用于未来扩展）
 * @param helpUrl - 帮助中心 URL（保留用于未来扩展）
 * @returns 直接返回 children，不做任何包裹
 */
export const AuthProvider = ({ children }: AuthProviderProperties) => children;
