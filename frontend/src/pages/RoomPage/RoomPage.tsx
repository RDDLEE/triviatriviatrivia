import { useContext } from "react";
import { Box, Card, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MatchStateStages } from "trivia-shared";
import classes from "./RoomPage.module.css";
import { MatchStateContext } from "../../components/MatchStateProvider/MatchStateProvider";
import PlayerInfoBar from "../../components/PlayerInfoBar/PlayerInfoBar";
import GameComponentRouter from "../../components/GameComponentRouter/GameComponentRouter";
import TriviaShell from "../../components/TriviaShell/TriviaShell";
import { RouteComponentProps } from "wouter";
import JoinGameForm from "../../components/JoinGameForm/JoinGameForm";
import MatchSettingsModalButton from "../../components/MatchSettingsModalButton/MatchSettingsModalButton";
import MatchSettingsModal from "../../components/MatchSettingsModal/MatchSettingsModal";
import { SocketContext } from "../../components/SocketContext/SocketContext";
import { MatchSettingsModalContext } from "../../components/MatchSettingsModalContext/MatchSettingsModalContext";
import useGameRoomSocket from "../../components/useGameRoomSocket";

interface RoomPageProps { }

export default function RoomPage(_props: RoomPageProps & RouteComponentProps) {
  const matchStateContext = useContext(MatchStateContext);

  // NOTE: Could save match settings to localStorage.
  const [isSettingsModalOpened, settingsModalCallbacks] = useDisclosure(false);

  // FIXME: Create helper in APIUtils.
  const roomID = window.location.pathname.replace(/^\/r/, "");

  const gameRoomSocket = useGameRoomSocket({ roomID: roomID });

  const renderMain = (): JSX.Element | null => {
    if (matchStateContext === null) {
      return null;
    }
    if (matchStateContext.clientPlayerID === null) {
      return (<JoinGameForm />);
    }
    return (<GameComponentRouter />);
  };

  const renderMatchSettingsModalButton = (): JSX.Element | null => {
    if (matchStateContext === null) {
      return null;
    }
    if (
      matchStateContext.matchStage === MatchStateStages.SHOWING_QUESTION ||
      matchStateContext.matchStage === MatchStateStages.JUDGING_ANSWERS ||
      matchStateContext.matchStage === MatchStateStages.JUDING_PLAYERS
    ) {
      return (
        <MatchSettingsModalButton withIcon={true} />
      );
    }
    return null;
  };

  return (
    <SocketContext.Provider value={gameRoomSocket.socket.current}>
      <TriviaShell>
        <Flex
          className={classes["core-container"]}
          justify="flex-start"
          align="flex-start"
          gap="md"
        >
          <MatchSettingsModalContext.Provider value={{
            isOpen: isSettingsModalOpened,
            close: settingsModalCallbacks.close,
            open: settingsModalCallbacks.open,
            toggle: settingsModalCallbacks.toggle,
          }}>
            <Box className={classes["left-section"]}>
              {renderMatchSettingsModalButton()}
              <MatchSettingsModal />
              <PlayerInfoBar />
            </Box>
            <Card
              className={classes["right-section"]}
              radius="md"
              withBorder={true}
              shadow="xl"
            >
              {renderMain()}
            </Card>
          </MatchSettingsModalContext.Provider>
        </Flex>
      </TriviaShell>
    </SocketContext.Provider >
  );
}
