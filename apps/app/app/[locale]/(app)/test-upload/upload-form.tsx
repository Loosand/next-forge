"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Input } from "@repo/design-system/components/ui/input";
import { useUploadFiles } from "@repo/storage/client";
import { useRef, useState } from "react";
import type { UploadRoute } from "@/app/api/upload/route";
import { env } from "@/env";

const R2_PUBLIC_URL = env.NEXT_PUBLIC_CLOUDFLARE_R2_URL;

type UploadedFile = {
  key: string;
  url: string;
  name: string;
};

export function UploadForm() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { upload, isPending, progresses } = useUploadFiles({
    route: "avatar" satisfies UploadRoute,
    onUploadComplete: ({ files }) => {
      console.log("Upload complete:", files);
      const newFiles = files.map((file) => {
        const key = file.objectInfo.key;
        const url = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : key;
        console.log("File uploaded:", { key, url, name: file.name });
        return { key, url, name: file.name };
      });
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      setError(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    onError: (err) => {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      upload(Array.from(files));
    }
  };

  const totalProgress =
    progresses.length > 0
      ? Math.round(
          progresses.reduce((sum, p) => sum + p.progress, 0) / progresses.length
        )
      : 0;

  return (
    <div className="w-full max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
          <CardDescription>
            Select images to upload to Cloudflare R2. Max 10 files, 10MB each.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              accept="image/*"
              className="flex-1"
              disabled={isPending}
              multiple
              onChange={handleFileChange}
              ref={inputRef}
              type="file"
            />
            <Button disabled={isPending || !inputRef.current?.files?.length}>
              {isPending ? `Uploading... ${totalProgress}%` : "Upload"}
            </Button>
          </div>

          {isPending && (
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
              <p className="text-muted-foreground text-sm">
                Uploading {progresses.length} file(s)...
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>
              {uploadedFiles.length} file(s) uploaded successfully
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {uploadedFiles.map((file) => (
                <div className="space-y-2 rounded-lg border p-3" key={file.key}>
                  <img
                    alt={file.name}
                    className="aspect-square w-full rounded-md object-cover"
                    src={file.url}
                  />
                  <p className="truncate text-sm" title={file.name}>
                    {file.name}
                  </p>
                  <a
                    className="block truncate text-primary text-xs hover:underline"
                    href={file.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    View full size
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
