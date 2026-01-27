import type { Metadata } from "next";
import { UploadForm } from "./upload-form";

const title = "Test Storage Upload";
const description = "Test image upload to Cloudflare R2 storage.";

export const metadata: Metadata = {
  title,
  description,
};

const TestUploadPage = () => (
  <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
    <div className="text-center">
      <h1 className="font-bold text-4xl">Test Storage Upload</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
    <UploadForm />
  </div>
);

export default TestUploadPage;
