import { useCallback, useContext } from "react";
import { Button } from "@mantine/core";
import { GCReqestStartMatch_Payload, MatchSettings, SocketEvents } from "trivia-shared";
import { SocketContext } from "../../pages/RoomPage/RoomPage";

export interface StartGameButton_Props {
  matchSettings: MatchSettings;
  buttonText?: string;
}

export default function StartGameButton(props: StartGameButton_Props) {
  const socket = useContext(SocketContext);

  const onClick_StartGameButton = useCallback((): void => {
    // TODO: Allow user to configure matchSettings.
    socket?.emit(
      SocketEvents.GC_CLIENT_REQUEST_START_MATCH,
      {
        matchSettings: props.matchSettings,
      } satisfies GCReqestStartMatch_Payload
    );
  }, [socket]);

  const getButtonText = (): string => {
    if (props.buttonText) {
      return props.buttonText;
    }
    return "Start Game";
  };

  return (
    <Button variant="filled" size="xs" onClick={onClick_StartGameButton}>
      {getButtonText()}
    </Button>
  );
}