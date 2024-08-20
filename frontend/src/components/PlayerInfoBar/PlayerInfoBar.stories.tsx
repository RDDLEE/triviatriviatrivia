import type { Meta, StoryObj } from "@storybook/react";
import { Client_AnswerJudgmentResults, Client_PlayerAnswerState, Client_PlayerStats, Client_PlayerVanity, MatchStateStages } from "trivia-shared";
import PlayerInfoBar from "./PlayerInfoBar";

const meta = {
  title: "Trivia/PlayerInfoBar",
  component: PlayerInfoBar,
  decorators: [
    (Story) => {
      return (
        <div style={{ width: "300px" }}>
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof PlayerInfoBar>;

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
  },
};

export const AnswerSelected: Story = {
  args: {
    matchStage: MatchStateStages.SHOWING_QUESTION,
    playerVanities: [{ playerID: "0", displayName: "Player-0" }, { playerID: "1", displayName: "Player-1" }, { playerID: "2", displayName: "Player-2" }] satisfies Client_PlayerVanity[],
    playersStats: [
      { playerID: "0", score: 0, lossStreak: 2, winStreak: 0, numCorrect: 1, numIncorrect: 2, numNoAnswer: 0 },
      { playerID: "1", score: -500, lossStreak: 0, winStreak: 1, numCorrect: 2, numIncorrect: 2, numNoAnswer: 1 },
      { playerID: "2", score: 1500, lossStreak: 0, winStreak: 2, numCorrect: 2, numIncorrect: 2, numNoAnswer: 1 },
    ] satisfies Client_PlayerStats[],
    playerAnswerStates: [
      { playerID: "0", canAnswer: false, didSelectAnswer: true, answerTime: Date.now(), selectedAnswerID: 0 },
      { playerID: "1", canAnswer: true, didSelectAnswer: false, answerTime: Date.now(), selectedAnswerID: 1 },
      { playerID: "2", canAnswer: false, didSelectAnswer: true, answerTime: Date.now(), selectedAnswerID: 2 },
    ] satisfies Client_PlayerAnswerState[],
  },
};

export const AnswerRevealed: Story = {
  args: {
    matchStage: MatchStateStages.JUDGING_ANSWERS,
    playerVanities: [{ playerID: "0", displayName: "Player-0" }, { playerID: "1", displayName: "Player-1" }, { playerID: "2", displayName: "Player-2" }] satisfies Client_PlayerVanity[],
    playersStats: [
      { playerID: "0", score: 0, lossStreak: 2, winStreak: 0, numCorrect: 1, numIncorrect: 2, numNoAnswer: 0 },
      { playerID: "1", score: -500, lossStreak: 0, winStreak: 1, numCorrect: 2, numIncorrect: 2, numNoAnswer: 1 },
      { playerID: "2", score: 1500, lossStreak: 0, winStreak: 2, numCorrect: 2, numIncorrect: 2, numNoAnswer: 1 },
    ] satisfies Client_PlayerStats[],
    answerJudgments: {
      correctAnswerID: 0,
      judgments: [
        {playerID: "0", wasCorrect: true, didSelectAnswer: true, selectedAnswerID: 0, previousScore: 500, scoreModification: 500},
        {playerID: "1", wasCorrect: false, didSelectAnswer: true, selectedAnswerID: 1, previousScore: 0, scoreModification: 0},
        {playerID: "2", wasCorrect: false, didSelectAnswer: false, selectedAnswerID: 2, previousScore: 1000, scoreModification: 0},
      ]
    } satisfies Client_AnswerJudgmentResults,
  },
};