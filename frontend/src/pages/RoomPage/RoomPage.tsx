import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { produce } from "immer";
import { Box, Card, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  GRUpdatePlayerVanities_Payload, SocketEvents, GCReceivePlayerID_Payload, GCAnswerSubmitted_Payload,
  GCReceiveMatchStage_Payload, MatchStateStages, GCWaitingForMatchStart_Payload, GCPreparingMatch_Payload, GCJudgingAnswers_Payload,
  GCShowingQuestion_Payload, GCJudgingPlayers_Payload,
} from "trivia-shared";
import classes from "./RoomPage.module.css";
import { MatchStateContext } from "../../components/MatchStateProvider/MatchStateProvider";
import MatchStateUtils from "../../lib/MatchStateUtils";
import PlayerInfoBar from "../../components/PlayerInfoBar/PlayerInfoBar";
import GameComponentRouter from "../../components/GameComponentRouter/GameComponentRouter";
import TriviaShell from "../../components/TriviaShell/TriviaShell";
import { RouteComponentProps, useLocation } from "wouter";
import JoinGameForm from "../../components/JoinGameForm/JoinGameForm";
import MatchSettingsModalButton from "../../components/MatchSettingsModalButton/MatchSettingsModalButton";
import MatchSettingsModal from "../../components/MatchSettingsModal/MatchSettingsModal";

// FIXME: Extract.
export const SocketContext = createContext<Socket | null>(null);

// FIXME: Extract.
export interface MatchSettingsModalContextSchema {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const MatchSettingsModalContext = createContext<MatchSettingsModalContextSchema | null>(null);

interface RoomPageProps {
  // NOTE: Props only used to support Storybook.
  // - There probably is a better way to do this.
  isStoryBook?: boolean;
  didJoinGame?: boolean;
}

export default function RoomPage(props: RoomPageProps & RouteComponentProps) {
  const matchStateContext = useContext(MatchStateContext);

  const initDidJoinGame = (): boolean => {
    if (props.didJoinGame === undefined) {
      return false;
    }
    return props.didJoinGame;
  };
  const [didJoinGame, setDidJoinGame] = useState<boolean>(initDidJoinGame());

  const [_, setLocation] = useLocation();

  // NOTE: Could save match settings to localStorage.
  const [isSettingsModalOpened, settingsModalCallbacks] = useDisclosure(false);

  // TODO: Extract socket to useSocket hook.
  const initSocket = (): Socket => {
    const socketURI = window.location.pathname;
    return io(socketURI, { autoConnect: false });
  };
  const socketRef = useRef<Socket>(initSocket());

  useEffect(() => {
    if (props.isStoryBook === true) {
      return;
    }
    const socket = socketRef.current;
    socket.connect();
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onConnect = useCallback((): void => {
    // TODO: Show symbol to denote connection.
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.CONNECT, onConnect);
    return () => {
      socket.off(SocketEvents.CONNECT, onConnect);
    };
  }, [onConnect]);

  const onDisconnect = useCallback((): void => {
    // TODO: Display a disconnect message.
    setLocation("/");
  }, [setLocation]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.DISCONNECT, onDisconnect);
    return () => {
      socket.off(SocketEvents.DISCONNECT, onDisconnect);
    };
  }, [onDisconnect]);

  const onGCStageWaitingForMatchStart = useCallback((payload: GCWaitingForMatchStart_Payload): void => {
    matchStateContext?.setMatchStage(MatchStateStages.WAITING_FOR_MATCH_START);
    matchStateContext?.setMatchStageTimeFrame(payload.matchStageTimeFrame);
  }, [matchStateContext]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.GC_SERVER_STAGE_WAITING_FOR_MATCH_START, onGCStageWaitingForMatchStart);
    return () => {
      socket.off(SocketEvents.GC_SERVER_STAGE_WAITING_FOR_MATCH_START, onGCStageWaitingForMatchStart);
    };
  }, [onGCStageWaitingForMatchStart]);

  const onGCStagePreparingMatch = useCallback((payload: GCPreparingMatch_Payload): void => {
    matchStateContext?.setMatchStage(MatchStateStages.PREPARING_MATCH_START);
    matchStateContext?.setMatchStageTimeFrame(payload.matchStageTimeFrame);
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
    matchStateContext?.setRound(payload.round);
    matchStateContext?.setTotalQuestionCount(payload.totalQuestionCount);
    matchStateContext?.setMatchStageTimeFrame(payload.matchStageTimeFrame);
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
    matchStateContext?.setMatchStageTimeFrame(payload.matchStageTimeFrame);
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
    matchStateContext?.setMatchStageTimeFrame(payload.matchStageTimeFrame);
    matchStateContext?.setPlayerJudgments(payload.playerJudgments);
  }, [matchStateContext]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.GC_SERVER_STAGE_JUDGING_PLAYERS, onGCStageJudgingPlayers);
    return () => {
      socket.off(SocketEvents.GC_SERVER_STAGE_JUDGING_PLAYERS, onGCStageJudgingPlayers);
    };
  }, [onGCStageJudgingPlayers]);

  const onGCReceivePlayerID = useCallback((payload: GCReceivePlayerID_Payload): void => {
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

  const onGCReceiveMatchStage = useCallback((payload: GCReceiveMatchStage_Payload): void => {
    if (!matchStateContext) {
      return;
    }
    const matchState = payload.matchState;
    matchStateContext.setMatchStage(matchState.matchStage);
    matchStateContext.setRound(matchState.round);
    matchStateContext.setQuestion(matchState.question);
    matchStateContext.setPlayerVanities(matchState.playerVanities);
    matchStateContext.setPlayersStats(matchState.playersStats);
    matchStateContext.setPlayerAnswerStates(matchState.playerAnswerStates);
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

  const renderMain = (): JSX.Element => {
    if (!didJoinGame) {
      return (
        <JoinGameForm />
      );
    }
    return (
      <GameComponentRouter />
    );
  };

  const renderMatchSettingsModalButton = (): JSX.Element | null => {
    if (matchStateContext === null) {
      return null;
    }
    if (matchStateContext.matchStage === MatchStateStages.SHOWING_QUESTION || matchStateContext.matchStage === MatchStateStages.JUDGING_ANSWERS || matchStateContext.matchStage === MatchStateStages.JUDING_PLAYERS) {
      return (
        <MatchSettingsModalButton withIcon={true} />
      );
    }
    return null;
  };

  return (
    <SocketContext.Provider value={socketRef.current}>
      <TriviaShell>
        <Flex
          className={classes["core-container"]}
          justify="flex-start"
          align="flex-start"
          gap="md"
        >
          <MatchSettingsModalContext.Provider value={{
            isOpen: isSettingsModalOpened,
            close: settingsModalCallbacks.close,
            open: settingsModalCallbacks.open,
            toggle: settingsModalCallbacks.toggle,
          }}>
            <Box
              className={classes["left-section"]}
            >
              {renderMatchSettingsModalButton()}
              <MatchSettingsModal />
              <PlayerInfoBar />
            </Box>
            <Card
              className={classes["right-section"]}
              radius="md"
              withBorder={true}
              shadow="xl"
            >
              {renderMain()}
            </Card>
          </MatchSettingsModalContext.Provider>
        </Flex>
      </TriviaShell>
    </SocketContext.Provider >
  );
}
