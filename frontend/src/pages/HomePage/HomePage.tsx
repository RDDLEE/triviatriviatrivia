import React from "react";
import { Link, useLocation } from "wouter";
import APIUtils from "../../lib/APIUtils";

export default function HomePage() {

  const [_location, setLocation] = useLocation();

  const onClick_CreateRoomButton = async (): Promise<void> => {
    // FIXME: Use Tanstack Query.
    const roomID = await APIUtils.createRoom();
    console.log(`HomePage.onClick_CreateRoomButton called and roomID = ${JSON.stringify(roomID)}.`);
    // FIXME: Extract to utils.
    setLocation(roomID);
  };

  // FIXME: Use MantineUI components.
  return (
    <React.Fragment>
      <Link to="/123">Room 123.</Link>
      <button onClick={onClick_CreateRoomButton}>Create Room</button>
      I am HomePage.
    </React.Fragment>
  );
}
