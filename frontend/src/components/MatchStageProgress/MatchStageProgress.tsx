import { useCallback, useContext, useEffect, useState } from "react";
import { Box, Progress } from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import { MatchStateContext } from "../MatchStateProvider/MatchStateProvider";

export default function MatchStageProgress() {
  const matchStateContext = useContext(MatchStateContext);

  const INTERVAL_PERIOD = 25;

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

  const interval = useInterval(onInterval, INTERVAL_PERIOD);

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

  return (
    <Box w="100%">
      <Progress
        color={getProgressColor()}
        size="sm"
        radius="xs"
        value={timeRemainingPercent}
        transitionDuration={INTERVAL_PERIOD}
      />
    </Box>
  );
}