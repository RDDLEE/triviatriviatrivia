import React, { useCallback } from "react";
import { Flex, NumberInput, Radio, ScrollArea, Stack } from "@mantine/core";
import {
  MATCH_SETTINGS_POINTS_ON_CORRECT_MAX, MATCH_SETTINGS_POINTS_ON_CORRECT_MIN, MATCH_SETTINGS_POINTS_ON_INCORRECT_MAX,
  MATCH_SETTINGS_POINTS_ON_INCORRECT_MIN, MATCH_SETTINGS_POINTS_ON_NO_ANSWER_MAX, MATCH_SETTINGS_POINTS_ON_NO_ANSWER_MIN,
  OTDB_CATEGORY_ANY_ID, OTDB_CATEGORY_ANY_NAME, OTDBCategories, OTDBCategory, QuestionProvider
} from "trivia-shared";
import StyleUtils from "../../lib/StyleUtils";

export interface MatchSettingsForm_Props {
  questionProvider: QuestionProvider;
  category: number;
  setCategory: React.Dispatch<React.SetStateAction<number>>;
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

  const onChange_RadioGroup = useCallback((value: string): void => {
    props.setCategory(Number(value));
  }, [props]);

  const renderOTDBCategory = (category: OTDBCategory): JSX.Element => {
    return (
      <Radio key={category.id} value={category.id.toString()} label={category.name} size="xs" />
    );
  };

  const renderQuestionProviderSettings = (): JSX.Element | null => {
    if (props.questionProvider === QuestionProvider.OPENTDB) {
      return (
        <React.Fragment>
          <Radio.Group
            value={props.category.toString()}
            onChange={onChange_RadioGroup}
            label="Category"
            description="Please select a category."
            styles={{ label: { color: StyleUtils.THEME_CONFIG.textColor } }}
            w="100%"
          >
            <ScrollArea h={200}>
              <Stack gap="xs" pl="xs">
                {renderOTDBCategory({ id: OTDB_CATEGORY_ANY_ID, name: OTDB_CATEGORY_ANY_NAME })}
                {
                  OTDBCategories.map((category: OTDBCategory) => {
                    return renderOTDBCategory(category);
                  })
                }
              </Stack>
            </ScrollArea>
          </Radio.Group>
        </React.Fragment>
      );
    }
    // TODO: Other QuestionProviders.
    return null;
  };

  return (
    <Flex
      gap="xs"
      justify="flex-start"
      align="center"
      direction="column"
      wrap="wrap"
      w="100%"
    >
      {renderQuestionProviderSettings()}
      <NumberInput
        label="Points awarded on correct answers"
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
        label="Points awarded on incorrect answers"
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
        label="Points awarded on no response"
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