import type { Meta, StoryObj } from "@storybook/react";
import { ANSWER_ID_NONE, ANSWER_STATE_ANSWER_TIME_NONE, Client_AnswerJudgmentResults, Client_PlayerAnswerState } from "trivia-shared";
import AnswerChoice from "./AnswerChoice";

const meta = {
  title: "Trivia/AnswerChoice",
  component: AnswerChoice,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof AnswerChoice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    answerChoice: { answerID: 0, text: "I am answer 0." },
    onClick_AnswerChoice: () => { },
    // @ts-expect-error MatchState override.
    playerAnswerStates: [{ playerID: "0", canAnswer: true, didSelectAnswer: false, answerTime: ANSWER_STATE_ANSWER_TIME_NONE, selectedAnswerID: ANSWER_ID_NONE }] satisfies Client_PlayerAnswerState[],
    answerJudgments: null satisfies Client_AnswerJudgmentResults | null,
  },
};

export const Selected: Story = {
  args: {
    answerChoice: { answerID: 0, text: "I am answer 0." },
    onClick_AnswerChoice: () => { },
    // @ts-expect-error MatchState override.
    playerAnswerStates: [{ playerID: "0", canAnswer: false, didSelectAnswer: true, answerTime: Date.now(), selectedAnswerID: 0 }] satisfies Client_PlayerAnswerState[],
  },
};

export const Correct: Story = {
  args: {
    answerChoice: { answerID: 0, text: "I am answer 0." },
    onClick_AnswerChoice: () => { },
    // @ts-expect-error MatchState override.
    playerAnswerStates: [{ playerID: "0", canAnswer: false, didSelectAnswer: true, answerTime: Date.now(), selectedAnswerID: 0 }] satisfies Client_PlayerAnswerState[],
    answerJudgments: { correctAnswerID: 0, judgments: [{ playerID: "0", didSelectAnswer: true, previousScore: 500, scoreModification: 500, wasCorrect: true, selectedAnswerID: 0 }] } satisfies Client_AnswerJudgmentResults | null,
  },
};
