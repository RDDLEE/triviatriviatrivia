import type { Meta, StoryObj } from "@storybook/react";
import { ANSWER_ID_NONE } from "trivia-shared";
import AnswerBadge from "./AnswerBadge";

const meta = {
  title: "Trivia/AnswerBadge",
  component: AnswerBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof AnswerBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unrevealed: Story = {
  args: {
    isRevealed: false,
  },
};

export const RevealedNone: Story = {
  args: {
    isRevealed: true,
    selectedAnswerID: ANSWER_ID_NONE,
  },
};

export const Revealed0: Story = {
  args: {
    isRevealed: true,
    selectedAnswerID: 0,
  },
};

export const Revealed1: Story = {
  args: {
    isRevealed: true,
    selectedAnswerID: 1,
  },
};

export const Revealed2: Story = {
  args: {
    isRevealed: true,
    selectedAnswerID: 2,
  },
};

export const Revealed3: Story = {
  args: {
    isRevealed: true,
    selectedAnswerID: 3,
  },
};

export const Revealed4: Story = {
  args: {
    isRevealed: true,
    selectedAnswerID: 4,
  },
};
