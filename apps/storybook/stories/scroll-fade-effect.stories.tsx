/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import { ScrollFadeEffect } from "@repo/design-system/components/scroll-fade-effect";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * A scroll container with fade effects at the edges to indicate scrollable content.
 */
const meta = {
  title: "ui/ScrollFadeEffect",
  component: ScrollFadeEffect,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
    },
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ScrollFadeEffect>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default vertical scroll fade effect.
 */
export const Vertical: Story = {
  args: {
    orientation: "vertical",
    className: "h-64 w-80 rounded-md border",
    children: (
      <div className="p-4">
        <h3 className="mb-4 font-semibold text-lg">
          Vertical Scrolling Content
        </h3>
        <p className="mb-4">
          This is a demonstration of the vertical scroll fade effect. As you
          scroll through this content, you'll notice a subtle fade at the top
          and bottom edges.
        </p>
        <p className="mb-4">
          Jokester began sneaking into the castle in the middle of the night and
          leaving jokes all over the place: under the king's pillow, in his
          soup, even in the royal toilet. The king was furious, but he couldn't
          seem to stop Jokester.
        </p>
        <p className="mb-4">
          And then, one day, the people of the kingdom discovered that the jokes
          left by Jokester were so funny that they couldn't help but laugh. And
          once they started laughing, they couldn't stop.
        </p>
        <p className="mb-4">
          The king was so angry that he banished Jokester from the kingdom, but
          the people still laughed, and they laughed, and they laughed. And they
          all lived happily ever after.
        </p>
        <p>
          More content to ensure scrolling is necessary for the fade effect to
          be visible.
        </p>
      </div>
    ),
  },
};

/**
 * Horizontal scroll fade effect.
 */
export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
    className: "w-96 rounded-md border",
    children: (
      <div className="flex gap-4 p-4" style={{ width: "800px" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            className="flex h-32 w-32 shrink-0 items-center justify-center rounded-md bg-muted"
            key={i}
          >
            Item {i + 1}
          </div>
        ))}
      </div>
    ),
  },
};

/**
 * Vertical scroll with custom styling.
 */
export const CustomStyling: Story = {
  args: {
    orientation: "vertical",
    className:
      "h-96 w-full max-w-2xl rounded-lg border-2 border-primary bg-background",
    children: (
      <div className="p-6">
        <h2 className="mb-4 font-bold text-2xl">Custom Styled Container</h2>
        <p className="mb-4">
          This example shows how you can apply custom styling to the
          ScrollFadeEffect component while maintaining the fade effect
          functionality.
        </p>
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="mb-4 rounded-md bg-muted p-4" key={i}>
            <h4 className="font-semibold">Section {i + 1}</h4>
            <p className="text-muted-foreground text-sm">
              This is some content in section {i + 1}. The fade effect will
              appear as you scroll.
            </p>
          </div>
        ))}
      </div>
    ),
  },
};
