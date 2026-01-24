import { Button } from "@repo/design-system/components/ui/button";
import type { Meta, StoryObj } from "@storybook/react";
import { Loader2, Mail } from "lucide-react";

/**
 * Buttons allow users to perform actions with a single click or tap.
 * Built on Base UI Button component.
 *
 * ## API Reference
 *
 * ### Button Props (Base UI)
 * - `disabled`: boolean - 禁用按钮
 * - `focusableWhenDisabled`: boolean - 禁用时是否仍可获得焦点（适用于加载状态）
 * - `className`: string | ((state) => string) - CSS 类名或状态函数
 * - `render`: ReactElement | ((props) => ReactElement) - 自定义渲染元素
 * - 继承所有标准 button 元素属性（type, onClick, onFocus 等）
 *
 * ### Custom Props (Design System)
 * - `variant`: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link' - 按钮样式变体
 * - `size`: 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg' - 按钮尺寸
 *
 * @see https://base-ui.com/react/components/button
 */
const meta = {
  title: "ui/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "按钮内容",
    },
    variant: {
      control: { type: "select" },
      options: [
        "default",
        "outline",
        "secondary",
        "ghost",
        "destructive",
        "link",
      ],
      description: "按钮样式变体",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    size: {
      control: { type: "select" },
      options: [
        "default",
        "xs",
        "sm",
        "lg",
        "icon",
        "icon-xs",
        "icon-sm",
        "icon-lg",
      ],
      description: "按钮尺寸",
      table: {
        defaultValue: { summary: "default" },
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
    focusableWhenDisabled: {
      control: { type: "boolean" },
      description: "禁用时是否仍可获得焦点（用于加载状态保持焦点）",
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
    variant: "default",
    size: "default",
    children: "Button",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the button, used for primary actions and commands.
 */
export const Default: Story = {};

/**
 * Use the `outline` button to reduce emphasis on secondary actions, such as
 * canceling or dismissing a dialog.
 */
export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

/**
 * Use the `ghost` button is minimalistic and subtle, for less intrusive
 * actions.
 */
export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};

/**
 * Use the `secondary` button to call for less emphasized actions, styled to
 * complement the primary button while being less conspicuous.
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

/**
 * Use the `destructive` button to indicate errors, alerts, or the need for
 * immediate attention.
 */
export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
};

/**
 * Use the `link` button to reduce emphasis on tertiary actions, such as
 * hyperlink or navigation, providing a text-only interactive element.
 */
export const Link: Story = {
  args: {
    variant: "link",
  },
};

/**
 * 加载状态的按钮，使用 `focusableWhenDisabled` 保持焦点。
 * 这对于点击后进入加载状态的按钮很有用，防止焦点丢失。
 */
export const Loading: Story = {
  render: (args) => (
    <Button {...args}>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </Button>
  ),
  args: {
    ...Outline.args,
    disabled: true,
    focusableWhenDisabled: true,
  },
};

/**
 * Add an icon element to a button to enhance visual communication and
 * providing additional context for the action.
 */
export const WithIcon: Story = {
  render: (args) => (
    <Button {...args}>
      <Mail className="mr-2 h-4 w-4" /> Login with Email Button
    </Button>
  ),
  args: {
    ...Secondary.args,
  },
};

/**
 * Use the `sm` size for a smaller button, suitable for interfaces needing
 * compact elements without sacrificing usability.
 */
export const Small: Story = {
  args: {
    size: "sm",
  },
};

/**
 * Use the `lg` size for a larger button, offering better visibility and
 * easier interaction for users.
 */
export const Large: Story = {
  args: {
    size: "lg",
  },
};

/**
 * Use the "icon" size for a button with only an icon.
 */
export const Icon: Story = {
  args: {
    ...Secondary.args,
    size: "icon",
    children: <Mail />,
  },
};

/**
 * Add the `disabled` prop to prevent interactions with the button.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
