import { useContext } from "react";
import { Badge, Card, Flex, Text } from "@mantine/core";
import { MatchStateContext } from "../MatchStateProvider/MatchStateProvider";
import MatchStateUtils from "../../lib/MatchStateUtils";
import StyleUtils from "../../lib/StyleUtils";
import { MatchStateStages, PlayerID } from "trivia-shared";

export default function PlayerInfoBar() {
  const matchStateContext = useContext(MatchStateContext);

  const renderPlayerAnswerBadge = (playerID: PlayerID): JSX.Element | null => {
    if (!matchStateContext) {
      return null;
    }
    if (matchStateContext.matchStage === MatchStateStages.SHOWING_QUESTION) {
      const answerState = MatchStateUtils.getPlayerAnswerStateByPlayerID(matchStateContext, playerID);
      if (!answerState) {
        return null;
      }
      if (answerState.didSelectAnswer) {
        return (
          <Badge size="xl" circle color="lime" />
        );
      }
      return null;
    } else if (matchStateContext.matchStage === MatchStateStages.JUDGING_ANSWERS) {
      if (!matchStateContext.answerJudgments) {
        return null;
      }
      const playerAnswerJudgment = MatchStateUtils.getPlayerAnswerJudgmentByPlayerID(matchStateContext, playerID);
      if (!playerAnswerJudgment) {
        return null;
      }
      return (
        <Badge size="xl" circle >
          {playerAnswerJudgment.selectedAnswerID}
        </Badge>
      );
    }
    return null;
  };

  const renderPlayerVanities = (): JSX.Element[] | null => {
    if (!matchStateContext) {
      return null;
    }
    const vanities: JSX.Element[] = [];
    for (const vanity of matchStateContext.playerVanities) {
      const playerStats = MatchStateUtils.getPlayerStatsByPlayerID(matchStateContext, vanity.playerID);
      const displayName = vanity.displayName;
      let score = 0;
      if (playerStats) {
        score = playerStats.score;
      }
      vanities.push((
        <Card
          key={vanity.playerID}
          withBorder={true}
          w="100%"
        >
          <Flex
            gap="xs"
            justify="space-between"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <Flex
              gap="xs"
              justify="flex-start"
              align="center"
              direction="column"
              wrap="wrap"
            >
              <Text size="md" fw={StyleUtils.DISPLAY_NAME_FONT_WEIGHT}>
                {displayName}
              </Text>
              <Text size="md" fw={StyleUtils.SCORE_FONT_WEIGHT} c={StyleUtils.getColorOfScore(score)}>
                {score}
              </Text>
            </Flex>
            <Flex
              gap="xs"
              justify="flex-end"
              align="center"
              direction="row-reverse"
              wrap="wrap"
            >
              {renderPlayerAnswerBadge(vanity.playerID)}
            </Flex>
          </Flex>
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