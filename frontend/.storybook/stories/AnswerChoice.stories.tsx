import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import AnswerChoice from '../../src/components/AnswerChoice/AnswerChoice';

const meta = {
  title: 'Trivia/AnswerChoice',
  component: AnswerChoice,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof AnswerChoice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    answerChoice: { answerID: 0, text: "I am answer 0." }
  },
};
