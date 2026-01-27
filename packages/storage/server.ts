import "server-only";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { keys } from "./keys";
import type {
  BatchUploadOptions,
  CopyMoveOptions,
  DeleteOptions,
  DownloadOptions,
  FetchAndUploadOptions,
  FetchAndUploadResult,
  R2ClientConfig,
  UploadOptions,
  UploadResult,
} from "./types";
import { getMimeType } from "./utils";

const env = keys();

/**
 * 创建 Cloudflare R2 客户端
 *
 * @param config - R2 配置选项
 * @returns S3 兼容的客户端实例
 */
export function createClient(config?: Partial<R2ClientConfig>): S3Client {
  const accountId = config?.accountId ?? env.CLOUDFLARE_R2_ACCOUNT_ID;
  const accessKeyId = config?.accessKeyId ?? env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey =
    config?.secretAccessKey ?? env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  let endpoint = config?.endpoint ?? env.CLOUDFLARE_R2_ENDPOINT;
  if (!endpoint) {
    endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
  }

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * 上传文件到 R2 存储
 *
 * @param options - 上传选项
 * @returns 上传结果，包含 URL 和 key
 *
 * @example
 * ```ts
 * const result = await upload({
 *   key: "images/photo.jpg",
 *   body: imageBuffer,
 *   contentType: "image/jpeg"
 * });
 * ```
 */
export async function upload(options: UploadOptions): Promise<UploadResult> {
  const {
    key,
    body,
    contentType = "application/octet-stream",
    bucket = env.CLOUDFLARE_R2_BUCKET,
    publicUrlPrefix = env.NEXT_PUBLIC_CLOUDFLARE_R2_URL,
    timeout = 60_000,
  } = options;

  const client = options.client ?? createClient();

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
      {
        abortSignal: AbortSignal.timeout(timeout),
      }
    );
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `R2 upload timeout after ${timeout / 1000} seconds for key: ${key}`
      );
    }
    throw error;
  }

  const url = publicUrlPrefix ? `${publicUrlPrefix}/${key}` : key;

  return {
    url,
    key,
    bucket,
  };
}

/**
 * 从 R2 下载文件为 Buffer
 *
 * @param options - 下载选项
 * @returns 文件内容的 Buffer
 */
export async function download(options: DownloadOptions): Promise<Buffer> {
  const { key, bucket = env.CLOUDFLARE_R2_BUCKET } = options;
  const client = options.client ?? createClient();

  const response = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  if (!response.Body) {
    throw new Error(`Failed to fetch file from R2: ${key}`);
  }

  const chunks: Uint8Array[] = [];
  for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

/**
 * 检查 R2 中文件是否存在
 *
 * @param options - 检查选项
 * @returns 文件是否存在
 */
export async function exists(options: DownloadOptions): Promise<boolean> {
  const { key, bucket = env.CLOUDFLARE_R2_BUCKET } = options;
  const client = options.client ?? createClient();

  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    return true;
  } catch (error: unknown) {
    const err = error as {
      name?: string;
      $metadata?: { httpStatusCode?: number };
      Code?: string;
      code?: string;
      statusCode?: number;
      message?: string;
    };

    const isNotFound =
      err.name === "NotFound" ||
      err.name === "NoSuchKey" ||
      err.name === "404" ||
      err.Code === "NoSuchKey" ||
      err.Code === "NotFound" ||
      err.code === "NoSuchKey" ||
      err.code === "NotFound" ||
      err.$metadata?.httpStatusCode === 404 ||
      err.statusCode === 404 ||
      err.message?.includes("not found") ||
      err.message?.includes("NoSuchKey");

    if (isNotFound) {
      return false;
    }

    throw error;
  }
}

/**
 * 从 R2 删除文件
 *
 * @param options - 删除选项
 * @returns 删除结果
 */
export async function remove(
  options: DeleteOptions
): Promise<{ success: true; key: string }> {
  const { key, bucket = env.CLOUDFLARE_R2_BUCKET } = options;
  const client = options.client ?? createClient();

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  return { success: true, key };
}

/**
 * 在 R2 中复制文件到新位置
 *
 * @param options - 复制选项
 * @returns 复制结果
 */
export async function copy(
  options: CopyMoveOptions
): Promise<{ success: true; sourceKey: string; destinationKey: string }> {
  const {
    sourceKey,
    destinationKey,
    bucket = env.CLOUDFLARE_R2_BUCKET,
  } = options;
  const client = options.client ?? createClient();

  const fileBuffer = await download({ key: sourceKey, bucket, client });

  const extension = sourceKey.split(".").pop()?.toLowerCase();
  const contentType = getMimeType(extension);

  await upload({
    key: destinationKey,
    body: fileBuffer,
    contentType,
    bucket,
    client,
  });

  return { success: true, sourceKey, destinationKey };
}

/**
 * 在 R2 中移动文件（复制后删除源文件）
 *
 * @param options - 移动选项
 * @returns 移动结果
 */
export async function move(
  options: CopyMoveOptions
): Promise<{ success: true; sourceKey: string; destinationKey: string }> {
  const { sourceKey, destinationKey, bucket, client } = options;

  await copy({ sourceKey, destinationKey, bucket, client });
  await remove({ key: sourceKey, bucket, client });

  return { success: true, sourceKey, destinationKey };
}

/**
 * 批量上传多个文件到 R2
 *
 * @param options - 批量上传选项
 * @returns 上传结果数组
 */
export async function uploadBatch(
  options: BatchUploadOptions
): Promise<UploadResult[]> {
  const { files, bucket, client, publicUrlPrefix, parallel = true } = options;

  const uploadPromises = files.map((file) =>
    upload({
      key: file.key,
      body: file.body,
      contentType: file.contentType,
      bucket,
      client,
      publicUrlPrefix,
    })
  );

  if (parallel) {
    return Promise.all(uploadPromises);
  }

  const results: UploadResult[] = [];
  for (const promise of uploadPromises) {
    results.push(await promise);
  }
  return results;
}

/**
 * 从远程 URL 下载文件并上传到 R2
 *
 * @param options - 下载和上传选项
 * @returns 上传结果
 */
export async function fetchAndUpload(
  options: FetchAndUploadOptions
): Promise<FetchAndUploadResult> {
  const {
    sourceUrl,
    destinationKey,
    contentType,
    bucket,
    client,
    publicUrlPrefix,
  } = options;

  const response = await fetch(sourceUrl, {
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to download file from ${sourceUrl}: ${response.status} ${response.statusText}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const detectedContentType =
    contentType ||
    response.headers.get("content-type") ||
    "application/octet-stream";

  const result = await upload({
    key: destinationKey,
    body: buffer,
    contentType: detectedContentType,
    bucket,
    client,
    publicUrlPrefix,
  });

  return {
    ...result,
    size: buffer.length,
    detectedContentType,
  };
}

/**
 * 从 URL 下载文件并返回 Buffer
 *
 * @param url - 文件 URL
 * @returns 文件 Buffer
 */
export async function fetchAsBuffer(url: string): Promise<Buffer> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(60_000),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to download from ${url}: ${response.status} ${response.statusText}`
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error(`Download timeout after 60s: ${url}`);
      }
      if (error.message.includes("fetch failed")) {
        throw new Error(
          `Network error downloading from ${url}: ${error.message}`
        );
      }
    }
    throw error;
  }
}
