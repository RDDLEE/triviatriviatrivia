import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { Link } from "wouter";
import { io, Socket } from "socket.io-client";
import { GCReqestStartMatch_Payload, getMatchSettingsIdentity, GRUpdatePlayerVanities_Payload, MatchSettings, SocketEvents, GRJoinGame_Payload, Server_PlayerVanity, GCReceivePlayerID_Payload, GCAnswerSubmitted_Payload, GCReceiveMatchStage_Payload } from "trivia-shared";
import { MatchStateContext } from "../../components/MatchStateProvider/MatchStateProvider";
import QuestionContainer from "../../components/QuestionContainer/QuestionContainer";
import MatchStateUtils from "../../lib/MatchStateUtils";
import { produce } from "immer";

export const SocketContext = createContext<Socket | null>(null);

export default function RoomPage() {
  const matchStateContext = useContext(MatchStateContext);

  const initSocket = (): Socket => {
    const socketURI = import.meta.env.VITE_BASE_SERVER_URL + window.location.pathname;
    console.log(`RoomPage.initSocket called and socket_uri = ${socketURI}.`);
    return io(socketURI, { autoConnect: false });
  };
  const socketRef = useRef<Socket>(initSocket());

  console.log(`RoomPage called and answerStates = ${JSON.stringify(matchStateContext?.playerAnswerStates)}.`);

  // Extract socket callbacks to hook.
  const onConnection = useCallback((): void => {
    console.log("RoomPage.onConnection called.");
  }, []);

  const onDisconnect = useCallback((): void => {
    console.log("RoomPage.onDisconnect called.");
  }, []);

  const onGCReceivePlayerID = useCallback((payload: GCReceivePlayerID_Payload) => {
    console.log(`GameRoom.GC_SERVER_REFRESH_MATCH_STATE called and payload = ${JSON.stringify(payload)}.`);
    matchStateContext?.setClientPlayerID(payload.playerID);
  }, [matchStateContext]);

  const onGCReceiveMatchStage = useCallback((payload: GCReceiveMatchStage_Payload) => {
    console.log(`GameRoom.onGCRefreshMatchState called and payload = ${JSON.stringify(payload)}.`);
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

  const onGCWaitingForMatchStart = useCallback((payload: GRUpdatePlayerVanities_Payload): void => {
    console.log(`RoomPage.onGRUpdatePlayerVanities called. payload = ${payload}.`);
  }, []);

  const onAnswerSubmitted = useCallback((payload: GCAnswerSubmitted_Payload): void => {
    // console.log(`RoomPage.onAnswerSubmitted called. payload = ${JSON.stringify(payload)}.`);
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

  // NOTE: I believe these useEffects is neccessary to control the cleanup of listeners.
  // - While useEffect is to be avoided, the lifecycle of SocketIO's Socket presents a compelling use case.
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
    socket.on(SocketEvents.GC_SERVER_STAGE_WAITING_FOR_MATCH_START, onGCWaitingForMatchStart);
    return () => {
      socket.off(SocketEvents.GC_SERVER_STAGE_WAITING_FOR_MATCH_START, onGCWaitingForMatchStart);
    };
  }, [onGCWaitingForMatchStart]);

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
      displayName: "I am player.",
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

  const displayPlayerVanities = (): JSX.Element | null => {
    if (!matchStateContext) {
      return null;
    }
    const vanities: JSX.Element[] = [];
    for (const vanity of matchStateContext.playerVanities) {
      vanities.push((
        <p>{`PlayerID: ${vanity.playerID}. Name: ${vanity.displayName}.`}</p>
      ));
    }
    return (
      <div>
        {vanities}
      </div>
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
      {displayPlayerVanities()}
      <QuestionContainer />
    </SocketContext.Provider>
  );
}
