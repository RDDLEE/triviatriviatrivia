import { useCallback, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import APIUtils from "../lib/APIUtils";
import { useLocation } from "wouter";
import RouteUtils from "../lib/RouteUtils";
import { StorybookContext } from "./StorybookContext/StorybookContext";
import { GCAnswerSubmitted_Payload, GCJudgingAnswers_Payload, GCJudgingPlayers_Payload, GCPreparingMatch_Payload, GCReceiveMatchStage_Payload, GCReceivePlayerID_Payload, GCShowingQuestion_Payload, GCWaitingForMatchStart_Payload, GRUpdatePlayerVanities_Payload, MatchStateStages, SocketEvents } from "trivia-shared";
import { MatchStateContext } from "./MatchStateProvider/MatchStateProvider";
import { produce } from "immer";
import MatchStateUtils from "../lib/MatchStateUtils";

export interface useGameRoomSocket_Params {
  // RoomID namespace derived from window.location.pathname.
  // Includes the "/" prefix.
  roomID: string;
}

export interface useGameRoomSocket_Return {
  socket: React.RefObject<Socket>;
}

const useGameRoomSocket = (params: useGameRoomSocket_Params): useGameRoomSocket_Return => {
  const matchStateContext = useContext(MatchStateContext);
  const storybookContext = useContext(StorybookContext);

  const [_, setLocation] = useLocation();

  const didInitSocket = useRef<boolean>(false);

  const initSocket = (): Socket | null => {
    if (didInitSocket.current) {
      return null;
    }
    didInitSocket.current = true;
    const socketURI = params.roomID;
    return io(socketURI, { autoConnect: false });
  };
  const socketRef = useRef<Socket>(initSocket());

  const didConnectToGameRoom = useRef<boolean>(false);

  const connectToGameRoom = useCallback(async (): Promise<void> => {
    if (storybookContext) {
      return;
    }
    if (didConnectToGameRoom.current) {
      return;
    }
    // TODO: Display a loading indicator while request is in progress.
    const wasFound = await APIUtils.getRoomByRoomID(params.roomID);
    if (wasFound) {
      const socket = socketRef.current;
      if (socket) {
        socket.connect();
        didConnectToGameRoom.current = true;
      } else {
        // FIXME: Handle no socket..
      }
    } else {
      // TODO: Display a room does not exist message.
      setLocation(RouteUtils.HOME_PATH);
    }
  }, [params.roomID, setLocation, storybookContext]);

  useEffect(() => {
    const socket = socketRef.current;
    connectToGameRoom();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [connectToGameRoom]);

  const onConnect = useCallback((): void => {
    // TODO: Show symbol to denote connection.
  }, []);
  useEffect(() => {
    const socket = socketRef.current;
    if (socket === null) {
      return;
    }
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
    if (socket === null) {
      return;
    }
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
    if (socket === null) {
      return;
    }
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
    if (socket === null) {
      return;
    }
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
    if (socket === null) {
      return;
    }
    socket.on(SocketEvents.GC_SERVER_STAGE_SHOWING_QUESTION, onGCStageShowingQuestion);
    return () => {
      socket.off(SocketEvents.GC_SERVER_STAGE_SHOWING_QUESTION, onGCStageShowingQuestion);
    };
  }, [onGCStageShowingQuestion]);

  const onGCStageJudingAnswers = useCallback((payload: GCJudgingAnswers_Payload): void => {
    matchStateContext?.setMatchStage(MatchStateStages.JUDGING_ANSWERS);
    matchStateContext?.setMatchStageTimeFrame(payload.matchStageTimeFrame);
    matchStateContext?.setPlayerAnswerStates([]);
    matchStateContext?.setPlayersStats(payload.playersStats);
    matchStateContext?.setAnswerJudgments(payload.judgmentResults);
  }, [matchStateContext]);
  useEffect(() => {
    const socket = socketRef.current;
    if (socket === null) {
      return;
    }
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
    if (socket === null) {
      return;
    }
    socket.on(SocketEvents.GC_SERVER_STAGE_JUDGING_PLAYERS, onGCStageJudgingPlayers);
    return () => {
      socket.off(SocketEvents.GC_SERVER_STAGE_JUDGING_PLAYERS, onGCStageJudgingPlayers);
    };
  }, [onGCStageJudgingPlayers]);

  const onGCReceivePlayerID = useCallback((payload: GCReceivePlayerID_Payload): void => {
    matchStateContext?.setClientPlayerID(payload.playerID);
  }, [matchStateContext]);
  useEffect(() => {
    const socket = socketRef.current;
    if (socket === null) {
      return;
    }
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
    if (socket === null) {
      return;
    }
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
    if (socket === null) {
      return;
    }
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
    if (socket === null) {
      return;
    }
    socket.on(SocketEvents.GC_SERVER_ANSWER_SUBMITTED, onAnswerSubmitted);
    return () => {
      socket.off(SocketEvents.GC_SERVER_ANSWER_SUBMITTED, onAnswerSubmitted);
    };
  }, [onAnswerSubmitted]);

  return {
    socket: socketRef,
  };
};

export default useGameRoomSocket;