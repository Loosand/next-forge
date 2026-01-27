import { parseError } from "@repo/observability/error";
import { auth as triggerAuth } from "@trigger.dev/sdk/v3";

export const POST = async () => {
  try {
    // 生成 trigger token，允许触发 hello-world 任务并读取运行状态
    const triggerToken = await triggerAuth.createTriggerPublicToken(
      "hello-world",
      { expirationTime: "1h" }
    );

    return Response.json({ token: triggerToken });
  } catch (error) {
    return Response.json({ error: parseError(error) }, { status: 500 });
  }
};
