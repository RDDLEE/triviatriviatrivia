import React from "react";
import type { Preview } from "@storybook/react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { io } from "socket.io-client";
import { MatchStateStages } from "trivia-shared";
import "./../src/App.css";
import { MatchStateContext, MatchStateContextSchema } from "./../src/components/MatchStateProvider/MatchStateProvider";
import { SocketContext } from "./../src/pages/RoomPage/RoomPage";


const preview: Preview = {
  decorators: [
    (Story, storyContext) => {
      const matchStage = storyContext.args["matchStage"];
      const round = storyContext.args["round"];
      const question = storyContext.args["question"];
      const playerAnswerStates = storyContext.args["playerAnswerSates"];
      const matchState: MatchStateContextSchema = {
        clientPlayerID: "0",
        matchStage: matchStage ? matchStage : MatchStateStages.PREPARING_MATCH_START,
        round: round ? round : 0,
        question: question ? question : {
          prompt: "I am a question",
          choices: [{ answerID: 0, text: "I am answer 0." }, { answerID: 1, text: "I am answer 1." }, { answerID: 2, text: "I am answer 2." }, { answerID: 3, text: "I am answer 3." }],
        },
        playerVanities: [{playerID: "0", displayName: "Player0"}],
        playersStats: [{playerID: "0", score: 500, lossStreak: 2, winStreak: 0, numCorrect: 1, numIncorrect: 2, numNoAnswer: 3}],
        playerAnswerStates: playerAnswerStates ? playerAnswerStates : [{playerID: "0", answerTime: 123, canAnswer: false, didSelectAnswer: true, selectedAnswerID: 0}],
        answerJudgments: {
          correctAnswerID: 0,
          judgments: [{playerID: "0", didSelectAnswer: true, previousScore: 1000, scoreModification: 500, wasCorrect: true}],
        },
        playerJudgments: [{playerID: "0", rank: 1, finalPlayerStats: {playerID: "0", score: 500, lossStreak: 2, winStreak: 0, numCorrect: 1, numIncorrect: 2, numNoAnswer: 3}}],
        setClientPlayerID: () => {},
        setMatchStage: () => {},
        setRound: () => {},
        setQuestion: () => {},
        setPlayerVanities: () => {},
        setPlayersStats: () => {},
        setPlayerAnswerStates: () => {},
        setAnswerJudgments: () => {},
        setPlayerJudgments: () => {},
      }
      return (
        <MantineProvider defaultColorScheme="dark">
          <MatchStateContext.Provider value={matchState}>
            <SocketContext.Provider value={io({ autoConnect: false })}>
              <Story />
            </SocketContext.Provider>
          </MatchStateContext.Provider>
        </MantineProvider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
