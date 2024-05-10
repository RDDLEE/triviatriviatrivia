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
      let matchStage = storyContext.args["matchStage"];
      if (matchStage === undefined) {
        matchStage = MatchStateStages.NONE;
      }
      const round = storyContext.args["round"];
      const question = storyContext.args["question"];
      const playerVanities = storyContext.args["playerVanities"];
      const playersStats = storyContext.args["playersStats"];
      const playerAnswerStates = storyContext.args["playerAnswerStates"];
      const answerJudgments = storyContext.args["answerJudgments"];
      const playerJudgments = storyContext.args["playerJudgments"];
      const matchState: MatchStateContextSchema = {
        clientPlayerID: "0",
        matchStage: matchStage,
        round: round ? round : 0,
        question: question ? question : null,
        playerVanities: playerVanities ? playerVanities : [],
        playersStats: playersStats ? playersStats: [],
        playerAnswerStates: playerAnswerStates ? playerAnswerStates : [],
        answerJudgments: answerJudgments ? answerJudgments : null,
        playerJudgments: playerJudgments ? playerJudgments : [],
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
