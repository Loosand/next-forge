import { Checkbox } from "@repo/design-system/components/ui/checkbox";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * A control that allows the user to toggle between checked and not checked.
 * Built on Base UI Checkbox component.
 *
 * ## API Reference
 *
 * ### Checkbox.Root Props
 * - `checked`: boolean - 受控模式下的选中状态
 * - `defaultChecked`: boolean - 非受控模式下的初始选中状态
 * - `onCheckedChange`: (checked: boolean) => void - 状态变化回调
 * - `indeterminate`: boolean - 不确定状态（既非选中也非未选中）
 * - `disabled`: boolean - 禁用复选框
 * - `readOnly`: boolean - 只读模式（用户无法改变状态）
 * - `required`: boolean - 表单提交前必须选中
 * - `name`: string - 表单字段名称
 * - `value`: string - 表单提交的值
 * - `id`: string - input 元素的 id
 * - `parent`: boolean - 是否控制一组子复选框（用于 Checkbox Group）
 * - `inputRef`: React.Ref<HTMLInputElement> - 访问隐藏的 input 元素
 * - `className`: string | ((state) => string) - CSS 类名或状态函数
 * - `render`: ReactElement | ((props) => ReactElement) - 自定义渲染元素
 *
 * ### Checkbox.Indicator Props
 * - `keepMounted`: boolean - 未选中时是否保持在 DOM 中
 * - `className`: string | ((state) => string) - CSS 类名或状态函数
 * - `render`: ReactElement | ((props) => ReactElement) - 自定义渲染元素
 *
 * @see https://base-ui.com/react/components/checkbox
 */
const meta: Meta<typeof Checkbox> = {
  title: "ui/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: { type: "boolean" },
      description: "受控模式下的选中状态",
      table: {
        type: { summary: "boolean" },
      },
    },
    defaultChecked: {
      control: { type: "boolean" },
      description: "非受控模式下的初始选中状态",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    indeterminate: {
      control: { type: "boolean" },
      description: "不确定状态（既非选中也非未选中）",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    disabled: {
      control: { type: "boolean" },
      description: "禁用复选框",
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
      description: "表单提交前必须选中",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
  args: {
    id: "terms",
    disabled: false,
  },
  render: (args) => (
    <div className="flex space-x-2">
      <Checkbox {...args} />
      <label
        className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        htmlFor={args.id}
      >
        Accept terms and conditions
      </label>
    </div>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the checkbox.
 */
export const Default: Story = {};

/**
 * Use the `disabled` prop to disable the checkbox.
 */
export const Disabled: Story = {
  args: {
    id: "disabled-terms",
    disabled: true,
  },
};

/**
 * 不确定状态，用于表示部分选中（例如在树形结构中）。
 */
export const Indeterminate: Story = {
  args: {
    id: "indeterminate-terms",
    indeterminate: true,
  },
};

/**
 * 默认选中状态（非受控模式）。
 */
export const DefaultChecked: Story = {
  args: {
    id: "default-checked-terms",
    defaultChecked: true,
  },
};

/**
 * 只读模式，用户无法改变状态但可以看到当前值。
 */
export const ReadOnly: Story = {
  args: {
    id: "readonly-terms",
    readOnly: true,
    defaultChecked: true,
  },
};

/**
 * 必填字段，用于表单验证。
 */
export const Required: Story = {
  args: {
    id: "required-terms",
    required: true,
  },
};
