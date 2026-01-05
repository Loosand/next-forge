import { Queue } from "bullmq";
import { connectionOptions } from "../connection";
import type { EmailJobData } from "../types";
import { QueueNames } from "../types";

export const emailQueue = new Queue<EmailJobData>(QueueNames.EMAIL, {
  connection: connectionOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: {
      age: 24 * 3600, // 24 hours
      count: 1000,
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // 7 days
    },
  },
});

export function addEmailJob(data: EmailJobData, delay?: number) {
  return emailQueue.add("send-email", data, {
    delay,
  });
}
