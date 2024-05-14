import type { Meta, StoryObj } from '@storybook/react';
import { ANSWER_ID_NONE, Client_AnswerJudgmentResults, Client_PlayerAnswerState, Client_PlayerJudgment, Client_PlayerStats, Client_PlayerVanity, Client_StandardQuestion, MatchStageTimeFrame, MatchStateStages } from 'trivia-shared';
import RoomPage from '../../src/pages/RoomPage/RoomPage';

const meta = {
  title: 'Trivia/RoomPage',
  component: RoomPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof RoomPage>;

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

const SHOWING_QUESTION_COUNTDOWN_TIME = 10000;
const SHOWING_ANSWER_COUNTDOWN_TIME = 5000;
const JUDGING_PLAYERS_COUNTDOWN_TIME = 180000;

export const NotYetJoined: Story = {
  args: {
    params: {},
    isStoryBook: true,
    didJoinGame: false,
  },
};

export const WaitingForMatchStart: Story = {
  args: {
    params: {},
    isStoryBook: true,
    didJoinGame: true,
    // @ts-expect-error
    matchStage: MatchStateStages.WAITING_FOR_MATCH_START,
    playerVanities: [{ playerID: "0", displayName: "Player-0" }, { playerID: "1", displayName: "Player-1" }, { playerID: "2", displayName: "Player-2" }] satisfies Client_PlayerVanity[],
  },
};

export const PreparingMatchStart: Story = {
  args: {
    params: {},
    isStoryBook: true,
    didJoinGame: true,
    // @ts-expect-error
    matchStage: MatchStateStages.PREPARING_MATCH_START,
    playerVanities: [{ playerID: "0", displayName: "Player-0" }, { playerID: "1", displayName: "Player-1" }, { playerID: "2", displayName: "Player-2" }] satisfies Client_PlayerVanity[],
  },
};

export const ShowingQuestion: Story = {
  args: {
    params: {},
    isStoryBook: true,
    didJoinGame: true,
    // @ts-expect-error
    matchStage: MatchStateStages.SHOWING_QUESTION,
    matchStageTimeFrame: { terminationTime: Date.now() + SHOWING_QUESTION_COUNTDOWN_TIME, countdownTime: SHOWING_QUESTION_COUNTDOWN_TIME } satisfies MatchStageTimeFrame,
    playerVanities: [{ playerID: "0", displayName: "Player-0" }, { playerID: "1", displayName: "Player-1" }, { playerID: "2", displayName: "Player-2" }] satisfies Client_PlayerVanity[],
    question: question,
    playerAnswerStates: [{ playerID: "0", canAnswer: true, didSelectAnswer: false, answerTime: Date.now(), selectedAnswerID: ANSWER_ID_NONE }] satisfies Client_PlayerAnswerState[],
    answerJudgments: null satisfies Client_AnswerJudgmentResults | null,
  },
};

export const ShowingQuestionSelected: Story = {
  args: {
    params: {},
    isStoryBook: true,
    didJoinGame: true,
    // @ts-expect-error
    matchStage: MatchStateStages.SHOWING_QUESTION,
    round: 1,
    totalQuestionCount: 10,
    matchStageTimeFrame: { terminationTime: Date.now() + SHOWING_QUESTION_COUNTDOWN_TIME, countdownTime: SHOWING_QUESTION_COUNTDOWN_TIME } satisfies MatchStageTimeFrame,
    playerVanities: [{ playerID: "0", displayName: "Player-0" }, { playerID: "1", displayName: "Player-1" }, { playerID: "2", displayName: "Player-2" }] satisfies Client_PlayerVanity[],
    question: question,
    playerAnswerStates: [{ playerID: "0", canAnswer: false, didSelectAnswer: true, answerTime: Date.now(), selectedAnswerID: 1 }] satisfies Client_PlayerAnswerState[],
    answerJudgments: null satisfies Client_AnswerJudgmentResults | null,
  },
};

export const JudgingAnswers: Story = {
  args: {
    params: {},
    isStoryBook: true,
    didJoinGame: true,
    // @ts-expect-error
    matchStage: MatchStateStages.JUDGING_ANSWERS,
    round: 1,
    totalQuestionCount: 10,
    matchStageTimeFrame: { terminationTime: Date.now() + SHOWING_ANSWER_COUNTDOWN_TIME, countdownTime: SHOWING_ANSWER_COUNTDOWN_TIME } satisfies MatchStageTimeFrame,
    playerVanities: [{ playerID: "0", displayName: "Player-0" }, { playerID: "1", displayName: "Player-1" }, { playerID: "2", displayName: "Player-2" }] satisfies Client_PlayerVanity[],
    question: question,
    playerAnswerStates: [{ playerID: "0", canAnswer: false, didSelectAnswer: true, answerTime: Date.now(), selectedAnswerID: 0 }] satisfies Client_PlayerAnswerState[],
    answerJudgments: { correctAnswerID: 1, judgments: [
      { playerID: "0", didSelectAnswer: true, previousScore: 500, scoreModification: 500, wasCorrect: false, selectedAnswerID: 0 },
      { playerID: "1", didSelectAnswer: true, previousScore: 500, scoreModification: 500, wasCorrect: true, selectedAnswerID: 1 },
      { playerID: "2", didSelectAnswer: false, previousScore: 500, scoreModification: 500, wasCorrect: false, selectedAnswerID: ANSWER_ID_NONE },
    ] } satisfies Client_AnswerJudgmentResults | null,
  },
};

export const JudgingPlayers: Story = {
  args: {
    params: {},
    isStoryBook: true,
    didJoinGame: true,
    // @ts-expect-error
    matchStage: MatchStateStages.JUDING_PLAYERS,
    matchStageTimeFrame: { terminationTime: Date.now() + JUDGING_PLAYERS_COUNTDOWN_TIME, countdownTime: JUDGING_PLAYERS_COUNTDOWN_TIME } satisfies MatchStageTimeFrame,
    playerVanities: [{ playerID: "0", displayName: "Player-0" }, { playerID: "1", displayName: "Player-1" }, { playerID: "2", displayName: "Player-2" }, { playerID: "3", displayName: "Player-3" }] satisfies Client_PlayerVanity[],
    playersStats: [
      { playerID: "0", score: 0, lossStreak: 2, winStreak: 0, numCorrect: 1, numIncorrect: 2, numNoAnswer: 0 },
      { playerID: "1", score: -500, lossStreak: 0, winStreak: 1, numCorrect: 2, numIncorrect: 2, numNoAnswer: 1 },
      { playerID: "2", score: 1500, lossStreak: 0, winStreak: 2, numCorrect: 2, numIncorrect: 2, numNoAnswer: 1 },
    ] satisfies Client_PlayerStats[],
    playerJudgments: [
      { playerID: "0", rank: 1, finalPlayerStats: { playerID: "0", score: 1500, lossStreak: 2, winStreak: 0, numCorrect: 1, numIncorrect: 2, numNoAnswer: 0 } },
      { playerID: "2", rank: 2, finalPlayerStats: { playerID: "2", score: 500, lossStreak: 2, winStreak: 0, numCorrect: 1, numIncorrect: 2, numNoAnswer: 0 } },
      { playerID: "1", rank: 3, finalPlayerStats: { playerID: "1", score: 0, lossStreak: 2, winStreak: 0, numCorrect: 1, numIncorrect: 2, numNoAnswer: 0 } },
      { playerID: "3", rank: 4, finalPlayerStats: { playerID: "3", score: -1000, lossStreak: 2, winStreak: 0, numCorrect: 1, numIncorrect: 2, numNoAnswer: 0 } },
    ] satisfies Client_PlayerJudgment[],
  },
};