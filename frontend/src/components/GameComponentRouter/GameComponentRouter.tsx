import { useContext } from "react";
import { MatchStateStages } from "trivia-shared";
import { MatchStateContext } from "../MatchStateProvider/MatchStateProvider";
import QuestionContainer from "../QuestionContainer/QuestionContainer";
import JudgePlayers from "../JudgePlayers/JudgePlayers";
import WaitingForMatchStart from "../WaitingForMatchStart/WaitingForMatchStart";
import PreparingMatchStart from "../PreparingMatchStart/PreparingMatchStart";

export default function GameComponentRouter() {
  const matchStateContext = useContext(MatchStateContext);

  const renderComponent = (): JSX.Element | null => {
    if (!matchStateContext) {
      return null;
    }
    switch (matchStateContext.matchStage) {
      case MatchStateStages.NONE:
        // FIXME: Log/throw/handle error.
        return null;
      case MatchStateStages.WAITING_FOR_MATCH_START:
        return (
          <WaitingForMatchStart />
        );
      case MatchStateStages.PREPARING_MATCH_START:
        return (
          <PreparingMatchStart />
        );
      case MatchStateStages.SHOWING_QUESTION:
      case MatchStateStages.JUDGING_ANSWERS:
        return (
          <QuestionContainer />
        );
      case MatchStateStages.JUDING_PLAYERS:
        return (
          <JudgePlayers />
        );
      default:
        // FIXME: Log/throw/handle error.
        return null;
    }
  };

  return renderComponent();
}