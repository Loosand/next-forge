---
name: ui-skills
description: 用于与智能体构建更好界面的固定约束规则。
---

# UI 技能

当被调用时，应用这些固定的约束规则来构建更好的界面。

如果使用文件路径参数调用(例如：`/ui-skills src/components/Button.tsx`):

1. 读取指定的文件
2. 根据下面的所有约束规则进行审查
3. 针对违规内容提供具体的、可操作的反馈
4. 建议具体的改进方案

如果不带参数调用:

- 将这些约束规则应用于本次对话中的任何 UI 工作
- 在编写或审查界面代码时记住这些规则

## 技术栈

- 必须在使用自定义值之前优先使用 Tailwind CSS 默认值(间距、圆角、阴影)
- 当需要 JavaScript 动画时,必须使用 `motion/react`(以前称为 `framer-motion`)
- 应该在 Tailwind CSS 中使用 `tw-animate-css` 来实现入场和微动画
- 必须使用 `cn` 工具(`clsx` + `tailwind-merge`)来处理类名逻辑

## 组件

- 对于任何涉及键盘或焦点行为的内容,必须使用无障碍组件原语(`Base UI`、`React Aria`)
- 必须优先使用项目现有的组件原语
- 绝不在同一交互界面中混用不同的原语系统
- 如果与技术栈兼容,应该优先选择 [`Base UI`](https://base-ui.com/react/components) 作为新的原语
- 必须为纯图标按钮添加 `aria-label`
- 除非明确要求,否则绝不手动重建键盘或焦点行为

## 交互

- 对于破坏性或不可逆操作,必须使用 `AlertDialog`
- 应该为加载状态使用结构化骨架屏
- 对于纯图标内容或工具属性内容，试用 `ToolTip` 组件包裹并进行描述
- 绝不使用 `h-screen`,应使用 `h-dvh`
- 对于固定元素,必须遵守 `safe-area-inset`
- 必须在操作发生的位置旁边显示错误信息
- 绝不阻止在 `input` 或 `textarea` 元素中粘贴

## 动画

- 除非明确要求,否则绝不添加动画
- 必须仅对合成器属性(`transform`、`opacity`)进行动画
- 绝不对布局属性(`width`、`height`、`top`、`left`、`margin`、`padding`)进行动画
- 应该避免对绘制属性(`background`、`color`)进行动画,除非是小型局部 UI(文本、图标)
- 入场动画应该使用 `ease-out`
- 交互反馈绝不超过 `200ms`
- 必须在屏幕外时暂停循环动画
- 必须遵守 `prefers-reduced-motion`
- 除非明确要求,否则绝不引入自定义缓动曲线
- 应该避免对大图像或全屏界面进行动画

## 排版

- 必须对标题使用 `text-balance`,对正文/段落使用 `text-pretty`
- 必须对数据使用 `tabular-nums`
- 应该在密集 UI 中使用 `truncate` 或 `line-clamp`
- 除非明确要求,否则绝不修改 `letter-spacing`(`tracking-`)

## 布局

- 必须使用固定的 `z-index` 刻度(不使用任意的 `z-*`)
- 应该对正方形元素使用 `size-*`,而不是 `w-*` + `h-*`

## 性能

- 绝不对大型 `blur()` 或 `backdrop-filter` 界面进行动画
- 绝不在活动动画之外应用 `will-change`
- 对于任何可以表达为渲染逻辑的内容,绝不使用 `useEffect`

## 设计

- 除非明确要求,否则绝不使用渐变
- 绝不使用紫色或多色渐变
- 绝不将发光效果作为主要视觉提示
- 除非明确要求,否则应该使用 Tailwind CSS 默认阴影刻度
- 必须为空状态提供一个明确的下一步操作
- 应该将每个视图的强调色使用限制为一种
- 应该在引入新颜色之前优先使用现有主题或 Tailwind CSS 颜色标记
