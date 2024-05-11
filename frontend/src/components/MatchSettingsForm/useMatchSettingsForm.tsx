import { useState } from "react";
import { MATCH_SETTINGS_POINTS_ON_CORRECT_DEFAULT, MATCH_SETTINGS_POINTS_ON_INCORRECT_DEFAULT, MATCH_SETTINGS_POINTS_ON_NO_ANSWER_DEFAULT, MatchSettings, QuestionProvider } from "trivia-shared";
import MatchSettingsForm from "./MatchSettingsForm";

export interface useMatchSettingsForm_Return {
  getMatchSettings: () => MatchSettings;
  renderForm: () => JSX.Element;
}

const useMatchSettingsForm = (): useMatchSettingsForm_Return => {
  // TODO: Implement QuestionProviders.
  const [questionProvider, _setQuestionProvider] = useState<QuestionProvider>(QuestionProvider.OPENTDB);

  const [pointsOnCorrect, setPointsOnCorrect] = useState<number>(MATCH_SETTINGS_POINTS_ON_CORRECT_DEFAULT);
  const [pointsOnIncorrect, setPointsOnIncorrect] = useState<number>(MATCH_SETTINGS_POINTS_ON_INCORRECT_DEFAULT);
  const [pointsOnNoAnswer, setPointsOnNoAnswer] = useState<number>(MATCH_SETTINGS_POINTS_ON_NO_ANSWER_DEFAULT);

  const getMatchSettings = (): MatchSettings => {
    return {
      questionProvider: questionProvider,
      pointsOnCorrect: pointsOnCorrect,
      pointsOnIncorrect: pointsOnIncorrect,
      pointsOnNoAnswer: pointsOnNoAnswer,
    };
  };

  const renderForm = (): JSX.Element => {
    return (
      <MatchSettingsForm
        pointsOnCorrect={pointsOnCorrect}
        setPointsOnCorrect={setPointsOnCorrect}
        pointsOnIncorrect={pointsOnIncorrect}
        setPointsOnIncorrect={setPointsOnIncorrect}
        pointsOnNoAnswer={pointsOnNoAnswer}
        setPointsOnNoAnswer={setPointsOnNoAnswer}
      />
    );
  };

  return {
    getMatchSettings: getMatchSettings,
    renderForm: renderForm,
  };
};

export default useMatchSettingsForm;