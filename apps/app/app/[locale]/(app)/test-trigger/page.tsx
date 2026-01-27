import type { Metadata } from "next";
import { TriggerForm } from "./trigger-form";

const title = "Test Trigger.dev";
const description = "Test the Trigger.dev hello-world task.";

export const metadata: Metadata = {
  title,
  description,
};

const TestTriggerPage = () => (
  <div className="flex h-svh flex-col items-center justify-center gap-6">
    <div className="text-center">
      <h1 className="font-bold text-4xl">Test Trigger.dev</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
    <TriggerForm />
  </div>
);

export default TestTriggerPage;
