import { useContext } from "react";
import { Text, Box, Flex, Title } from "@mantine/core";
import { MatchStateContext } from "../MatchStateProvider/MatchStateProvider";
import MatchStateUtils from "../../lib/MatchStateUtils";

export default function JudgePlayers() {
  const matchStateContext = useContext(MatchStateContext);

  const renderPlayerJudgments = (): JSX.Element | null => {
    const judgmentsJSX: JSX.Element[] = [];
    if (!matchStateContext) {
      return null;
    }
    for (const judgment of matchStateContext.playerJudgments) {
      const vanity = MatchStateUtils.getPlayerVanityByPlayerID(matchStateContext, judgment.playerID);
      if (!vanity) {
        continue;
      }
      const displayName = vanity.displayName;
      const finalScore = judgment.finalPlayerStats.score;
      const rank = judgment.rank;
      judgmentsJSX.push((
        <Box>
          <Text><Text component="span">{rank}</Text> | {displayName}: <Text component="span">{finalScore}</Text></Text>
        </Box>
      ));
    }
    return (
      <Flex
        gap="md"
        justify="flex-start"
        align="flex-start"
        direction="column"
        wrap="wrap"
      >
        {judgmentsJSX}
      </Flex>
    );
  };

  return (
    <Flex
      gap="md"
      justify="flex-start"
      align="flex-start"
      direction="column"
      wrap="wrap"
    >
      <Title>Results: </Title>
      {renderPlayerJudgments()}
    </Flex>
  );
}