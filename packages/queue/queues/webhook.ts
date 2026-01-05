import { Queue } from "bullmq";
import { connectionOptions } from "../connection";
import type { WebhookJobData } from "../types";
import { QueueNames } from "../types";

export const webhookQueue = new Queue<WebhookJobData>(QueueNames.WEBHOOK, {
  connection: connectionOptions,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: {
      age: 24 * 3600,
      count: 1000,
    },
    removeOnFail: {
      age: 7 * 24 * 3600,
    },
  },
});

export function addWebhookJob(data: WebhookJobData, delay?: number) {
  return webhookQueue.add("send-webhook", data, {
    delay,
  });
}
