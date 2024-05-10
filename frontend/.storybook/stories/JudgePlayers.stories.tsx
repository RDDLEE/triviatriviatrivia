import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Client_PlayerJudgment, Client_PlayerStats, Client_PlayerVanity } from 'trivia-shared';
import JudgePlayers from '../../src/components/JudgePlayers/JudgePlayers';

const meta = {
  title: 'Trivia/JudgePlayers',
  component: JudgePlayers,
  decorators: [
    (Story) => {
      return (
        <div style={{ width: "700px" }}>
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof JudgePlayers>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    playerVanities: [{ playerID: "0", displayName: "Player-0" }, { playerID: "1", displayName: "Player-1" }, { playerID: "2", displayName: "Player-2" }] satisfies Client_PlayerVanity[],
    playersStats: [
      { playerID: "0", score: 0, lossStreak: 2, winStreak: 0, numCorrect: 1, numIncorrect: 2, numNoAnswer: 0 },
      { playerID: "1", score: -500, lossStreak: 0, winStreak: 1, numCorrect: 2, numIncorrect: 2, numNoAnswer: 1 },
      { playerID: "2", score: 1500, lossStreak: 0, winStreak: 2, numCorrect: 2, numIncorrect: 2, numNoAnswer: 1 },
    ] satisfies Client_PlayerStats[],
    playerJudgments: [
      { playerID: "0", rank: 1, finalPlayerStats: { playerID: "0", score: 1500, lossStreak: 2, winStreak: 0, numCorrect: 1, numIncorrect: 2, numNoAnswer: 0 } }, 
      { playerID: "2", rank: 2, finalPlayerStats: { playerID: "2", score: 500, lossStreak: 2, winStreak: 0, numCorrect: 1, numIncorrect: 2, numNoAnswer: 0 } },
      { playerID: "1", rank: 3, finalPlayerStats: { playerID: "1", score: 0, lossStreak: 2, winStreak: 0, numCorrect: 1, numIncorrect: 2, numNoAnswer: 0 } }, 
    ] satisfies Client_PlayerJudgment[],
  },
};

