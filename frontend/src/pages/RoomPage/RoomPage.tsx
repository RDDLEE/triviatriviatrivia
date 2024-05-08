import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { Link } from "wouter";
import { io, Socket } from "socket.io-client";
import {
  GCReqestStartMatch_Payload, getMatchSettingsIdentity, GRUpdatePlayerVanities_Payload, MatchSettings, SocketEvents,
  GRJoinGame_Payload, Server_PlayerVanity, GCReceivePlayerID_Payload, GCAnswerSubmitted_Payload, GCReceiveMatchStage_Payload,
  MatchStateStages, GCWaitingForMatchStart_Payload, GCPreparingMatch_Payload
} from "trivia-shared";
import { produce } from "immer";
import { MatchStateContext } from "../../components/MatchStateProvider/MatchStateProvider";
import QuestionContainer from "../../components/QuestionContainer/QuestionContainer";
import MatchStateUtils from "../../lib/MatchStateUtils";
import JudgePlayers from "../../components/JudgePlayers/JudgePlayers";

export const SocketContext = createContext<Socket | null>(null);

export default function RoomPage() {
  const matchStateContext = useContext(MatchStateContext);

  const initSocket = (): Socket => {
    const socketURI = import.meta.env.VITE_BASE_SERVER_URL + window.location.pathname;
    return io(socketURI, { autoConnect: false });
  };
  const socketRef = useRef<Socket>(initSocket());

  // Extract socket callbacks to hook.
  const onConnection = useCallback((): void => {
    console.log("RoomPage.onConnection called.");
  }, []);

  const onDisconnect = useCallback((): void => {
    console.log("RoomPage.onDisconnect called.");
  }, []);

  const onGCReceivePlayerID = useCallback((payload: GCReceivePlayerID_Payload) => {
    matchStateContext?.setClientPlayerID(payload.playerID);
  }, [matchStateContext]);

  const onGCReceiveMatchStage = useCallback((payload: GCReceiveMatchStage_Payload) => {
    const matchState = payload.matchState;
    matchStateContext?.setMatchStage(matchState.matchStage);
    matchStateContext?.setRound(matchState.round);
    matchStateContext?.setQuestion(matchState.question);
    matchStateContext?.setPlayerVanities(matchState.playerVanities);
    matchStateContext?.setPlayersStats(matchState.playersStats);
    matchStateContext?.setPlayerAnswerStates(matchState.playerAnswerStates);
  }, [matchStateContext]);

  const onGRUpdatePlayerVanities = useCallback((payload: GRUpdatePlayerVanities_Payload): void => {
    matchStateContext?.setPlayerVanities(payload.playerVanities);
  }, [matchStateContext]);

  const onGCStageWaitingForMatchStart = useCallback((_payload: GCWaitingForMatchStart_Payload): void => {
    matchStateContext?.setMatchStage(MatchStateStages.WAITING_FOR_MATCH_START);
  }, [matchStateContext]);

  const onGCStagePreparingMatch = useCallback((_payload: GCPreparingMatch_Payload): void => {
    matchStateContext?.setMatchStage(MatchStateStages.PREPARING_MATCH_START);
  }, [matchStateContext]);

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
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.CONNECTION, onConnection);
    return () => {
      socket.off(SocketEvents.CONNECTION, onConnection);
    };
  }, [onConnection]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.DISCONNECT, onDisconnect);
    return () => {
      socket.off(SocketEvents.DISCONNECT, onDisconnect);
    };
  }, [onDisconnect]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.GC_SERVER_RECEIVE_PLAYER_ID, onGCReceivePlayerID);
    return () => {
      socket.off(SocketEvents.GC_SERVER_RECEIVE_PLAYER_ID, onGCReceivePlayerID);
    };
  }, [onGCReceivePlayerID]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.GC_SERVER_RECEIVE_MATCH_STATE, onGCReceiveMatchStage);
    return () => {
      socket.off(SocketEvents.GC_SERVER_RECEIVE_MATCH_STATE, onGCReceiveMatchStage);
    };
  }, [onGCReceiveMatchStage]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.GR_SERVER_UPDATE_PLAYER_VANITIES, onGRUpdatePlayerVanities);
    return () => {
      socket.off(SocketEvents.GR_SERVER_UPDATE_PLAYER_VANITIES, onGRUpdatePlayerVanities);
    };
  }, [onGRUpdatePlayerVanities]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.GC_SERVER_STAGE_WAITING_FOR_MATCH_START, onGCStageWaitingForMatchStart);
    return () => {
      socket.off(SocketEvents.GC_SERVER_STAGE_WAITING_FOR_MATCH_START, onGCStageWaitingForMatchStart);
    };
  }, [onGCStageWaitingForMatchStart]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.GC_SERVER_STAGE_PREPARING_MATCH, onGCStagePreparingMatch);
    return () => {
      socket.off(SocketEvents.GC_SERVER_STAGE_PREPARING_MATCH, onGCStagePreparingMatch);
    };
  }, [onGCStagePreparingMatch]);

  useEffect(() => {
    const socket = socketRef.current;
    socket.on(SocketEvents.GC_SERVER_ANSWER_SUBMITTED, onAnswerSubmitted);
    return () => {
      socket.off(SocketEvents.GC_SERVER_ANSWER_SUBMITTED, onAnswerSubmitted);
    };
  }, [onAnswerSubmitted]);

  const onClick_JoinGameButton = (): void => {
    // TODO: After joining, need server to send the player's PlayerID.
    const playerVanity: Server_PlayerVanity = {
      // TODO: Save and load from localStorage and read from prompt.
      displayName: "PlaceholderName",
    };
    socketRef.current!.emit(
      SocketEvents.GR_CLIENT_JOIN_GAME,
      {
        playerVanity: playerVanity,
      } satisfies GRJoinGame_Payload
    );
  };

  const onClick_StartGameButton = (): void => {
    // TODO: Allow user to configure matchSettings.
    const matchSettings: MatchSettings = getMatchSettingsIdentity();
    socketRef.current!.emit(
      SocketEvents.GC_CLIENT_REQUEST_START_MATCH,
      {
        matchSettings: matchSettings,
      } satisfies GCReqestStartMatch_Payload
    );
  };

  // FIXME: Check if room with roomID exists.
  return (
    <SocketContext.Provider value={socketRef.current}>
      <div>
        <Link to={import.meta.env.VITE_BASE_CLIENT_URL}>Home.</Link>
      </div>
      <div>
        {`I am RoomPage. roomID: ${window.location.pathname}.`}
      </div>
      <div>
        <button onClick={onClick_JoinGameButton}>Join Game</button>
      </div>
      <div>
        <button onClick={onClick_StartGameButton}>Start Game</button>
      </div>
      <QuestionContainer />
      <JudgePlayers />
    </SocketContext.Provider>
  );
}
