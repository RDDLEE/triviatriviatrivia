import type { Meta, StoryObj } from '@storybook/react';
import PreparingMatchStart from '../../src/components/PreparingMatchStart/PreparingMatchStart';

const meta = {
  title: 'Trivia/PreparingMatchStart',
  component: PreparingMatchStart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof PreparingMatchStart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};