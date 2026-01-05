import { connectionOptions } from "@repo/queue/connection";
import type { WebhookJobData } from "@repo/queue/types";
import { QueueNames } from "@repo/queue/types";
import { Worker } from "bullmq";

export const webhookWorker = new Worker<WebhookJobData>(
  QueueNames.WEBHOOK,
  async (job) => {
    const { url, payload, headers = {} } = job.data;

    console.log(`🔗 Processing webhook job ${job.id}: ${url}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status ${response.status}`);
    }

    console.log(`✓ Webhook sent to ${url}`);

    return {
      success: true,
      status: response.status,
      url,
    };
  },
  {
    connection: connectionOptions,
    concurrency: 10,
  }
);

webhookWorker.on("completed", (job) => {
  console.log(`✓ Webhook job ${job.id} completed`);
});

webhookWorker.on("failed", (job, err) => {
  console.error(`✗ Webhook job ${job?.id} failed:`, err.message);
});
