import { useContext } from "react";
import { ANSWER_ID_NONE, AnswerID, Client_StandardAnswerCoice } from "trivia-shared";
import { MatchStateContext } from "../MatchStateProvider/MatchStateProvider";
import MatchStateUtils from "../../lib/MatchStateUtils";
import { Button, Flex } from "@mantine/core";
import AnswerKBD from "../AnswerKBD/AnswerKBD";
import StyleUtils from "../../lib/StyleUtils";

export interface AnswerChoice_Props {
  onClick_AnswerChoice: (answerID: AnswerID) => void;
  answerChoice: Client_StandardAnswerCoice;
}

export default function AnswerChoice(props: AnswerChoice_Props) {
  const matchStateContext = useContext(MatchStateContext);

  const renderAnswer = (): JSX.Element | null => {
    if (!matchStateContext) {
      return null;
    }
    const answerChoice = props.answerChoice;
    const answerID = answerChoice.answerID;
    const foundAnswerState = MatchStateUtils.getPlayerAnswerStateByPlayerID(matchStateContext, matchStateContext.clientPlayerID);
    let selectedAnswerID = ANSWER_ID_NONE;
    if (foundAnswerState) {
      selectedAnswerID = foundAnswerState.selectedAnswerID;
    }
    let color = StyleUtils.ANSWER_CHOICE_UNSELECTED_COLOR;
    let variant = "default";
    if (answerID === selectedAnswerID) {
      color = StyleUtils.ANSWER_CHOICE_SELECTED_COLOR;
      variant = "light";
    }
    if (answerID === matchStateContext.answerJudgments?.correctAnswerID) {
      color = StyleUtils.ANSWER_CHOICE_CORRECT_COLOR;
      variant = "filled";
    }
    return (
      <Flex
        gap="xs"
        justify="flex-start"
        align="flex-start"
        direction="row"
        wrap="nowrap"
        w="100%"
      >
        <AnswerKBD key={answerID} answerID={answerID} />
        <Button
          key={answerID}
          onClick={() => { return props.onClick_AnswerChoice(answerID); }}
          color={color}
          variant={variant}
          fullWidth={true}
          size="xs"
          justify="flex-start"
        >
          {answerChoice.text}
        </Button>
      </Flex>
    );
  };

  return renderAnswer();
}
