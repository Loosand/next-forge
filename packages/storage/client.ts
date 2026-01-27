// Re-export @better-upload/client hooks for client-side uploads
export {
  useUploadFile,
  useUploadFiles,
} from "@better-upload/client";

// Re-export @better-upload/server utilities for route configuration
export {
  type Router,
  route,
} from "@better-upload/server";

export { toRouteHandler } from "@better-upload/server/adapters/next";

export { cloudflare } from "@better-upload/server/clients";

// Re-export safe utility functions that can be used on client
export {
  buildKey,
  buildUrl,
  extractKey,
  uniqueName,
  yearMonth,
} from "./utils";
