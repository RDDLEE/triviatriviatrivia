import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ANSWER_ID_NONE, ANSWER_STATE_ANSWER_TIME_NONE, Client_AnswerJudgmentResults, Client_PlayerAnswerState, Client_StandardQuestion } from 'trivia-shared';
import QuestionContainer from '../../src/components/QuestionContainer/QuestionContainer';


const meta = {
  title: 'Trivia/QuestionContainer',
  component: QuestionContainer,
  decorators: [
    (Story) => {
      return (
        <div style={{ width: "500px" }}>
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
} satisfies Meta<typeof QuestionContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

const question: Client_StandardQuestion | null = {
  prompt: "I am a question.",
  choices: [
    { answerID: 0, text: "I am Answer 0." },
    { answerID: 1, text: "I am Answer 1." },
    { answerID: 2, text: "I am Answer 2." },
    { answerID: 3, text: "I am Answer 3." }
  ],
};

export const Default: Story = {
  args: {
    question: question,
    playerAnswerStates: [{ playerID: "0", canAnswer: true, didSelectAnswer: false, answerTime: ANSWER_STATE_ANSWER_TIME_NONE, selectedAnswerID: ANSWER_ID_NONE }] satisfies Client_PlayerAnswerState[],
    answerJudgments: null satisfies Client_AnswerJudgmentResults | null,
  },
};

export const Selected: Story = {
  args: {
    question: question,
    playerAnswerStates: [{ playerID: "0", canAnswer: false, didSelectAnswer: true, answerTime: Date.now(), selectedAnswerID: 0 }] satisfies Client_PlayerAnswerState[],
  },
};

export const CorrectSelected: Story = {
  args: {
    question: question,
    playerAnswerStates: [{ playerID: "0", canAnswer: false, didSelectAnswer: true, answerTime: Date.now(), selectedAnswerID: 0 }] satisfies Client_PlayerAnswerState[],
    answerJudgments: { correctAnswerID: 0, judgments: [{ playerID: "0", didSelectAnswer: true, previousScore: 500, scoreModification: 500, wasCorrect: true, selectedAnswerID: 0 }] } satisfies Client_AnswerJudgmentResults | null,
  },
};

export const CorrectOther: Story = {
  args: {
    question: question,
    playerAnswerStates: [{ playerID: "0", canAnswer: false, didSelectAnswer: true, answerTime: Date.now(), selectedAnswerID: 0 }] satisfies Client_PlayerAnswerState[],
    answerJudgments: { correctAnswerID: 1, judgments: [{ playerID: "0", didSelectAnswer: true, previousScore: 500, scoreModification: 500, wasCorrect: true, selectedAnswerID: 0 }] } satisfies Client_AnswerJudgmentResults | null,
  },
};