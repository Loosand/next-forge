import { parseError } from "@repo/observability/error";
import { auth as triggerAuth } from "@trigger.dev/sdk/v3";

export const POST = async () => {
  try {
    // 生成 trigger token，允许触发任务并读取运行状态
    // 使用 scopes 格式允许读取所有 runs
    const triggerToken = await triggerAuth.createPublicToken({
      scopes: {
        read: {
          runs: true,
        },
      },
      expirationTime: "1h",
    });

    return Response.json({ token: triggerToken });
  } catch (error) {
    return Response.json({ error: parseError(error) }, { status: 500 });
  }
};
