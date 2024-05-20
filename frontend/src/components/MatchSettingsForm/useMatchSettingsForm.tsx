import { useState } from "react";
import { MATCH_SETTINGS_POINTS_ON_CORRECT_DEFAULT, MATCH_SETTINGS_POINTS_ON_INCORRECT_DEFAULT, MATCH_SETTINGS_POINTS_ON_NO_ANSWER_DEFAULT, MatchSettings, OTDB_CATEGORY_ANY_ID, QuestionProvider } from "trivia-shared";
import MatchSettingsForm from "./MatchSettingsForm";
import { Flex } from "@mantine/core";
import StartGameButton from "../StartGameButton/StartGameButton";

export interface useMatchSettingsForm_Return {
  renderForm: () => JSX.Element;
}

const useMatchSettingsForm = (): useMatchSettingsForm_Return => {
  // TODO: Implement QuestionProviders.
  const [questionProvider, _setQuestionProvider] = useState<QuestionProvider>(QuestionProvider.OPENTDB);
  const [category, setCategory] = useState<number>(OTDB_CATEGORY_ANY_ID);
  const [pointsOnCorrect, setPointsOnCorrect] = useState<number>(MATCH_SETTINGS_POINTS_ON_CORRECT_DEFAULT);
  const [pointsOnIncorrect, setPointsOnIncorrect] = useState<number>(MATCH_SETTINGS_POINTS_ON_INCORRECT_DEFAULT);
  const [pointsOnNoAnswer, setPointsOnNoAnswer] = useState<number>(MATCH_SETTINGS_POINTS_ON_NO_ANSWER_DEFAULT);

  const getMatchSettings = (): MatchSettings => {
    return {
      questionProvider: questionProvider,
      providerSettings: { category: category },
      pointsOnCorrect: pointsOnCorrect,
      pointsOnIncorrect: pointsOnIncorrect,
      pointsOnNoAnswer: pointsOnNoAnswer,
    };
  };

  const renderForm = (): JSX.Element => {
    return (
      <Flex
        justify="center"
        align="center"
        direction="column"
        gap="xs"
      >
        <MatchSettingsForm
          questionProvider={questionProvider}
          category={category}
          setCategory={setCategory}
          pointsOnCorrect={pointsOnCorrect}
          setPointsOnCorrect={setPointsOnCorrect}
          pointsOnIncorrect={pointsOnIncorrect}
          setPointsOnIncorrect={setPointsOnIncorrect}
          pointsOnNoAnswer={pointsOnNoAnswer}
          setPointsOnNoAnswer={setPointsOnNoAnswer}
        />
        {/* TODO: Could add a reset to defaults button. */}
        <StartGameButton matchSettings={getMatchSettings()} />
      </Flex>
    );
  };

  return {
    renderForm: renderForm,
  };
};

export default useMatchSettingsForm;