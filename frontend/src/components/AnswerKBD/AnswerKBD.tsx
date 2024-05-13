import { Kbd } from "@mantine/core";
import StyleUtils from "../../lib/StyleUtils";
import { AnswerID } from "trivia-shared";

export interface AnswerKBD_Props {
  answerID: AnswerID;
}

export default function AnswerKBD(props: AnswerKBD_Props) {
  return (
    <Kbd pl="xs" pr="xs" c={StyleUtils.getAnswerColor(props.answerID)} size="md">
      {StyleUtils.convertAnswerIDToText(props.answerID)}
    </Kbd>
  );
}
