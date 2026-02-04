import "server-only";
import type en from "./dictionaries/en.json";
import languine from "./languine.json" with { type: "json" };

// 导出所有支持的语言列表，从 languine.json 配置文件里读取
export const locales = [languine.locale.source, ...languine.locale.targets];

export type Dictionary = typeof en;

export type Locales = typeof locales;

const dictionaries: Record<string, () => Promise<Dictionary>> =
  Object.fromEntries(
    locales.map((locale) => [
      locale,
      () =>
        // 动态导入对应语言的翻译文件
        import(`./dictionaries/${locale}.json`)
          .then((mod) => mod.default)
          // 如果加载失败（比如文件不存在），就用英文兜底
          .catch((_err) =>
            import("./dictionaries/en.json").then((mod) => mod.default)
          ),
    ])
  );

/**
 * 根据语言代码获取对应的翻译字典
 * @param locale 语言代码，比如 'zh'、'en-US'、'zh-CN' 等
 * @returns 返回翻译字典对象
 *
 * 例子：
 *   const dict = await getDictionary('zh');
 *   console.log(dict.web.header.home); // "首页"
 */
export const getDictionary = async (locale: string): Promise<Dictionary> => {
  // 标准化语言代码：把 'zh-CN' 简化成 'zh'，把 'en-US' 简化成 'en'
  const normalizedLocale = locale.split("-")[0];

  // 如果不支持这个语言，就直接返回英文
  if (!locales.includes(normalizedLocale)) {
    return dictionaries.en();
  }

  try {
    // 尝试加载对应语言的翻译文件
    return await dictionaries[normalizedLocale]();
  } catch (_error) {
    // 出错了就用英文兜底
    return dictionaries.en();
  }
};
