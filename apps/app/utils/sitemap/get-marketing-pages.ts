import fs from "node:fs";
import path from "node:path";

/**
 * 扫描 (marketing) 目录,获取所有静态营销页面
 * 自动排除组件目录、路由组和通过 CMS 动态生成的页面
 */
export const getMarketingPages = (): string[] => {
  const marketingDir = path.join(process.cwd(), "app/[locale]/(marketing)");
  const marketingFolders = fs.readdirSync(marketingDir, {
    withFileTypes: true,
  });

  // 需要排除的文件夹(这些内容通过其他方式生成)
  const excludedFolders = new Set([
    "components", // 组件目录
    "blog", // blog 由 CMS 动态生成
    "legal", // legal 由 CMS 动态生成
  ]);

  return [
    "/", // 首页 (marketing 根目录的 page.tsx)
    ...marketingFolders
      .filter((file) => file.isDirectory()) // 只要文件夹
      .filter((folder) => !folder.name.startsWith("_")) // 排除 _components 等
      .filter((folder) => !folder.name.startsWith("(")) // 排除路由组
      .filter((folder) => !folder.name.startsWith(".")) // 排除隐藏文件夹
      .filter((folder) => !excludedFolders.has(folder.name)) // 排除指定文件夹
      .map((folder) => `/${folder.name}`), // 转换为路由路径
  ];
};
