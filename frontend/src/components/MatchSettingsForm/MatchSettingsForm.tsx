import { useCallback } from "react";
import { Flex, NumberInput } from "@mantine/core";
import {
  MATCH_SETTINGS_POINTS_ON_CORRECT_MAX, MATCH_SETTINGS_POINTS_ON_CORRECT_MIN, MATCH_SETTINGS_POINTS_ON_INCORRECT_MAX,
  MATCH_SETTINGS_POINTS_ON_INCORRECT_MIN, MATCH_SETTINGS_POINTS_ON_NO_ANSWER_MAX, MATCH_SETTINGS_POINTS_ON_NO_ANSWER_MIN
} from "trivia-shared";
import StyleUtils from "../../lib/StyleUtils";

// TODO: Question Provider.
export interface MatchSettingsForm_Props {
  pointsOnCorrect: number;
  setPointsOnCorrect: React.Dispatch<React.SetStateAction<number>>;
  pointsOnIncorrect: number;
  setPointsOnIncorrect: React.Dispatch<React.SetStateAction<number>>;
  pointsOnNoAnswer: number;
  setPointsOnNoAnswer: React.Dispatch<React.SetStateAction<number>>;
}

export default function MatchSettingsForm(props: MatchSettingsForm_Props) {
  const onChange_PointsOnCorrectInput = useCallback((value: string | number): void => {
    props.setPointsOnCorrect(Number(value));
  }, [props]);

  const onChange_PointsOnIncorrectInput = useCallback((value: string | number): void => {
    props.setPointsOnIncorrect(Number(value));
  }, [props]);

  const onChange_PointsOnNoAnswerInput = useCallback((value: string | number): void => {
    props.setPointsOnNoAnswer(Number(value));
  }, [props]);

  return (
    <Flex
      gap="xs"
      justify="flex-start"
      align="center"
      direction="column"
      wrap="wrap"
      w="100%"
    >
      <NumberInput
        label="Points awarded on correct answers."
        description="Please enter a value greater than 0."
        min={MATCH_SETTINGS_POINTS_ON_CORRECT_MIN}
        max={MATCH_SETTINGS_POINTS_ON_CORRECT_MAX}
        value={props.pointsOnCorrect}
        onChange={onChange_PointsOnCorrectInput}
        step={100}
        allowDecimal={false}
        allowLeadingZeros={false}
        allowNegative={false}
        w="100%"
        styles={{ label: { color: StyleUtils.THEME_CONFIG.textColor } }}
      />
      <NumberInput
        label="Points awarded on incorrect answers."
        description="Please enter a value less than 0."
        min={MATCH_SETTINGS_POINTS_ON_INCORRECT_MIN}
        max={MATCH_SETTINGS_POINTS_ON_INCORRECT_MAX}
        value={props.pointsOnIncorrect}
        onChange={onChange_PointsOnIncorrectInput}
        step={100}
        allowDecimal={false}
        allowLeadingZeros={false}
        w="100%"
        styles={{ label: { color: StyleUtils.THEME_CONFIG.textColor } }}
      />
      <NumberInput
        label="Points awarded on no response."
        description="Please enter a value less than 0."
        min={MATCH_SETTINGS_POINTS_ON_NO_ANSWER_MIN}
        max={MATCH_SETTINGS_POINTS_ON_NO_ANSWER_MAX}
        value={props.pointsOnNoAnswer}
        onChange={onChange_PointsOnNoAnswerInput}
        step={100}
        allowDecimal={false}
        allowLeadingZeros={false}
        w="100%"
        styles={{ label: { color: StyleUtils.THEME_CONFIG.textColor } }}
      />
    </Flex>
  );
}