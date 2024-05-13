import { Badge } from "@mantine/core";
import StyleUtils from "../../lib/StyleUtils";
import AnswerKBD from "../AnswerKBD/AnswerKBD";

export interface AnswerBadge_Props {
  isRevealed: boolean;
  selectedAnswerID?: number;
}

export default function AnswerBadge(props: AnswerBadge_Props) {
  const renderUnrevealedBadge = (): JSX.Element => {
    return (
      <Badge size="md" circle color={StyleUtils.ANSWER_SELECTED_UNREVEALED_COLOR} />
    );
  };

  const renderRevealedBadge = (): JSX.Element | null => {
    const selectedAnswerID = props.selectedAnswerID;
    if (selectedAnswerID === undefined) {
      return null;
    }
    return (
      <AnswerKBD key={selectedAnswerID} answerID={selectedAnswerID} />
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
