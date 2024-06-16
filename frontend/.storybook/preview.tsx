import React from "react";
import type { Preview } from "@storybook/react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { io } from "socket.io-client";
import { MATCH_STAGE_COUNTDOWN_TIME_INDEFINITE, MATCH_STAGE_TERMINATION_TIME_INDEFINITE, MatchStateStages } from "trivia-shared";
import "./../src/App.css";
import { MatchStateContext, MatchStateContextSchema } from "./../src/components/MatchStateProvider/MatchStateProvider";
import { SocketContext } from "./../src/components/SocketContext/SocketContext";
import theme from "./../src/theme/theme";
import { StorybookContext, StorybookContextSchema } from "../src/components/StorybookContext/StorybookContext";


const preview: Preview = {
  decorators: [
    (Story, storyContext) => {
      let matchStage = storyContext.args["matchStage"];
      if (matchStage === undefined) {
        matchStage = MatchStateStages.NONE;
      }
      const matchStageTimeFrame = storyContext.args["matchStageTimeFrame"];
      const round = storyContext.args["round"];
      const totalQuestionCount = storyContext.args["totalQuestionCount"];
      const question = storyContext.args["question"];
      const playerVanities = storyContext.args["playerVanities"];
      const playersStats = storyContext.args["playersStats"];
      const playerAnswerStates = storyContext.args["playerAnswerStates"];
      const answerJudgments = storyContext.args["answerJudgments"];
      const playerJudgments = storyContext.args["playerJudgments"];
      const matchState: MatchStateContextSchema = {
        clientPlayerID: "0",
        matchStage: matchStage,
        matchStageTimeFrame: matchStageTimeFrame ? matchStageTimeFrame : { terminationTime: MATCH_STAGE_TERMINATION_TIME_INDEFINITE, countdownTime: MATCH_STAGE_COUNTDOWN_TIME_INDEFINITE },
        round: round ? round : 0,
        totalQuestionCount: totalQuestionCount ? totalQuestionCount : 0,
        question: question ? question : null,
        playerVanities: playerVanities ? playerVanities : [],
        playersStats: playersStats ? playersStats : [],
        playerAnswerStates: playerAnswerStates ? playerAnswerStates : [],
        answerJudgments: answerJudgments ? answerJudgments : null,
        playerJudgments: playerJudgments ? playerJudgments : [],
        setClientPlayerID: () => { },
        setMatchStage: () => { },
        setMatchStageTimeFrame: () => { },
        setRound: () => { },
        setTotalQuestionCount: () => { },
        setQuestion: () => { },
        setPlayerVanities: () => { },
        setPlayersStats: () => { },
        setPlayerAnswerStates: () => { },
        setAnswerJudgments: () => { },
        setPlayerJudgments: () => { },
      }
      const didJoinGame = storyContext.args["didJoinGame"];
      const storybookState: StorybookContextSchema = {
        didJoinGame: didJoinGame
      }
      return (
        <MantineProvider defaultColorScheme="dark" theme={theme}>
          <MatchStateContext.Provider value={matchState}>
            <SocketContext.Provider value={io({ autoConnect: false })}>
              <StorybookContext.Provider value={storybookState}>
                <Story />
              </StorybookContext.Provider>
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
