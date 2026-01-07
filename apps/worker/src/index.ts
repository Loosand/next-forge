import { closeRedisConnection } from "@repo/queue/connection";
import { emailWorker } from "./processors/email.js";
import { syncWorker } from "./processors/sync.js";
import { webhookWorker } from "./processors/webhook.js";

const workers = [emailWorker, syncWorker, webhookWorker];

console.log("🚀 Starting workers...");

for (const worker of workers) {
  console.log(`  ✓ ${worker.name} worker started`);
}

async function shutdown() {
  console.log("\n🛑 Shutting down workers...");

  await Promise.all(workers.map((worker) => worker.close()));
  await closeRedisConnection();

  console.log("✓ All workers stopped");
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// Keep the process alive
process.stdin.resume();
