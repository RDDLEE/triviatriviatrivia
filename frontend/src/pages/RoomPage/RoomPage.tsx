import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "wouter";
import RouteUtils from "../../lib/RouteUtils";
import { io, Socket } from "socket.io-client";
import { getMatchSettingsIdentity, MatchSettings, MatchStateStates, PlayerVanity, SocketEvents } from "trivia-shared";

export default function RoomPage() {
  const params = useParams();

  const onConnection = useCallback((): void => {
    console.log("RoomPage.onConnection called.");
  }, []);

  const onDisconnect = useCallback((): void => {
    console.log("RoomPage.onDisconnect called.");
  }, []);

  const onGRUpdatePlayerVanities = useCallback((): void => {
    console.log("RoomPage.onGRUpdatePlayerVanities called.");
  }, []);

  const onGCUpdateState = useCallback((newState: MatchStateStates): void => {
    console.log(`RoomPage.onGCUpdateState called and newState = ${newState}.`);
  }, []);

  const initSocket = (): Socket => {
    // FIXME: Extract out to hook. Save in context.
    const socket_uri = import.meta.env.VITE_BASE_SERVER_URL + "/" + params[RouteUtils.PARAM_ROOM_ID];
    console.log(`RoomPage.initSocket called and socket_uri = ${socket_uri}.`);
    const ioSocket = io(socket_uri, { autoConnect: false });
    ioSocket.connect();

    ioSocket.on(SocketEvents.CONNECTION, onConnection);
    ioSocket.on(SocketEvents.DISCONNECT, onDisconnect);
    ioSocket.on(SocketEvents.GR_UPDATE_PLAYER_VANITIES, onGRUpdatePlayerVanities);
    ioSocket.on(SocketEvents.GC_UPDATE_STATE, onGCUpdateState);

    // FIXME: Maybe move and make player have to submit a Join prompt.
    const playerVanity: PlayerVanity = {
      // TODO: Save and load from localStorage.
      displayName: "I am player."
    };
    ioSocket.emit(SocketEvents.GR_INIT_PLAYER_READY, playerVanity);

    return ioSocket;
  };
  const [socket] = useState<Socket>(initSocket());

  useEffect(() => {
    return () => {
      socket.off(SocketEvents.CONNECTION, onConnection);
      socket.off(SocketEvents.DISCONNECT, onDisconnect);
      socket.off(SocketEvents.GR_UPDATE_PLAYER_VANITIES, onGRUpdatePlayerVanities);
      socket.off(SocketEvents.GC_UPDATE_STATE, onGCUpdateState);
      socket.disconnect();
    };
  }, [onConnection, onDisconnect, onGCUpdateState, onGRUpdatePlayerVanities, socket]);

  const onClick_StartGameButton = (): void => {
    // TODO: Allow user to configure matchSettings.
    const matchSettings: MatchSettings = getMatchSettingsIdentity();
    socket.emit(SocketEvents.GC_START_MATCH, matchSettings);
  };

  // FIXME: Check if room with roomID exists.
  return (
    <React.Fragment>
      {`I am RoomPage. roomID: ${params[RouteUtils.PARAM_ROOM_ID]}.`}
      <button onClick={onClick_StartGameButton}>Start Game</button>
    </React.Fragment>
  );
}
