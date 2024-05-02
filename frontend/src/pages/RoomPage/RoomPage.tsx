import React from "react";
import { useParams } from "wouter";
import RouteUtils from "../../lib/RouteUtils";

export default function RoomPage() {
  const params = useParams();

  return (
    <React.Fragment>
      {`I am RoomPage. roomID: ${params[RouteUtils.PARAM_ROOM_ID]}.`}
    </React.Fragment>
  )
}
