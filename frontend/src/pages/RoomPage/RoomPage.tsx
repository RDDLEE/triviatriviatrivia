import React, { useEffect } from "react";
import { useParams } from "wouter";
import RouteUtils from "../../lib/RouteUtils";
import { io } from "socket.io-client";
import { SocketEvents } from "trivia-shared";

export default function RoomPage() {
  const params = useParams();

  useEffect(() => {
    const socket_uri = import.meta.env.VITE_BASE_SERVER_URL + "/" + params[RouteUtils.PARAM_ROOM_ID];
    console.log(`RoomPage called and socket_uri = ${socket_uri}.`);
    const socket = io(socket_uri, { autoConnect: false });
    socket.connect();

    function onConnect() {
      console.log("RoomPage.onConnect called.");
    }

    function onDisconnect() {
      console.log("RoomPage.onDisconnect called.");
    }

    socket.on(SocketEvents.CONNECTION, onConnect);
    socket.on(SocketEvents.DISCONNECT, onDisconnect);

    return () => {
      socket.off(SocketEvents.CONNECTION, onConnect);
      socket.off(SocketEvents.DISCONNECT, onDisconnect);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FIXME: Check if room with roomID exists.
  return (
    <React.Fragment>
      {`I am RoomPage. roomID: ${params[RouteUtils.PARAM_ROOM_ID]}.`}
    </React.Fragment>
  );
}
