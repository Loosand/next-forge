import { Queue } from "bullmq";
import { connectionOptions } from "../connection";
import type { SyncJobData } from "../types";
import { QueueNames } from "../types";

export const syncQueue = new Queue<SyncJobData>(QueueNames.SYNC, {
  connection: connectionOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: {
      age: 12 * 3600,
      count: 500,
    },
    removeOnFail: {
      age: 3 * 24 * 3600,
    },
  },
});

export function addSyncJob(data: SyncJobData) {
  return syncQueue.add(`sync-${data.entityType}`, data, {
    jobId: `${data.entityType}-${data.entityId}-${data.action}`,
  });
}
