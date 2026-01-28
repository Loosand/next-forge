"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { useState } from "react";

type ApiResponse = {
  success?: boolean;
  message?: string;
  orderId?: string;
  error?: string;
  why?: string;
  fix?: string;
};

export function EvlogDemo() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const testGet = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/test-evlog");
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: (error as Error).message });
    }
    setLoading(false);
  };

  const testPostSuccess = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/test-evlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "checkout", amount: 9999 }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: (error as Error).message });
    }
    setLoading(false);
  };

  const testPostError = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/test-evlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "checkout", shouldFail: true }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: (error as Error).message });
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wide Events Demo</CardTitle>
          <CardDescription>
            Click buttons to trigger API calls. Check the terminal for wide
            event logs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button onClick={testGet} disabled={loading}>
              GET Request
            </Button>
            <Button onClick={testPostSuccess} disabled={loading}>
              POST Success
            </Button>
            <Button
              onClick={testPostError}
              disabled={loading}
              variant="destructive"
            >
              POST Error
            </Button>
          </div>

          {response && (
            <div className="mt-4 rounded-lg border p-4">
              <h3 className="mb-2 font-medium">Response:</h3>
              <pre className="overflow-auto rounded bg-muted p-3 text-sm">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What is evlog?</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert">
          <p>
            <strong>Wide Events</strong>: One log per request with all context
            included.
          </p>
          <p>Instead of scattered logs like:</p>
          <pre className="rounded bg-muted p-2 text-xs">
            {`console.log('Request received')
console.log('User:', user.id)
console.log('Cart loaded')
console.log('Payment failed')`}
          </pre>
          <p>You get ONE comprehensive event:</p>
          <pre className="rounded bg-muted p-2 text-xs">
            {`{
  "timestamp": "2025-01-24T10:23:45.612Z",
  "level": "info",
  "method": "POST",
  "path": "/api/checkout",
  "duration": "1.2s",
  "user": { "id": "123", "plan": "premium" },
  "cart": { "items": 3, "total": 9999 },
  "status": 200
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
