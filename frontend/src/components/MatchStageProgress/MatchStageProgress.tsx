import { useCallback, useContext, useEffect, useState } from "react";
import { Box, Flex, Progress, Text } from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import { MatchStateContext } from "../MatchStateProvider/MatchStateProvider";
import { MatchStateStages } from "trivia-shared";

interface MatchStageProgress_Props {
  withCountdownText?: boolean;
  countdownText?: string;
}

export default function MatchStageProgress(props: MatchStageProgress_Props) {
  const matchStateContext = useContext(MatchStateContext);

  const INTERVAL_PERIOD_MS = 25;

  const calcTimeRemaining = useCallback((): number => {
    if (matchStateContext === null) {
      return 0;
    }
    const timeRemaining = Math.max(0, matchStateContext.matchStageTimeFrame.terminationTime - Date.now());
    return timeRemaining;
  }, [matchStateContext]);

  const calcTimeRemainingPercent = useCallback((): number => {
    if (matchStateContext === null) {
      return 0;
    }
    const timeRemaining = calcTimeRemaining();
    if (timeRemaining < 0) {
      return 0;
    }
    return (timeRemaining / matchStateContext.matchStageTimeFrame.countdownTime) * 100;
  }, [calcTimeRemaining, matchStateContext]);

  const [timeRemainingPercent, setTimeRemainingPercent] = useState<number>(100);

  const onInterval = useCallback(() => {
    const remainingPercent = calcTimeRemainingPercent();
    setTimeRemainingPercent(remainingPercent);
    // Could stop timer if remaining percent <= 0,
    // but component will soon be unmounted anyway.
  }, [calcTimeRemainingPercent]);

  const interval = useInterval(onInterval, INTERVAL_PERIOD_MS);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, [interval]);

  const getProgressColor = (): string => {
    if (timeRemainingPercent >= 50) {
      return "green.7";
    }
    if (timeRemainingPercent >= 25) {
      return "orange.7";
    }
    return "red.7";
  };

  const getProgressValue = (): number => {
    if (matchStateContext === null) {
      return 0;
    }
    if (matchStateContext.matchStage === MatchStateStages.JUDGING_ANSWERS) {
      return 0;
    }
    return timeRemainingPercent;
  };

  const renderCountdownText = (): JSX.Element | null => {
    if (props.withCountdownText === undefined) {
      return null;
    }
    if (props.withCountdownText === false) {
      return null;
    }
    return (
      <Text c="dimmed" size="xs">
        {`${props.countdownText}: ${Math.round(calcTimeRemaining() / 1000)}.`}
      </Text>
    );
  };

  return (
    <Flex
      gap="xs"
      justify="flex-start"
      align="flex-start"
      direction="column"
      wrap="wrap"
      w="100%"
    >
      <Box w="100%">
        <Progress
          color={getProgressColor()}
          size="sm"
          radius="xs"
          value={getProgressValue()}
          transitionDuration={INTERVAL_PERIOD_MS}
        />
      </Box>

      {renderCountdownText()}
    </Flex>
  );
}