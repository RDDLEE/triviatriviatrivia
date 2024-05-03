import React, { useEffect } from "react";
import { useParams } from "wouter";
import RouteUtils from "../../lib/RouteUtils";
import socket from "../../lib/SocketUtils";

export default function RoomPage() {
  const params = useParams();

  useEffect(() => {
    socket.connect();

    function onConnect() {
      console.log("RoomPage.onConnect called.");
    }

    function onDisconnect() {
      console.log("RoomPage.onDisconnect called.");
    }
    
    socket.on("connection", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connection", onConnect);
      socket.off("disconnect", onDisconnect);
    }
  }, []);

  return (
    <React.Fragment>
      {`I am RoomPage. roomID: ${params[RouteUtils.PARAM_ROOM_ID]}.`}
    </React.Fragment>
  )
}
