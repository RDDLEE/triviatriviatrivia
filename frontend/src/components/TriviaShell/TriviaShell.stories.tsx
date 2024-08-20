import type { Meta, StoryObj } from "@storybook/react";
import TriviaShell from "./TriviaShell";

const meta = {
  title: "Trivia/TriviaShell",
  component: TriviaShell,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof TriviaShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <React.Fragment>I am Main.</React.Fragment>,
  },
};
