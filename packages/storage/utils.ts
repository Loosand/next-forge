import type { GenerateFileNameOptions, GenerateKeyOptions } from "./types";

/**
 * 生成唯一的文件名
 *
 * @param options - 文件名选项
 * @returns 唯一的文件名
 *
 * @example
 * ```ts
 * const fileName = uniqueName({
 *   prefix: "user-avatar",
 *   extension: "jpg"
 * });
 * // 返回: "user-avatar-1234567890-abc123.jpg"
 *
 * const fileName = uniqueName({
 *   originalName: "photo.png",
 *   prefix: "processed"
 * });
 * // 返回: "processed-1234567890-abc123.png"
 * ```
 */
export function uniqueName(options?: GenerateFileNameOptions): string {
  const { prefix = "file", extension, originalName } = options || {};

  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 9);

  let ext = extension;
  if (!ext && originalName) {
    const match = originalName.match(/\.([^.]+)$/);
    ext = match ? match[1] : "bin";
  }
  ext = ext || "bin";

  return `${prefix}-${timestamp}-${randomId}.${ext}`;
}

/**
 * 生成 R2 存储键（完整路径）
 *
 * @param options - 路径选项
 * @returns R2 存储键
 *
 * @example
 * ```ts
 * const key = buildKey({
 *   folder: "user-uploads",
 *   fileName: "photo.jpg",
 *   userId: "user123"
 * });
 * // 返回: "user-uploads/user123/photo.jpg"
 *
 * const key = buildKey({
 *   folder: "processed",
 *   prefix: "upscaled",
 *   extension: "png"
 * });
 * // 返回: "processed/upscaled-1234567890-abc123.png"
 * ```
 */
export function buildKey(options: GenerateKeyOptions): string {
  const { folder, fileName, userId, prefix, extension, originalName } = options;

  const parts: string[] = [folder];

  if (userId) {
    parts.push(userId);
  }

  const finalFileName =
    fileName || uniqueName({ prefix, extension, originalName });

  parts.push(finalFileName);

  return parts.join("/");
}

/**
 * 根据文件扩展名获取 MIME 类型
 *
 * @param extension - 文件扩展名（不含点号）
 * @returns MIME 类型字符串
 */
export function getMimeType(extension?: string): string {
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    avif: "image/avif",
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    pdf: "application/pdf",
    json: "application/json",
    txt: "text/plain",
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    ts: "application/typescript",
    zip: "application/zip",
    tar: "application/x-tar",
    gz: "application/gzip",
  };

  return mimeTypes[extension?.toLowerCase() || ""] || "application/octet-stream";
}

/**
 * 从 storage key 构建完整的 R2 URL
 *
 * @param storageKey - R2 存储键
 * @param publicUrlPrefix - R2 公共 URL 前缀
 * @returns 完整的 R2 URL
 *
 * @example
 * ```ts
 * const url = buildUrl('images/photo.jpg', 'https://pub-xxx.r2.dev');
 * // 返回: 'https://pub-xxx.r2.dev/images/photo.jpg'
 * ```
 */
export function buildUrl(
  storageKey: string | null | undefined,
  publicUrlPrefix: string
): string {
  if (!storageKey) {
    return "";
  }

  if (storageKey.startsWith("http://") || storageKey.startsWith("https://")) {
    try {
      const url = new URL(storageKey);
      const key = url.pathname.substring(1);
      return `${publicUrlPrefix}/${key}`;
    } catch {
      return storageKey;
    }
  }

  const cleanKey = storageKey.startsWith("/")
    ? storageKey.substring(1)
    : storageKey;

  return `${publicUrlPrefix}/${cleanKey}`;
}

/**
 * 从完整 URL 提取 storage key
 *
 * @param url - 完整的 R2 URL
 * @param publicUrlPrefix - R2 公共 URL 前缀
 * @returns storage key
 *
 * @example
 * ```ts
 * const key = extractKey('https://pub-xxx.r2.dev/images/photo.jpg', 'https://pub-xxx.r2.dev');
 * // 返回: 'images/photo.jpg'
 * ```
 */
export function extractKey(
  url: string | null | undefined,
  publicUrlPrefix?: string
): string | null {
  if (!url) {
    return null;
  }

  if (!(url.startsWith("http://") || url.startsWith("https://"))) {
    return url;
  }

  if (publicUrlPrefix && url.startsWith(publicUrlPrefix)) {
    return url.substring(publicUrlPrefix.length + 1);
  }

  try {
    const urlObj = new URL(url);
    return urlObj.pathname.substring(1);
  } catch {
    return url;
  }
}

/**
 * 生成年月路径
 *
 * @returns 格式如 "202501"
 */
export function yearMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}${month}`;
}
