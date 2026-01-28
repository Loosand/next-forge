import type { Metadata } from "next";
import { EvlogDemo } from "./evlog-demo";

const title = "Test evlog";
const description = "Test wide events logging with evlog library.";

export const metadata: Metadata = {
  title,
  description,
};

export default function TestEvlogPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <h1 className="font-bold text-4xl">Test evlog</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <EvlogDemo />
    </div>
  );
}
