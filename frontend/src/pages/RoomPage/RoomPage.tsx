import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { Link } from "wouter";
import { io, Socket } from "socket.io-client";
import { GCReqestStartMatch_Payload, getMatchSettingsIdentity, GRUpdatePlayerVanities_Payload, MatchSettings, SocketEvents, GRJoinGame_Payload, Server_PlayerVanity } from "trivia-shared";
import { MatchStateContext } from "../../components/MatchStateProvider/MatchStateProvider";
import QuestionContainer from "../../components/QuestionContainer/QuestionContainer";

export const SocketContext = createContext<Socket | null>(null);

export default function RoomPage() {
  // NOTE: wouter.useParams is deliberately not used to prevent any unintentional rerenders.
  const roomIDRef = useRef<string>(window.location.pathname);

  const matchStateContext = useContext(MatchStateContext);

  const socketRef = useRef<Socket | null>(null);
  if (!socketRef.current) {
    // NOTE: Initializing here and not in useRef to prevent redudant io() calls.
    const socket_uri = import.meta.env.VITE_BASE_SERVER_URL + roomIDRef.current;
    console.log(`RoomPage.socketRef called and socket_uri = ${socket_uri}.`);
    socketRef.current = io(socket_uri, { autoConnect: false });
  }

  const onConnection = useCallback((): void => {
    console.log("RoomPage.onConnection called.");
  }, []);

  const onDisconnect = useCallback((): void => {
    console.log("RoomPage.onDisconnect called.");
  }, []);

  const onGRUpdatePlayerVanities = useCallback((payload: GRUpdatePlayerVanities_Payload): void => {
    console.log(`RoomPage.onGRUpdatePlayerVanities called. payload = ${JSON.stringify(payload)}.`);
    if (!matchStateContext) {
      console.log("RoomPage.onGRUpdatePlayerVanities called. matchState bad.");
    }
    matchStateContext?.setPlayerVanities(payload.playerVanities);
  }, [matchStateContext]);

  const onGCWaitingForMatchStart = useCallback((payload: GRUpdatePlayerVanities_Payload): void => {
    console.log(`RoomPage.onGRUpdatePlayerVanities called. payload = ${payload}.`);
  }, []);

  // NOTE: I believe these useEffects is neccessary to control the cleanup of listeners.
  // - While useEffect is to be avoided, the lifecycle of SocketIO's Socket presents a compelling use case.
  useEffect(() => {
    const socket = socketRef.current!;
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current!;
    socket.on(SocketEvents.CONNECTION, onConnection);
    return () => {
      socket.off(SocketEvents.CONNECTION, onConnection);
    };
  }, [onConnection]);

  useEffect(() => {
    const socket = socketRef.current!;
    socket.on(SocketEvents.DISCONNECT, onDisconnect);
    return () => {
      socket.off(SocketEvents.DISCONNECT, onDisconnect);
    };
  }, [onDisconnect]);

  useEffect(() => {
    const socket = socketRef.current!;
    socket.on(SocketEvents.GR_SERVER_UPDATE_PLAYER_VANITIES, onGRUpdatePlayerVanities);
    return () => {
      socket.off(SocketEvents.GR_SERVER_UPDATE_PLAYER_VANITIES, onGRUpdatePlayerVanities);
    };
  }, [onGRUpdatePlayerVanities]);

  useEffect(() => {
    const socket = socketRef.current!;
    socket.on(SocketEvents.GC_SERVER_WAITING_FOR_MATCH_START, onGCWaitingForMatchStart);
    return () => {
      socket.off(SocketEvents.GC_SERVER_WAITING_FOR_MATCH_START, onGCWaitingForMatchStart);
    };
  }, [onGCWaitingForMatchStart]);

  const onClick_JoinGameButton = (): void => {
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
        {`I am RoomPage. roomID: ${roomIDRef.current}.`}
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
