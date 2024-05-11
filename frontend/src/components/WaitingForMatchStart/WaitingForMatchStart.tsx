import { Flex } from "@mantine/core";
import StartGameButton from "../StartGameButton/StartGameButton";
import useMatchSettingsForm from "../MatchSettingsForm/useMatchSettingsForm";

export default function WaitingForMatchStart() {

  const matchSettingsForm = useMatchSettingsForm();

  return (
    <Flex
      justify="center"
      align="center"
      direction="column"
      gap="xs"
    >
      {matchSettingsForm.renderForm()}
      <StartGameButton matchSettings={matchSettingsForm.getMatchSettings()} />
    </Flex>
  );
}