import { useCallback, useContext } from "react";
import { Button, Text } from "@mantine/core";
import { GCReqestStartMatch_Payload, getMatchSettingsIdentity, MatchSettings, MatchStateStages, SocketEvents } from "trivia-shared";
import { MatchStateContext } from "../MatchStateProvider/MatchStateProvider";
import { SocketContext } from "../../pages/RoomPage/RoomPage";
import QuestionContainer from "../QuestionContainer/QuestionContainer";
import JudgePlayers from "../JudgePlayers/JudgePlayers";

export default function GameComponentRouter() {
  const matchStateContext = useContext(MatchStateContext);
  const socket = useContext(SocketContext);

  const onClick_StartGameButton = useCallback((): void => {
    // TODO: Allow user to configure matchSettings.
    const matchSettings: MatchSettings = getMatchSettingsIdentity();
    socket?.emit(
      SocketEvents.GC_CLIENT_REQUEST_START_MATCH,
      {
        matchSettings: matchSettings,
      } satisfies GCReqestStartMatch_Payload
    );
  }, [socket]);

  const renderComponent = (): JSX.Element | null => {
    if (!matchStateContext) {
      return null;
    }
    switch (matchStateContext.matchStage) {
      case MatchStateStages.NONE:
        // FIXME: Log/throw/handle error.
        return null;
      case MatchStateStages.WAITING_FOR_MATCH_START:
        return (
          // TODO: Extract to component. Add preliminary match settings form.
          <Button variant="filled" size="xs" onClick={onClick_StartGameButton}>Start Game</Button>
        );
      case MatchStateStages.PREPARING_MATCH_START:
        return (
          // TODO: Loading spinner.
          <Text>Loading...</Text>
        );
      case MatchStateStages.SHOWING_QUESTION:
      case MatchStateStages.JUDGING_ANSWERS:
        return (
          <QuestionContainer />
        );
      case MatchStateStages.JUDING_PLAYERS:
        return (
          <JudgePlayers />
        );
      default:
        // FIXME: Log/throw/handle error.
        return null;
    }
  };

  return renderComponent();
}