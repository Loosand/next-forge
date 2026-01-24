# @repo/internationalization

这是一个多语言（国际化）支持包，让你的 Next.js 应用可以轻松支持多种语言。

## 📖 这个包是干什么的？

简单来说，这个包可以让你的网站：
- 自动识别用户浏览器语言（比如用户是中国人，自动显示中文）
- 支持手动切换语言（比如点击按钮切换英文/中文）
- 使用 AI 自动翻译文本（不用手动一个个翻译）
- 保持类型安全（TypeScript 会检查你的翻译 key 是否写错）

## 🌍 目前支持的语言

- 🇬🇧 英文 (en) - 源语言
- 🇨🇳 中文 (zh)
- 🇪🇸 西班牙语 (es)
- 🇩🇪 德语 (de)
- 🇫🇷 法语 (fr)
- 🇵🇹 葡萄牙语 (pt)

## 🚀 如何使用

### 第一步：在你的应用中安装依赖

在你的应用的 `package.json` 中添加：

```json
{
  "dependencies": {
    "@repo/internationalization": "workspace:*"
  }
}
```

然后运行 `pnpm install`。

### 第二步：配置中间件

在你的应用根目录创建 `middleware.ts`：

```typescript
// apps/your-app/middleware.ts
import { internationalizationMiddleware, config } from '@repo/internationalization/proxy';

// 导出中间件（它会自动检测用户语言并重定向）
export const middleware = internationalizationMiddleware;

// 导出配置（定义哪些路径需要多语言）
export { config } from '@repo/internationalization/proxy';
```

### 第三步：调整路由结构

把你的 app 目录改成这样：

```
apps/your-app/app/
├── [locale]/              ← 新增：语言动态路由
│   ├── layout.tsx        ← 从根目录移到这里
│   ├── page.tsx          ← 从根目录移到这里
│   └── about/
│       └── page.tsx
```

### 第四步：在 Layout 中加载翻译

```typescript
// apps/your-app/app/[locale]/layout.tsx
import { getDictionary } from '@repo/internationalization';

export default async function Layout({ children, params }) {
  // 获取当前语言
  const { locale } = await params;

  // 加载对应语言的翻译文件
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale}>
      <body>
        {/* 把翻译传给子组件 */}
        <Header dictionary={dictionary} />
        {children}
      </body>
    </html>
  );
}
```

### 第五步：在组件中使用翻译

```typescript
// apps/your-app/app/[locale]/components/header.tsx
import type { Dictionary } from '@repo/internationalization';

type HeaderProps = {
  dictionary: Dictionary;
};

export function Header({ dictionary }: HeaderProps) {
  return (
    <nav>
      {/* 使用翻译文本 */}
      <a href="/">{dictionary.web.header.home}</a>
      <a href="/about">{dictionary.web.header.about}</a>
    </nav>
  );
}
```

## ✍️ 如何添加新的翻译内容

### 方法一：手动编辑（不推荐）

直接编辑 `dictionaries/en.json`，然后手动翻译到其他语言文件。

```json
// dictionaries/en.json
{
  "web": {
    "header": {
      "home": "Home",
      "about": "About",
      "contact": "Contact"  ← 新增
    }
  }
}
```

然后在 `zh.json`、`es.json` 等文件中也要手动加上对应的翻译。

### 方法二：AI 自动翻译（推荐！）

1. 只需要编辑英文文件：`dictionaries/en.json`
2. 运行命令：`pnpm translate`
3. AI 会自动把英文翻译成其他所有语言！

```bash
# 在 packages/internationalization 目录下运行
pnpm translate

# 或者在项目根目录运行
pnpm --filter @repo/internationalization translate
```

## 🎯 翻译文件的结构

翻译文件是嵌套的 JSON 对象，按功能模块组织：

```json
{
  "web": {                    // 命名空间：web 应用
    "global": {               // 全局通用文本
      "primaryCta": "Book a call",
      "secondaryCta": "Sign up"
    },
    "header": {               // 导航栏
      "home": "Home",
      "blog": "Blog"
    },
    "home": {                 // 首页
      "meta": {
        "title": "Transform Your Business"
      },
      "hero": {
        "announcement": "Read our latest article"
      }
    }
  }
}
```

使用时就像访问普通对象：

```typescript
dictionary.web.global.primaryCta      // "预约电话"
dictionary.web.header.home            // "首页"
dictionary.web.home.meta.title        // "改变您的业务"
```

## 🔧 工作原理

### 1. 自动语言检测

当用户访问你的网站时：

```
用户访问 example.com
    ↓
中间件读取浏览器的 Accept-Language 头
    ↓
检测到用户偏好中文 (zh-CN)
    ↓
自动重定向到 example.com/zh
    ↓
显示中文界面
```

### 2. URL 结构

- 英文（默认语言）：`example.com/` 或 `example.com/about`
- 中文：`example.com/zh/` 或 `example.com/zh/about`
- 西班牙语：`example.com/es/` 或 `example.com/es/about`

### 3. 懒加载优化

翻译文件只在需要时才加载：

```typescript
// 用户访问中文版
const dict = await getDictionary('zh');  // 只加载 zh.json

// 用户访问英文版
const dict = await getDictionary('en');  // 只加载 en.json
```

这样可以减少初始加载时间，节省流量。

### 4. 容错机制

如果出现问题（比如翻译文件损坏、不支持的语言），会自动回退到英文：

```typescript
// 用户请求不支持的语言
const dict = await getDictionary('ja');  // 日语（不支持）
// → 自动返回英文翻译

// 翻译文件加载失败
const dict = await getDictionary('zh');  // 假设 zh.json 损坏
// → 自动返回英文翻译
```

## 📝 配置文件说明

### `languine.json`

这是 Languine AI 翻译工具的配置文件：

```json
{
  "locale": {
    "source": "en",                           // 源语言：英文
    "targets": ["es", "de", "zh", "fr", "pt"] // 目标语言：要翻译成哪些语言
  },
  "files": {
    "json": {
      "include": ["dictionaries/[locale].json"] // 翻译文件的路径模式
    }
  }
}
```

如果你想添加新语言（比如日语），只需要：

1. 在 `targets` 数组中添加 `"ja"`
2. 运行 `pnpm translate`
3. 会自动生成 `dictionaries/ja.json`

## 🎨 最佳实践

### 1. 翻译 key 的命名

使用有意义的名称，按模块组织：

```json
{
  "web": {
    "auth": {                    // 认证相关
      "login": "Log in",
      "logout": "Log out"
    },
    "dashboard": {               // 仪表盘
      "title": "Dashboard",
      "stats": "Statistics"
    }
  }
}
```

### 2. 避免硬编码文本

❌ 不好的做法：

```tsx
<button>Sign up</button>
```

✅ 好的做法：

```tsx
<button>{dictionary.web.global.secondaryCta}</button>
```

### 3. 使用 TypeScript 类型检查

```tsx
// TypeScript 会检查 key 是否存在
dictionary.web.header.home     // ✅ OK
dictionary.web.header.hoem     // ❌ 编译错误：typo
dictionary.web.footer.copyright // ❌ 编译错误：key 不存在
```

### 4. 复数和变量

如果需要动态文本（比如 "You have 5 messages"），可以这样：

```json
{
  "messages": {
    "count": "You have {count} messages"
  }
}
```

然后在组件中替换：

```tsx
const text = dictionary.messages.count.replace('{count}', '5');
// → "You have 5 messages"
```

## 🔍 常见问题

### Q: 为什么默认语言（英文）的 URL 没有 `/en/`？

A: 这是 SEO 优化的最佳实践。搜索引擎更喜欢简短的 URL，而且大部分网站的主要语言不显示前缀。如果你想改成所有语言都显示前缀，可以修改 `proxy.ts` 中的 `urlMappingStrategy`。

### Q: 如何添加语言切换器？

A: 创建一个组件，生成指向其他语言版本的链接：

```tsx
function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' },
    { code: 'es', name: 'Español' },
  ];

  return (
    <div>
      {languages.map(lang => (
        <a
          key={lang.code}
          href={`/${lang.code === 'en' ? '' : lang.code}`}
          className={currentLocale === lang.code ? 'active' : ''}
        >
          {lang.name}
        </a>
      ))}
    </div>
  );
}
```

### Q: 翻译文件很大，会不会影响性能？

A: 不会！因为：
1. 翻译文件只在服务端加载（`server-only`），不会发送到浏览器
2. 使用懒加载，只加载当前语言的翻译
3. Next.js 会自动缓存翻译结果

### Q: AI 翻译准确吗？

A: Languine 使用先进的 AI 模型（如 GPT），翻译质量通常很好，但建议：
1. 重要内容人工校对
2. 专业术语可能需要调整
3. 文化相关的内容建议本地化

### Q: 可以不用 AI，只手动翻译吗？

A: 当然可以！直接编辑 `dictionaries/*.json` 文件就行。`pnpm translate` 命令是可选的。

## 📚 参考资源

- [Next.js 国际化文档](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [next-international 库](https://github.com/QuiiBz/next-international)
- [Languine AI 翻译工具](https://languine.dev)
- [FormatJS 国际化工具集](https://formatjs.io/)

## 🤝 贡献

如果你想添加新语言或改进翻译：

1. 修改 `languine.json`，在 `targets` 中添加语言代码
2. 运行 `pnpm translate` 生成翻译
3. （可选）人工校对翻译质量
4. 提交 PR

---

**提示**：这个包设计用于 Next.js 15+ 的 App Router。如果你用的是 Pages Router，需要使用不同的方案。
