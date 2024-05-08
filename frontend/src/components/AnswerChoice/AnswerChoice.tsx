import { useCallback, useContext } from "react";
import { SocketContext } from "../../pages/RoomPage/RoomPage";
import { ANSWER_ID_NONE, Client_StandardAnswerCoice, GCAttemptSubmitAnswer_Payload, SocketEvents } from "trivia-shared";
import { MatchStateContext } from "../MatchStateProvider/MatchStateProvider";
import MatchStateUtils from "../../lib/MatchStateUtils";

export interface AnswerChoice_Props {
  answerChoice: Client_StandardAnswerCoice;
}

export default function AnswerChoice(props: AnswerChoice_Props) {
  const matchStateContext = useContext(MatchStateContext);
  const socket = useContext(SocketContext);

  const onClick_AnswerChoice = useCallback((answerID: number): void => {
    socket?.emit(
      SocketEvents.GC_CLIENT_ATTEMPT_SUBMIT_ANSWER,
      {
        selectedAnswerID: answerID,
      } satisfies GCAttemptSubmitAnswer_Payload
    );
  }, [socket]);

  const renderAnswer = (): JSX.Element | null => {
    if (!matchStateContext) {
      return null;
    }
    const answerChoice = props.answerChoice;
    const answerID = answerChoice.answerID;
    const foundAnswerState = MatchStateUtils.getPlayerAnswerStateByPlayerID(matchStateContext, matchStateContext.clientPlayerID);
    let selectedAnswerID = ANSWER_ID_NONE;
    let canAnswer = false;
    if (foundAnswerState) {
      selectedAnswerID = foundAnswerState.selectedAnswerID;
      canAnswer = foundAnswerState.canAnswer;
    }
    let backgroundColor = "white";
    if (answerID === selectedAnswerID) {
      backgroundColor = "blue";
    }
    if (answerID === matchStateContext.judgments?.correctAnswerID) {
      backgroundColor = "orange";
    }
    return (
      <button
        key={answerID}
        onClick={() => { return onClick_AnswerChoice(answerID); }}
        style={{ backgroundColor: backgroundColor }}
        disabled={!canAnswer}
      >
        {answerChoice.text}
      </button>
    );
  };

  return (
    <div>
      {renderAnswer()}
    </div>
  );
}
