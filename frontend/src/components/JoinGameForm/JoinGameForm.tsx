import { Button, Flex, TextInput } from "@mantine/core";
import { useContext, useCallback, useState } from "react";
import { Server_PlayerVanity, SocketEvents, GRJoinGame_Payload } from "trivia-shared";
import { SocketContext } from "../../pages/RoomPage/RoomPage";
import StyleUtils from "../../lib/StyleUtils";

export default function JoinGameForm() {
  const socket = useContext(SocketContext);

  const LOCAL_STORAGE_TRIVIA_DISPLAY_NAME_KEY = "Trivia:DisplayName";

  // FIXME: Need to extract form out to VanityForm.
  const initDisplayName = (): string => {
    const foundDisplayName = localStorage.getItem(LOCAL_STORAGE_TRIVIA_DISPLAY_NAME_KEY);
    if (foundDisplayName === null) {
      return "Player" + Date.now().toString();
    }
    return foundDisplayName;
  };
  const [displayName, setDisplayName] = useState<string>(initDisplayName());

  const onChange_DisplayNameInput = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    const newName = event.currentTarget.value;
    localStorage.setItem(LOCAL_STORAGE_TRIVIA_DISPLAY_NAME_KEY, newName);
    setDisplayName(newName);
  }, []);

  const onClick_JoinGameButton = useCallback((): void => {
    if (!socket) {
      return;
    }
    // TODO: After joining, need server to send the player's PlayerID.
    const playerVanity: Server_PlayerVanity = {
      // TODO: Save and load from localStorage and read from prompt.
      displayName: displayName,
    };
    socket.emit(
      SocketEvents.GR_CLIENT_JOIN_GAME,
      {
        playerVanity: playerVanity,
      } satisfies GRJoinGame_Payload
    );
  }, [displayName, socket]);

  return (
    <Flex
      justify="flex-start"
      align="flex-start"
      direction="column"
      gap="md"
    >
      <TextInput
        size="md"
        radius="md"
        label="Display Name"
        description="What should we call you?"
        value={displayName}
        onChange={onChange_DisplayNameInput}
        w="100%"
        styles={{ label: { color: StyleUtils.THEME_CONFIG.textColor } }}
      />
      <Flex
        justify="center"
        align="center"
        direction="column"
        gap="xs"
        w="100%"
      >
        <Button variant="filled" size="xs" onClick={onClick_JoinGameButton} color={StyleUtils.DEFAULT_ACTION_BUTTON_COLOR}>
          Join Game
        </Button>
      </Flex>
    </Flex>
  );
}