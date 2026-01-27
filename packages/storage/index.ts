import "server-only";

// Server-side R2 operations
export {
  copy,
  createClient,
  download,
  exists,
  fetchAndUpload,
  fetchAsBuffer,
  move,
  remove,
  upload,
  uploadBatch,
} from "./server";

// Types
export type {
  BatchUploadOptions,
  CopyMoveOptions,
  DeleteOptions,
  DownloadOptions,
  FetchAndUploadOptions,
  FetchAndUploadResult,
  GenerateFileNameOptions,
  GenerateKeyOptions,
  R2ClientConfig,
  UploadOptions,
  UploadResult,
} from "./types";

// Utility functions
export {
  buildKey,
  buildUrl,
  extractKey,
  getMimeType,
  uniqueName,
  yearMonth,
} from "./utils";
