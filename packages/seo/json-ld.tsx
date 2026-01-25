/**
 * JSON-LD (JavaScript Object Notation for Linked Data) 组件
 *
 * 用于在网页中嵌入结构化数据，帮助搜索引擎理解页面内容，提升 SEO。
 * 常见用途：
 * - 网站信息 (Organization)
 * - 面包屑导航 (BreadcrumbList)
 * - 文章/博客 (Article)
 * - 产品信息 (Product)
 * - FAQ 数据
 *
 * 示例：
 * <JsonLd code={{
 *   "@context": "https://schema.org",
 *   "@type": "Organization",
 *   name: "Acme Inc",
 *   url: "https://example.com"
 * }} />
 */
/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: "This is a JSON-LD script with properly escaped content." */
import type { Thing, WithContext } from "schema-dts";

type JsonLdProps = {
  // Schema.org 结构化数据对象
  code: WithContext<Thing>;
};

/**
 * 转义 JSON 字符串中的特殊字符，防止 XSS 攻击
 * 将 HTML 特殊字符和 Unicode 行分隔符转换为安全的转义序列
 */
const escapeJsonForHtml = (json: string): string =>
  json
    .replace(/</g, "\\u003c")    // 转义 < 防止闭合 script 标签
    .replace(/>/g, "\\u003e")    // 转义 > 防止闭合 script 标签
    .replace(/&/g, "\\u0026")    // 转义 & 防止 HTML 实体注入
    .replace(/\u2028/g, "\\u2028")  // 转义行分隔符
    .replace(/\u2029/g, "\\u2029"); // 转义段落分隔符

/**
 * 渲染 JSON-LD script 标签
 * 将结构化数据转换为搜索引擎可识别的 JSON-LD 格式
 */
export const JsonLd = ({ code }: JsonLdProps) => (
  <script
    dangerouslySetInnerHTML={{
      __html: escapeJsonForHtml(JSON.stringify(code)),
    }}
    type="application/ld+json"
  />
);

// 导出 schema-dts 的所有类型定义，方便使用
export * from "schema-dts";
