import { createError, createRequestLogger } from "@repo/logger";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const log = createRequestLogger(request);

  // 模拟添加用户上下文
  log.set({ user: { id: "user_123", plan: "premium" } });

  // 模拟添加请求上下文
  log.set({ feature: "test-evlog", timestamp: new Date().toISOString() });

  // 模拟一些处理时间
  await new Promise((resolve) => setTimeout(resolve, 100));

  // 发出日志
  log.emit();

  return NextResponse.json({
    success: true,
    message: "Check your terminal for the wide event log!",
  });
}

export async function POST(request: NextRequest) {
  const log = createRequestLogger(request);

  try {
    const body = await request.json();
    log.set({ input: body });

    // 模拟用户验证
    log.set({ user: { id: "user_456", email: "test@example.com" } });

    // 模拟业务逻辑
    if (body.shouldFail) {
      throw new Error("Simulated payment failure");
    }

    log.set({ result: { orderId: "order_789", status: "completed" } });
    log.emit();

    return NextResponse.json({
      success: true,
      orderId: "order_789",
    });
  } catch (error) {
    log.error(error as Error, { step: "payment-processing" });
    log.emit();

    const structuredError = createError({
      message: "Order processing failed",
      status: 500,
      why: (error as Error).message,
      fix: "Please try again or contact support",
    });

    return NextResponse.json(
      {
        error: structuredError.message,
        why: structuredError.data?.why,
        fix: structuredError.data?.fix,
      },
      { status: structuredError.statusCode }
    );
  }
}
