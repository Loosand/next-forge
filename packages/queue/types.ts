export type EmailJobData = {
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
};

export type WebhookJobData = {
  url: string;
  payload: Record<string, unknown>;
  headers?: Record<string, string>;
};

export type SyncJobData = {
  entityType: string;
  entityId: string;
  action: "create" | "update" | "delete";
};

// Add your custom job types here
export type JobData = EmailJobData | WebhookJobData | SyncJobData;

export const QueueNames = {
  EMAIL: "email",
  WEBHOOK: "webhook",
  SYNC: "sync",
} as const;

export type QueueName = (typeof QueueNames)[keyof typeof QueueNames];
