import { Badge } from "@mantine/core";
import { AnswerID } from "trivia-shared";
import StyleUtils from "../../lib/StyleUtils";

export interface AnswerBadge_Props {
  isRevealed: boolean;
  selectedAnswerID?: AnswerID;
}

export default function AnswerBadge(props: AnswerBadge_Props) {

  const renderUnrevealedBadge = (): JSX.Element => {
    return (
      <Badge size="md" circle color={StyleUtils.ANSWER_SELECTED_UNREVEALED_COLOR} />
    );
  };

  const renderRevealedBadge = (): JSX.Element | null=> {
    const selectedAnswerID = props.selectedAnswerID;
    if (selectedAnswerID === undefined) {
      return null;
    }
    return (
      <Badge size="md" circle color={StyleUtils.getAnswerColor(selectedAnswerID)}>
        {StyleUtils.convertAnswerIDToText(selectedAnswerID)}
      </Badge>
    );
  };

  const renderBadge = (): JSX.Element | null => {
    if (props.isRevealed) {
      return renderRevealedBadge();
    }
    return renderUnrevealedBadge();
  };

  return renderBadge();
}
