import { useCallback, useContext } from "react";
import { SocketContext } from "../../pages/RoomPage/RoomPage";
import { ANSWER_ID_NONE, Client_StandardAnswerCoice, GCAttemptSubmitAnswer_Payload, SocketEvents } from "trivia-shared";
import { MatchStateContext } from "../MatchStateProvider/MatchStateProvider";
import MatchStateUtils from "../../lib/MatchStateUtils";
import { Button } from "@mantine/core";

export interface AnswerChoice_Props {
  answerChoice: Client_StandardAnswerCoice;
}

export default function AnswerChoice(props: AnswerChoice_Props) {
  const matchStateContext = useContext(MatchStateContext);
  const socket = useContext(SocketContext);

  const onClick_AnswerChoice = useCallback((answerID: number): void => {
    if (!matchStateContext) {
      return;
    }
    const clientPlayerID = matchStateContext.clientPlayerID;
    const clientAnswerState = MatchStateUtils.getPlayerAnswerStateByPlayerID(matchStateContext, clientPlayerID);
    if (!clientAnswerState) {
      return;
    }
    if (!clientAnswerState.canAnswer) {
      return;
    }
    socket?.emit(
      SocketEvents.GC_CLIENT_ATTEMPT_SUBMIT_ANSWER,
      {
        selectedAnswerID: answerID,
      } satisfies GCAttemptSubmitAnswer_Payload
    );
  }, [matchStateContext, socket]);

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
    let color = "cyan";
    let variant = "outline";
    if (answerID === selectedAnswerID) {
      color = "yellow";
      variant = "filled";
    }
    if (answerID === matchStateContext.answerJudgments?.correctAnswerID) {
      color = "green";
      variant = "filled";
    }
    return (
      <Button
        key={answerID}
        onClick={() => { return onClick_AnswerChoice(answerID); }}
        color={color}
        variant={variant}
        fullWidth={true}
        size="xs"
        justify="flex-start"
      >
        {answerChoice.text}
      </Button>
    );
  };

  return renderAnswer();
}
