import { useContext } from "react";
import { Text, Flex, Title, Card } from "@mantine/core";
import { MatchStateContext } from "../MatchStateProvider/MatchStateProvider";
import MatchStateUtils from "../../lib/MatchStateUtils";
import StyleUtils from "../../lib/StyleUtils";
import MatchSettingsModalButton from "../MatchSettingsModalButton/MatchSettingsModalButton";
import MatchStageProgress from "../MatchStageProgress/MatchStageProgress";
import ScoreDisplay from "../ScoreDisplay/ScoreDisplay";

export default function JudgePlayers() {
  const matchStateContext = useContext(MatchStateContext);

  /** @see: https://stackoverflow.com/a/13627586. */
  const getOrdinalSuffixOfNum = (n: number): string => {
    const j = n % 10;
    const k = n % 100;
    if (j === 1 && k !== 11) {
      return n.toString() + "st";
    }
    if (j === 2 && k !== 12) {
      return n.toString() + "nd";
    }
    if (j === 3 && k !== 13) {
      return n.toString() + "rd";
    }
    return n.toString() + "th";
  };

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
        <Card
          key={judgment.playerID}
          radius="md"
          withBorder={true}
          shadow="xl"
          pl="xl"
          pr="xl"
          pt="xs"
          pb="xs"
          w="100%"
        >
          {/* TODO: maxwidth, overflow scroll. */}
          <Flex
            gap="xs"
            justify="flex-start"
            align="center"
            direction="row"
            wrap="wrap"
            w="100%"
          >
            <Text fz="xl" fw={1000} variant="gradient" gradient={StyleUtils.getRankGradient(rank)}>
              {getOrdinalSuffixOfNum(rank)}
            </Text>
            <Flex
              gap={0}
              justify="flex-start"
              align="flex-start"
              direction="column"
              wrap="wrap"
              ml="md"
            >
              {/* TODO: Could include other stats. */}
              <Text size="xl" fw={StyleUtils.DISPLAY_NAME_FONT_WEIGHT} variant="gradient" gradient={StyleUtils.getRankGradient(rank)}>
                {displayName}
              </Text>
              <ScoreDisplay score={finalScore} />
            </Flex>
          </Flex>
        </Card>
      ));
    }
    return (
      <Flex
        gap="md"
        justify="flex-start"
        align="flex-start"
        direction="column"
        wrap="wrap"
        w="100%"
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
      <Title order={1}>Results: </Title>
      {renderPlayerJudgments()}
      <Flex
        gap={0}
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
        w="100%"
      >
        <MatchSettingsModalButton buttonText="Start New Game" variant="filled" />
        <MatchStageProgress 
          withCountdownText={true}
          countdownText="Terminating room in"
        />
      </Flex>
    </Flex>
  );
}