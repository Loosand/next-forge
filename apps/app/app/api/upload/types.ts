/**
 * Upload route types - shared between server and client
 */

/**
 * Available upload routes
 * Add new routes here when extending the upload API
 */
export const uploadRoutes = ["images", "avatar"] as const;

export type UploadRoute = (typeof uploadRoutes)[number];
