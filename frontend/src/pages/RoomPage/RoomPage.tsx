import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { produce } from "immer";
import { Button, Card, Flex } from "@mantine/core";
import {
  GRUpdatePlayerVanities_Payload, SocketEvents, GRJoinGame_Payload, Server_PlayerVanity, GCReceivePlayerID_Payload, GCAnswerSubmitted_Payload,
  GCReceiveMatchStage_Payload, MatchStateStages, GCWaitingForMatchStart_Payload, GCPreparingMatch_Payload, GCJudgingAnswers_Payload,
  GCShowingQuestion_Payload, GCJudgingPlayers_Payload,
} from "trivia-shared";
import { MatchStateContext } from "../../components/MatchStateProvider/MatchStateProvider";
import MatchStateUtils from "../../lib/MatchStateUtils";
import PlayerInfoBar from "../../components/PlayerInfoBar/PlayerInfoBar";
import GameComponentRouter from "../../components/GameComponentRouter/GameComponentRouter";
import TriviaShell from "../../components/TriviaShell/TriviaShell";
import { useLocation } from "wouter";

// FIXME: Extract.
export const SocketContext = createContext<Socket | null>(null);

interface RoomPageProps {
  // NOTE: Props only used to support Storybook.
  // - There probably is a better way to do this.
  isStoryBook?: boolean;
  didJoinGame?: boolean;
}

export default function RoomPage(props: RoomPageProps) {
  const matchStateContext = useContext(MatchStateContext);

  const [didJoinGame, setDidJoinGame] = useState<boolean>(props.didJoinGame ? props.didJoinGame : false);

  const [_, setLocation] = useLocation();

  // TODO: Extract socket to useSocket hook.
  const initSocket = (): Socket => {
    const socketURI = import.meta.env.VITE_BASE_SERVER_URL + window.location.pathname;
    return io(socketURI, { autoConnect: false });
  };
  const socketRef = useRef<Socket>(initSocket());

  useEffect(() => {
    if (props.isStoryBook) {
      return;
    }
    const socket = socketRef.current;
    socket.connect();
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onConnection = useCallback((): void => {
    console.log("RoomPage.onConnection called.");
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.CONNECTION, onConnection);
    return () => {
      socket.off(SocketEvents.CONNECTION, onConnection);
    };
  }, [onConnection]);

  const onDisconnect = useCallback((): void => {
    // TODO: Display a disconnect message.
    setLocation("/");
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.DISCONNECT, onDisconnect);
    return () => {
      socket.off(SocketEvents.DISCONNECT, onDisconnect);
    };
  }, [onDisconnect]);

  const onGCStageWaitingForMatchStart = useCallback((_payload: GCWaitingForMatchStart_Payload): void => {
    matchStateContext?.setMatchStage(MatchStateStages.WAITING_FOR_MATCH_START);
  }, [matchStateContext]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.GC_SERVER_STAGE_WAITING_FOR_MATCH_START, onGCStageWaitingForMatchStart);
    return () => {
      socket.off(SocketEvents.GC_SERVER_STAGE_WAITING_FOR_MATCH_START, onGCStageWaitingForMatchStart);
    };
  }, [onGCStageWaitingForMatchStart]);

  const onGCStagePreparingMatch = useCallback((_payload: GCPreparingMatch_Payload): void => {
    matchStateContext?.setMatchStage(MatchStateStages.PREPARING_MATCH_START);
  }, [matchStateContext]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.GC_SERVER_STAGE_PREPARING_MATCH, onGCStagePreparingMatch);
    return () => {
      socket.off(SocketEvents.GC_SERVER_STAGE_PREPARING_MATCH, onGCStagePreparingMatch);
    };
  }, [onGCStagePreparingMatch]);

  const onGCStageShowingQuestion = useCallback((payload: GCShowingQuestion_Payload): void => {
    matchStateContext?.setMatchStage(MatchStateStages.SHOWING_QUESTION);
    matchStateContext?.setQuestion(payload.question);
    matchStateContext?.setPlayerAnswerStates(payload.playerAnswerStates);
    matchStateContext?.setAnswerJudgments(null);
  }, [matchStateContext]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.GC_SERVER_STAGE_SHOWING_QUESTION, onGCStageShowingQuestion);
    return () => {
      socket.off(SocketEvents.GC_SERVER_STAGE_SHOWING_QUESTION, onGCStageShowingQuestion);
    };
  }, [onGCStageShowingQuestion]);

  const onGCStageJudingAnswers = useCallback((payload: GCJudgingAnswers_Payload): void => {
    matchStateContext?.setMatchStage(MatchStateStages.JUDGING_ANSWERS);
    matchStateContext?.setPlayerAnswerStates(payload.playerAnswerStates);
    matchStateContext?.setPlayersStats(payload.playersStats);
    matchStateContext?.setAnswerJudgments(payload.judgmentResults);
  }, [matchStateContext]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.GC_SERVER_STAGE_JUDGING_ANSWERS, onGCStageJudingAnswers);
    return () => {
      socket.off(SocketEvents.GC_SERVER_STAGE_JUDGING_ANSWERS, onGCStageJudingAnswers);
    };
  }, [onGCStageJudingAnswers]);

  const onGCStageJudgingPlayers = useCallback((payload: GCJudgingPlayers_Payload): void => {
    matchStateContext?.setMatchStage(MatchStateStages.JUDING_PLAYERS);
    matchStateContext?.setPlayerJudgments(payload.playerJudgments);
  }, [matchStateContext]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.GC_SERVER_STAGE_JUDGING_PLAYERS, onGCStageJudgingPlayers);
    return () => {
      socket.off(SocketEvents.GC_SERVER_STAGE_JUDGING_PLAYERS, onGCStageJudgingPlayers);
    };
  }, [onGCStageJudgingPlayers]);

  const onGCReceivePlayerID = useCallback((payload: GCReceivePlayerID_Payload) => {
    setDidJoinGame(true);
    matchStateContext?.setClientPlayerID(payload.playerID);
  }, [matchStateContext]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.GC_SERVER_RECEIVE_PLAYER_ID, onGCReceivePlayerID);
    return () => {
      socket.off(SocketEvents.GC_SERVER_RECEIVE_PLAYER_ID, onGCReceivePlayerID);
    };
  }, [onGCReceivePlayerID]);

  const onGCReceiveMatchStage = useCallback((payload: GCReceiveMatchStage_Payload) => {
    const matchState = payload.matchState;
    matchStateContext?.setMatchStage(matchState.matchStage);
    matchStateContext?.setRound(matchState.round);
    matchStateContext?.setQuestion(matchState.question);
    matchStateContext?.setPlayerVanities(matchState.playerVanities);
    matchStateContext?.setPlayersStats(matchState.playersStats);
    matchStateContext?.setPlayerAnswerStates(matchState.playerAnswerStates);
  }, [matchStateContext]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.GC_SERVER_RECEIVE_MATCH_STATE, onGCReceiveMatchStage);
    return () => {
      socket.off(SocketEvents.GC_SERVER_RECEIVE_MATCH_STATE, onGCReceiveMatchStage);
    };
  }, [onGCReceiveMatchStage]);

  const onGRUpdatePlayerVanities = useCallback((payload: GRUpdatePlayerVanities_Payload): void => {
    matchStateContext?.setPlayerVanities(payload.playerVanities);
  }, [matchStateContext]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.GR_SERVER_UPDATE_PLAYER_VANITIES, onGRUpdatePlayerVanities);
    return () => {
      socket.off(SocketEvents.GR_SERVER_UPDATE_PLAYER_VANITIES, onGRUpdatePlayerVanities);
    };
  }, [onGRUpdatePlayerVanities]);

  const onAnswerSubmitted = useCallback((payload: GCAnswerSubmitted_Payload): void => {
    if (!matchStateContext) {
      return;
    }
    const playerID = payload.answerState.playerID;
    const index = MatchStateUtils.getIndexOfAnswerStateByPlayerID(matchStateContext, playerID);
    if (index < 0) {
      return;
    }
    matchStateContext.setPlayerAnswerStates(
      produce(matchStateContext.playerAnswerStates, (draft): void => {
        draft.splice(index, 1, { ...payload.answerState });
      })
    );
  }, [matchStateContext]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.GC_SERVER_ANSWER_SUBMITTED, onAnswerSubmitted);
    return () => {
      socket.off(SocketEvents.GC_SERVER_ANSWER_SUBMITTED, onAnswerSubmitted);
    };
  }, [onAnswerSubmitted]);

  const onClick_JoinGameButton = useCallback((): void => {
    // TODO: After joining, need server to send the player's PlayerID.
    const playerVanity: Server_PlayerVanity = {
      // TODO: Save and load from localStorage and read from prompt.
      displayName: "PlaceholderName",
    };
    socketRef.current.emit(
      SocketEvents.GR_CLIENT_JOIN_GAME,
      {
        playerVanity: playerVanity,
      } satisfies GRJoinGame_Payload
    );
  }, []);

  const renderMain = (): JSX.Element => {
    if (!didJoinGame) {
      // TODO: Join game modal.
      return (
        <Button variant="filled" size="xs" onClick={onClick_JoinGameButton}>
          Join Game
        </Button>
      );
    }
    return (
      <GameComponentRouter />
    );
  };

  // FIXME: Extract AppShell to component.
  return (
    <SocketContext.Provider value={socketRef.current}>
      <TriviaShell>
        <Flex
          justify="flex-start"
          align="flex-start"
          direction="row"
          gap="md"
          // FIXME: Extract to class.
          wrap="nowrap"
        >
          <Card
            radius="md"
            withBorder={true}
            shadow="xl"
            /** FIXME: Extract to class.*/
            w="30%"
            ml="5em"
          >
            <PlayerInfoBar />
          </Card>
          <Card
            radius="md"
            withBorder={true}
            shadow="xl"
            /** FIXME: Extract to class.*/
            w="70%"
            mr="5em"
          >
            {renderMain()}
          </Card>
        </Flex>
      </TriviaShell>
    </SocketContext.Provider>
  );
}
