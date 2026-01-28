import { type Router, route } from "@better-upload/server";
import { toRouteHandler } from "@better-upload/server/adapters/next";
import { cloudflare } from "@better-upload/server/clients";
import { uniqueName, yearMonth } from "@repo/storage/client";
import { env } from "@/env";
import type { UploadRoute } from "./types";

const s3 = cloudflare({
  accountId: env.CLOUDFLARE_R2_ACCOUNT_ID,
  accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
  secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
});

// Define routes with type constraint
const routes = {
  images: route({
    fileTypes: ["image/*"],
    multipleFiles: true,
    maxFiles: 10,
    maxFileSize: 30 * 1024 * 1024,
    onBeforeUpload: async () => ({
      generateObjectInfo: ({ file }) => {
        const ym = yearMonth();
        return {
          key: `uploads/${ym}/${uniqueName({ prefix: "img", originalName: file.name })}`,
        };
      },
    }),
  }),
  avatar: route({
    fileTypes: ["image/*"],
    multipleFiles: true,
    maxFiles: 1,
    maxFileSize: 5 * 1024 * 1024,
    onBeforeUpload: async () => ({
      generateObjectInfo: ({ file }) => ({
        key: `avatars/${uniqueName({ prefix: "avatar", originalName: file.name })}`,
      }),
    }),
  }),
} satisfies Record<UploadRoute, ReturnType<typeof route>>;

const router: Router = {
  client: s3,
  bucketName: env.CLOUDFLARE_R2_BUCKET,
  routes,
};

export const { POST } = toRouteHandler(router);
