import { useContext } from "react";
import { Card, Flex, Text } from "@mantine/core";
import { MatchStateContext } from "../MatchStateProvider/MatchStateProvider";
import MatchStateUtils from "../../lib/MatchStateUtils";

export default function PlayerInfoBar() {
  const matchStateContext = useContext(MatchStateContext);

  const renderPlayerVanities = (): JSX.Element[] | null => {
    if (!matchStateContext) {
      return null;
    }
    const vanities: JSX.Element[] = [];
    for (const vanity of matchStateContext.playerVanities) {
      const playerStats = MatchStateUtils.getPlayerStatsByPlayerID(matchStateContext, vanity.playerID);
      vanities.push((
        <Card>
          <Text size="md">
            {vanity.displayName}
          </Text>
          <Text size="md">
            {playerStats?.score}
          </Text>
        </Card>
      ));
    }
    return vanities;
  };

  return (
    <Flex
      gap="xs"
      justify="center"
      align="center"
      direction="column"
      wrap="wrap"
    >
      {renderPlayerVanities()}
    </Flex>
  );
}