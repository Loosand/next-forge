import { SparkleButton } from "@repo/design-system/components/ui/sparkle-button";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * SparkleButton 是品牌特色的 CTA 按钮，带有星光图标和径向渐变效果。
 * 基于 Button 组件封装，适用于重要的行动号召场景。
 *
 * ## 特性
 * - 星光（Sparkle）图标，可放置在文字前后
 * - 径向渐变背景效果
 * - 内阴影产生 3D 立体感
 * - 平滑的悬停/点击过渡动画
 *
 * ## API Reference
 *
 * ### Props
 * - `iconPosition`: 'start' | 'end' - 图标位置，默认 'end'
 * - `hideIcon`: boolean - 隐藏星光图标
 * - `disabled`: boolean - 禁用按钮
 * - `className`: string - 自定义样式类
 * - 继承所有标准 button 元素属性
 */
const meta = {
  title: "ui/SparkleButton",
  component: SparkleButton,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "按钮内容",
    },
    iconPosition: {
      control: { type: "radio" },
      options: ["start", "end"],
      description: "星光图标位置",
      table: {
        defaultValue: { summary: "end" },
      },
    },
    hideIcon: {
      control: { type: "boolean" },
      description: "隐藏星光图标",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    disabled: {
      control: { type: "boolean" },
      description: "禁用按钮",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Explore all tools",
    iconPosition: "end",
    hideIcon: false,
  },
} satisfies Meta<typeof SparkleButton>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 默认样式，星光图标在右侧。适用于大多数 CTA 场景。
 */
export const Default: Story = {};

/**
 * 图标在左侧的变体，适用于强调"开始"类动作。
 */
export const IconStart: Story = {
  args: {
    children: "Get Started",
    iconPosition: "start",
  },
};

/**
 * 无图标变体，适用于不需要装饰的简洁场景。
 */
export const NoIcon: Story = {
  args: {
    children: "Continue",
    hideIcon: true,
  },
};

/**
 * 禁用状态，按钮不可交互。
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/**
 * 长文本场景，展示按钮如何处理较长内容。
 */
export const LongText: Story = {
  args: {
    children: "Discover Amazing AI-Powered Features",
  },
};

/**
 * 作为链接使用，结合 asChild 和 anchor 元素。
 */
export const AsLink: Story = {
  render: (args) => (
    // biome-ignore lint/a11y/useAnchorContent: <>
    // biome-ignore lint/a11y/useValidAnchor: <>
    <SparkleButton {...args} render={<a href="#" />}>
      Learn More
    </SparkleButton>
  ),
};

/**
 * 多个按钮并排展示，对比不同状态。
 */
export const ButtonGroup: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <SparkleButton iconPosition="start">Get Started</SparkleButton>
      <SparkleButton>Explore</SparkleButton>
      <SparkleButton disabled>Coming Soon</SparkleButton>
    </div>
  ),
};
