import { useContext } from "react";
import { Card, Flex, Text } from "@mantine/core";
import { MatchStateContext } from "../MatchStateProvider/MatchStateProvider";
import MatchStateUtils from "../../lib/MatchStateUtils";
import StyleUtils from "../../lib/StyleUtils";
import { MatchStateStages, PlayerID } from "trivia-shared";
import AnswerBadge from "../AnswerBadge/AnswerBadge";
import ScoreDisplay from "../ScoreDisplay/ScoreDisplay";

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
          <AnswerBadge key={answerState.playerID} isRevealed={false} />
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
        <AnswerBadge
          key={playerAnswerJudgment.playerID}
          isRevealed={true}
          selectedAnswerID={playerAnswerJudgment.selectedAnswerID}
        />
      );
    }
    return null;
  };

  const getVanityBackgroundColor = (playerID: PlayerID): string | undefined => {
    if (!matchStateContext) {
      return undefined;
    }
    if (matchStateContext.matchStage !== MatchStateStages.JUDGING_ANSWERS) {
      return undefined;
    }
    const playerAnswerJudgment = MatchStateUtils.getPlayerAnswerJudgmentByPlayerID(matchStateContext, playerID);
    if (!playerAnswerJudgment) {
      return undefined;
    }
    let backgroundColor = StyleUtils.ANSWER_NOT_SELECTED_COLOR;
    if (playerAnswerJudgment.didSelectAnswer) {
      if (playerAnswerJudgment.wasCorrect) {
        backgroundColor = StyleUtils.ANSWER_CORRECT_COLOR;
      } else {
        backgroundColor = StyleUtils.ANSWER_INCORRECT_COLOR;
      }
    }
    return backgroundColor;
  };

  const renderPlayerVanities = (): JSX.Element[] | null => {
    if (!matchStateContext) {
      return null;
    }
    const vanities: JSX.Element[] = [];
    for (const vanity of matchStateContext.playerVanities) {
      // TODO: Should probably extract to PlayerVanity.tsx.
      const playerStats = MatchStateUtils.getPlayerStatsByPlayerID(matchStateContext, vanity.playerID);
      const displayName = vanity.displayName;
      let score = 0;
      if (playerStats) {
        score = playerStats.score;
      }
      const backgroundColor = getVanityBackgroundColor(vanity.playerID);
      vanities.push((
        <Card
          key={vanity.playerID}
          withBorder={true}
          w="100%"
          pl="md"
          pr="md"
          pt="xs"
          pb="xs"
          bg={backgroundColor}
          shadow="xl"
        >
          <Flex
            gap="xs"
            justify="space-between"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <Flex
              gap={0}
              justify="flex-start"
              align="flex-start"
              direction="column"
              wrap="wrap"
            >
              {/* TODO: Add scoreModifier when revealing answers. */}
              <Text size="xl" fw={StyleUtils.DISPLAY_NAME_FONT_WEIGHT} lh="xs">
                {displayName}
              </Text>
              <ScoreDisplay score={score} />
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
