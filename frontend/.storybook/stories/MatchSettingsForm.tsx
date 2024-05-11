import type { Meta, StoryObj } from '@storybook/react';
import MatchSettingsForm from '../../src/components/MatchSettingsForm/MatchSettingsForm';
import { MATCH_SETTINGS_POINTS_ON_CORRECT_DEFAULT, MATCH_SETTINGS_POINTS_ON_INCORRECT_DEFAULT, MATCH_SETTINGS_POINTS_ON_NO_ANSWER_DEFAULT } from 'trivia-shared';

const meta = {
  title: 'Trivia/MatchSettingsForm',
  component: MatchSettingsForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof MatchSettingsForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pointsOnCorrect: MATCH_SETTINGS_POINTS_ON_CORRECT_DEFAULT,
    pointsOnIncorrect: MATCH_SETTINGS_POINTS_ON_INCORRECT_DEFAULT,
    pointsOnNoAnswer: MATCH_SETTINGS_POINTS_ON_NO_ANSWER_DEFAULT,
    setPointsOnCorrect: () => { },
    setPointsOnIncorrect: () => { },
    setPointsOnNoAnswer: () => { },
  },
};