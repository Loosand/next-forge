import { Switch } from "@repo/design-system/components/ui/switch";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * A control that allows the user to toggle between checked and not checked.
 * Built on Base UI Switch component.
 *
 * ## API Reference
 *
 * ### Switch.Root Props
 * - `checked`: boolean - 受控模式下的激活状态
 * - `defaultChecked`: boolean - 非受控模式下的初始激活状态
 * - `onCheckedChange`: (checked: boolean) => void - 状态变化回调
 * - `disabled`: boolean - 禁用开关
 * - `readOnly`: boolean - 只读模式（用户无法改变状态）
 * - `required`: boolean - 表单提交前必须激活
 * - `name`: string - 表单字段名称
 * - `uncheckedValue`: string - 关闭时提交的表单值
 * - `id`: string - 开关元素的 id
 * - `inputRef`: React.Ref<HTMLInputElement> - 访问隐藏的 input 元素
 * - `className`: string | ((state) => string) - CSS 类名或状态函数
 * - `render`: ReactElement | ((props) => ReactElement) - 自定义渲染元素
 *
 * ### Switch.Thumb Props
 * - `isButton`: boolean - 通过 render prop 替换时是否渲染原生 button 元素
 * - `className`: string | ((state) => string) - CSS 类名或状态函数
 * - `render`: ReactElement | ((props) => ReactElement) - 自定义渲染元素
 *
 * ### Custom Props (Design System)
 * - `size`: 'sm' | 'default' - 开关尺寸
 *
 * ### Data Attributes (用于样式)
 * - `[data-checked]`: 选中状态
 * - `[data-unchecked]`: 未选中状态
 * - `[data-disabled]`: 禁用状态
 * - `[data-readonly]`: 只读状态
 * - `[data-required]`: 必填状态
 *
 * @see https://base-ui.com/react/components/switch
 */
const meta = {
  title: "ui/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "default"],
      description: "开关尺寸",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    checked: {
      control: { type: "boolean" },
      description: "受控模式下的激活状态",
      table: {
        type: { summary: "boolean" },
      },
    },
    defaultChecked: {
      control: { type: "boolean" },
      description: "非受控模式下的初始激活状态",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    disabled: {
      control: { type: "boolean" },
      description: "禁用开关",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    readOnly: {
      control: { type: "boolean" },
      description: "只读模式（用户无法改变状态）",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    required: {
      control: { type: "boolean" },
      description: "表单提交前必须激活",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch {...args} />
      <label className="peer-disabled:text-foreground/50" htmlFor={args.id}>
        Airplane Mode
      </label>
    </div>
  ),
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the switch.
 */
export const Default: Story = {
  args: {
    id: "default-switch",
  },
};

/**
 * Use the `disabled` prop to disable the switch.
 */
export const Disabled: Story = {
  args: {
    id: "disabled-switch",
    disabled: true,
  },
};

/**
 * 小尺寸开关。
 */
export const Small: Story = {
  args: {
    id: "small-switch",
    size: "sm",
  },
};

/**
 * 默认激活状态（非受控模式）。
 */
export const DefaultChecked: Story = {
  args: {
    id: "default-checked-switch",
    defaultChecked: true,
  },
};

/**
 * 只读模式，用户无法改变状态但可以看到当前值。
 */
export const ReadOnly: Story = {
  args: {
    id: "readonly-switch",
    readOnly: true,
    defaultChecked: true,
  },
};

/**
 * 必填字段，用于表单验证。
 */
export const Required: Story = {
  args: {
    id: "required-switch",
    required: true,
  },
};
