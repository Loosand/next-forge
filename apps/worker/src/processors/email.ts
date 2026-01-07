import { connectionOptions } from "@repo/queue/connection";
import type { EmailJobData } from "@repo/queue/types";
import { QueueNames } from "@repo/queue/types";
import { Worker } from "bullmq";

export const emailWorker = new Worker<EmailJobData>(
  QueueNames.EMAIL,
  async (job) => {
    const { to, subject } = job.data;

    console.log(`📧 Processing email job ${job.id}: ${subject} -> ${to}`);

    // TODO: Integrate with @repo/email
    // Example:
    // import { resend } from "@repo/email";
    // await resend.emails.send({
    //   from: "noreply@example.com",
    //   to,
    //   subject,
    //   react: getEmailTemplate(template, data),
    // });

    // Simulate email sending for now
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log(`✓ Email sent to ${to}`);

    return { success: true, to, subject };
  },
  {
    connection: connectionOptions,
    concurrency: 5,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`✓ Email job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`✗ Email job ${job?.id} failed:`, err.message);
});
