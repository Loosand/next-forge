import { Button } from "@repo/design-system/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/design-system/components/ui/tooltip";
import type { Meta, StoryObj } from "@storybook/react";
import { Plus } from "lucide-react";

/**
 * A popup that displays information related to an element when the element
 * receives keyboard focus or the mouse hovers over it.
 * Built on Base UI Tooltip component.
 *
 * ## API Reference
 *
 * ### Tooltip.Root Props
 * - `disabled`: boolean - 禁用 tooltip
 * - `hoverable`: boolean - 是否允许鼠标悬停在 tooltip 内容上而不关闭
 * - `delay`: number - 打开 tooltip 的延迟时间（毫秒）
 * - `closeDelay`: number - 关闭 tooltip 的延迟时间（毫秒）
 *
 * ### Tooltip.Trigger Props
 * - `render`: ReactElement | ((props) => ReactElement) - 自定义渲染元素
 * - `payload`: any - 传递给 tooltip 的载荷数据
 * - `className`: string | ((state) => string) - CSS 类名或状态函数
 *
 * ### Tooltip.Popup Props (TooltipContent)
 * - `side`: 'top' | 'bottom' | 'left' | 'right' - tooltip 显示位置
 * - `align`: 'start' | 'center' | 'end' - tooltip 对齐方式
 * - `sideOffset`: number - 与触发元素的距离
 * - `alignOffset`: number - 对齐方向的偏移量
 * - `children`: ReactNode | ((payload) => ReactNode) - tooltip 内容
 * - `className`: string | ((state) => string) - CSS 类名或状态函数
 *
 * ### Tooltip.Positioner Props
 * - `strategy`: 'absolute' | 'fixed' - CSS position 策略
 * - `trackCursor`: boolean | 'x' | 'y' - 是否跟随光标移动
 *
 * @see https://base-ui.com/react/components/tooltip
 */
const meta: Meta<typeof TooltipContent> = {
  title: "ui/Tooltip",
  component: TooltipContent,
  tags: ["autodocs"],
  argTypes: {
    side: {
      options: ["top", "bottom", "left", "right"],
      control: {
        type: "radio",
      },
      description: "Tooltip 显示位置",
      table: {
        defaultValue: { summary: "top" },
      },
    },
    align: {
      options: ["start", "center", "end"],
      control: {
        type: "radio",
      },
      description: "Tooltip 对齐方式",
      table: {
        defaultValue: { summary: "center" },
      },
    },
    sideOffset: {
      control: {
        type: "number",
      },
      description: "与触发元素的距离（像素）",
      table: {
        defaultValue: { summary: "4" },
      },
    },
    children: {
      control: "text",
      description: "Tooltip 内容",
    },
  },
  args: {
    side: "top",
    children: "Add to library",
  },
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <button type="button" className="rounded-md p-2 hover:bg-muted">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add</span>
            </button>
          }
        />
        <TooltipContent {...args} />
      </Tooltip>
    </TooltipProvider>
  ),
} satisfies Meta<typeof TooltipContent>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the tooltip.
 */
export const Default: Story = {};

/**
 * Use the `bottom` side to display the tooltip below the element.
 */
export const Bottom: Story = {
  args: {
    side: "bottom",
  },
};

/**
 * Use the `left` side to display the tooltip to the left of the element.
 */
export const Left: Story = {
  args: {
    side: "left",
  },
};

/**
 * Use the `right` side to display the tooltip to the right of the element.
 */
export const Right: Story = {
  args: {
    side: "right",
  },
};

/**
 * 使用 Button 组件作为触发器，通过 render prop 实现。
 */
export const WithButton: Story = {
  render: (args) => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
      <TooltipContent {...args}>
        <p>This is a tooltip with a Button trigger</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * 延迟打开的 tooltip（500ms 延迟）。
 */
export const WithDelay: Story = {
  render: (args) => (
    <Tooltip delay={500}>
      <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
      <TooltipContent {...args}>
        <p>This tooltip appears after 500ms delay</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * 可悬停的 tooltip 内容（允许鼠标移到 tooltip 上）。
 */
export const Hoverable: Story = {
  render: (args) => (
    <Tooltip hoverable>
      <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
      <TooltipContent {...args}>
        <p>You can hover over this tooltip without it closing</p>
        <a href="#" className="text-primary underline">
          Click me
        </a>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * 不同对齐方式的示例。
 */
export const AlignStart: Story = {
  args: {
    side: "bottom",
    align: "start",
    children: "Aligned to start",
  },
};

export const AlignEnd: Story = {
  args: {
    side: "bottom",
    align: "end",
    children: "Aligned to end",
  },
};
