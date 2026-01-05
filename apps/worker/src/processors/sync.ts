import { connectionOptions } from "@repo/queue/connection";
import type { SyncJobData } from "@repo/queue/types";
import { QueueNames } from "@repo/queue/types";
import { Worker } from "bullmq";

export const syncWorker = new Worker<SyncJobData>(
  QueueNames.SYNC,
  async (job) => {
    const { entityType, entityId, action } = job.data;

    console.log(
      `🔄 Processing sync job ${job.id}: ${action} ${entityType}/${entityId}`
    );

    // TODO: Implement your sync logic here
    // Example:
    // import { database } from "@repo/database";
    // const entity = await database.query.users.findFirst({
    //   where: eq(users.id, entityId),
    // });
    // await syncToExternalService(entity);

    // Simulate sync
    await new Promise((resolve) => setTimeout(resolve, 50));

    console.log(`✓ Synced ${entityType}/${entityId}`);

    return {
      success: true,
      entityType,
      entityId,
      action,
    };
  },
  {
    connection: connectionOptions,
    concurrency: 3,
  }
);

syncWorker.on("completed", (job) => {
  console.log(`✓ Sync job ${job.id} completed`);
});

syncWorker.on("failed", (job, err) => {
  console.error(`✗ Sync job ${job?.id} failed:`, err.message);
});
