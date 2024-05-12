import { useCallback, useContext } from "react";
import { Button } from "@mantine/core";
import { GCReqestStartMatch_Payload, MatchSettings, SocketEvents } from "trivia-shared";
import { MatchSettingsModalContext, SocketContext } from "../../pages/RoomPage/RoomPage";
import StyleUtils from "../../lib/StyleUtils";

export interface StartGameButton_Props {
  matchSettings: MatchSettings;
}

export default function StartGameButton(props: StartGameButton_Props) {
  const socket = useContext(SocketContext);
  const settingsModalContext = useContext(MatchSettingsModalContext);

  const onClick_StartGameButton = useCallback((): void => {
    settingsModalContext?.close();
    socket?.emit(
      SocketEvents.GC_CLIENT_REQUEST_START_MATCH,
      {
        matchSettings: props.matchSettings,
      } satisfies GCReqestStartMatch_Payload
    );
  }, [props.matchSettings, settingsModalContext, socket]);

  return (
    <Button variant="filled" size="xs" onClick={onClick_StartGameButton} color={StyleUtils.DEFAULT_ACTION_BUTTON_COLOR}>
      Start Game
    </Button>
  );
}