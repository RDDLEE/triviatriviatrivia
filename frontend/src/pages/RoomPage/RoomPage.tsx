import { useCallback, useContext, useEffect, useRef } from "react";
import { GCReqestStartMatch_Payload, getMatchSettingsIdentity, GRUpdatePlayerVanities_Payload, MatchSettings, SocketEvents, GRJoinGame_Payload, Server_PlayerVanity } from "trivia-shared";
import { MatchStateContext } from "../../components/MatchStateProvider/MatchStateProvider";
import React from "react";
import { Link } from "wouter";
import { io, Socket } from "socket.io-client";

export default function RoomPage() {
  // NOTE: wouter.useParams is deliberately not used to prevent any unintentional rerenders.
  const roomIDRef = useRef<string>(window.location.pathname);

  const matchStateContext = useContext(MatchStateContext);

  const initSocket = (): Socket => {
    const socket_uri = import.meta.env.VITE_BASE_SERVER_URL + roomIDRef.current;
    console.log(`RoomPage.initSocket called and socket_uri = ${socket_uri}.`);
    return io(socket_uri, { autoConnect: false });
  };
  const socketRef = useRef<Socket>(initSocket());

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
    socket.on(SocketEvents.GR_SERVER_UPDATE_PLAYER_VANITIES, onGRUpdatePlayerVanities);
    return () => {
      socket.off(SocketEvents.GR_SERVER_UPDATE_PLAYER_VANITIES, onGRUpdatePlayerVanities);
    };
  }, [onGRUpdatePlayerVanities]);

  useEffect(() => {
    const socket = socketRef.current;
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
    socketRef.current.emit(
      SocketEvents.GR_CLIENT_JOIN_GAME,
      {
        playerVanity: playerVanity,
      } satisfies GRJoinGame_Payload
    );
  };

  const onClick_StartGameButton = (): void => {
    // TODO: Allow user to configure matchSettings.
    const matchSettings: MatchSettings = getMatchSettingsIdentity();
    socketRef.current.emit(
      SocketEvents.GC_CLIENT_REQUEST_START_MATCH,
      {
        matchSettings: matchSettings,
      } satisfies GCReqestStartMatch_Payload
    );
  };

  const displayPlayerVanities = (): JSX.Element[] => {
    if (!matchStateContext) {
      return [];
    }
    const vanities: JSX.Element[] = [];
    for (const vanity of matchStateContext.playerVanities) {
      vanities.push((
        <p>{`PlayerID: ${vanity.playerID}. Name: ${vanity.displayName}.`}</p>
      ));
    }
    return vanities;
  };

  // FIXME: Check if room with roomID exists.
  return (
    <React.Fragment>
      <Link to={import.meta.env.VITE_BASE_CLIENT_URL}>Home.</Link>
      {`I am RoomPage. roomID: ${roomIDRef.current}.`}
      <button onClick={onClick_JoinGameButton}>Join Game</button>
      <button onClick={onClick_StartGameButton}>Start Game</button>
      {displayPlayerVanities()}
    </React.Fragment>
  );
}
