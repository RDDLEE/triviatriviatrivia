import { useCallback, useContext, useEffect } from "react";
import { SocketContext } from "../../pages/RoomPage/RoomPage";
import { GCShowingQuestion_Payload, SocketEvents } from "trivia-shared";
import { MatchStateContext } from "../MatchStateProvider/MatchStateProvider";
import React from "react";
import AnswerChoice from "../AnswerChoice/AnswerChoice";

export default function QuestionContainer() {
  const matchStateContext = useContext(MatchStateContext);
  const socket = useContext(SocketContext);

  const onShowingQuestion = useCallback((payload: GCShowingQuestion_Payload): void => {
    console.log(`QuestionContainer.onShowingQuestion called. payload = ${JSON.stringify(payload)}.`);
    // TODO: Need to update matchStatus.
    matchStateContext?.setQuestion(payload.question);
  }, [matchStateContext]);

  useEffect(() => {
    if (socket) {
      socket.on(SocketEvents.GC_SERVER_SHOWING_QUESTION, onShowingQuestion);
    }
    return () => {
      if (socket) {
        socket.off(SocketEvents.GC_SERVER_SHOWING_QUESTION, onShowingQuestion);
      }
    };
  }, [onShowingQuestion, socket]);

  const displayQuestion = (): JSX.Element | null => {
    if (!matchStateContext) {
      return null;
    }
    const question = matchStateContext.question;
    if (!question) {
      return null;
    }
    const choices: JSX.Element[] = [];
    for (const choice of question.choices) {
      choices.push((
        <AnswerChoice answerChoice={choice} />
      ));
    }
    return (
      <React.Fragment>
        <p>
          {question.prompt}
        </p>
        {choices}
      </React.Fragment>
    );
  };

  return (
    <div>
      {displayQuestion()}
    </div>
  );
}
