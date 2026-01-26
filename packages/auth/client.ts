/**
 * [INPUT]: (无) - 自动连接到服务端 auth 实例
 * [OUTPUT]: authClient - Better Auth 客户端实例; signIn/signOut/signUp/useSession/emailOtp - React hooks; SignIn/SignUp/UserMenu - UI 组件
 * [POS]: 位于 /packages/auth 的客户端导出，为 React 组件提供身份验证能力
 *
 * [PROTOCOL]:
 * 1. 一旦本文件的插件配置或导出方法变更，必须同步更新此 Header
 * 2. 更新后必须上浮检查 /packages/auth/.folder.md 的描述是否依然准确
 * 3. 新增客户端方法时，必须确保服务端 server.ts 已启用对应插件
 * 4. 导出新组件时，必须同时更新 components/ 目录的文档
 */

"use client";

import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

/**
 * Better Auth 客户端实例
 *
 * 配置说明：
 * - emailOTPClient: 启用 OTP 验证功能（与服务端的 emailOTP 插件对应）
 * - 自动处理与服务端 /api/auth 端点的通信
 */
export const authClient = createAuthClient({
  plugins: [emailOTPClient()],
});

/**
 * 导出常用的 React hooks
 * - signIn: 登录方法
 * - signOut: 退出登录方法
 * - signUp: 注册方法
 * - useSession: 获取会话状态的 Hook
 * - emailOtp: OTP 验证方法
 */
export const { signIn, signOut, signUp, useSession, emailOtp } = authClient;

/**
 * 重导出 UI 组件
 * - SignIn: 登录表单组件
 * - SignUp: 注册表单组件
 * - UserMenu: 用户菜单组件
 */
export { SignIn } from "./components/sign-in";
export { SignUp } from "./components/sign-up";
export { UserMenu } from "./components/user-menu";
