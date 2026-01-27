import type { S3Client } from "@aws-sdk/client-s3";

/**
 * R2 客户端配置选项
 */
export type R2ClientConfig = {
  /** Cloudflare 账户 ID */
  accountId?: string;
  /** 访问密钥 ID */
  accessKeyId: string;
  /** 秘密访问密钥 */
  secretAccessKey: string;
  /** R2 端点 URL（可选，默认自动构建） */
  endpoint?: string;
};

/**
 * 上传选项
 */
export type UploadOptions = {
  /** R2 存储键（文件路径） */
  key: string;
  /** 文件内容 */
  body: Buffer | Uint8Array | string;
  /** 内容类型 */
  contentType?: string;
  /** 存储桶名称（默认使用环境变量） */
  bucket?: string;
  /** S3 客户端（默认自动创建） */
  client?: S3Client;
  /** R2 公共 URL 前缀（默认使用环境变量） */
  publicUrlPrefix?: string;
  /** 上传超时时间（毫秒），默认 60 秒 */
  timeout?: number;
};

/**
 * 上传结果
 */
export type UploadResult = {
  /** 文件的公共访问 URL */
  url: string;
  /** R2 存储键 */
  key: string;
  /** 存储桶名称 */
  bucket: string;
};

/**
 * 下载选项
 */
export type DownloadOptions = {
  /** R2 存储键 */
  key: string;
  /** 存储桶名称（默认使用环境变量） */
  bucket?: string;
  /** S3 客户端（默认自动创建） */
  client?: S3Client;
};

/**
 * 删除选项
 */
export type DeleteOptions = {
  /** R2 存储键 */
  key: string;
  /** 存储桶名称（默认使用环境变量） */
  bucket?: string;
  /** S3 客户端（默认自动创建） */
  client?: S3Client;
};

/**
 * 复制/移动选项
 */
export type CopyMoveOptions = {
  /** 源文件的 R2 存储键 */
  sourceKey: string;
  /** 目标文件的 R2 存储键 */
  destinationKey: string;
  /** 存储桶名称（默认使用环境变量） */
  bucket?: string;
  /** S3 客户端（默认自动创建） */
  client?: S3Client;
};

/**
 * 批量上传选项
 */
export type BatchUploadOptions = {
  /** 要上传的文件数组 */
  files: Array<{
    key: string;
    body: Buffer | Uint8Array | string;
    contentType?: string;
  }>;
  /** 存储桶名称（默认使用环境变量） */
  bucket?: string;
  /** S3 客户端（默认自动创建） */
  client?: S3Client;
  /** R2 公共 URL 前缀（默认使用环境变量） */
  publicUrlPrefix?: string;
  /** 是否并行上传（默认 true） */
  parallel?: boolean;
};

/**
 * 从 URL 下载并上传的选项
 */
export type FetchAndUploadOptions = {
  /** 源文件 URL */
  sourceUrl: string;
  /** 目标 R2 存储键 */
  destinationKey: string;
  /** 内容类型（可选，会从响应头自动检测） */
  contentType?: string;
  /** 存储桶名称（默认使用环境变量） */
  bucket?: string;
  /** S3 客户端（默认自动创建） */
  client?: S3Client;
  /** R2 公共 URL 前缀（默认使用环境变量） */
  publicUrlPrefix?: string;
};

/**
 * 从 URL 下载并上传的结果
 */
export interface FetchAndUploadResult extends UploadResult {
  /** 下载的文件大小（字节） */
  size: number;
  /** 检测到的内容类型 */
  detectedContentType: string;
}

/**
 * 生成存储键的选项
 */
export type GenerateKeyOptions = {
  /** 文件夹路径 */
  folder: string;
  /** 文件名（如果不提供，将生成唯一文件名） */
  fileName?: string;
  /** 用户 ID（可选，用于组织文件） */
  userId?: string;
  /** 文件名前缀（用于生成唯一文件名） */
  prefix?: string;
  /** 文件扩展名（用于生成唯一文件名） */
  extension?: string;
  /** 原始文件名（用于提取扩展名） */
  originalName?: string;
};

/**
 * 生成唯一文件名的选项
 */
export type GenerateFileNameOptions = {
  /** 文件名前缀 */
  prefix?: string;
  /** 文件扩展名（不包含点号） */
  extension?: string;
  /** 原始文件名（将从中提取扩展名） */
  originalName?: string;
};
