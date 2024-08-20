import type { Meta, StoryObj } from "@storybook/react";
import WaitingForMatchStart from "./WaitingForMatchStart";

const meta = {
  title: "Trivia/WaitingForMatchStart",
  component: WaitingForMatchStart,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof WaitingForMatchStart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};