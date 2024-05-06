import { useCallback, useContext, useEffect } from "react";
import { SocketContext } from "../../pages/RoomPage/RoomPage";
import { GCShowingQuestion_Payload, SocketEvents } from "trivia-shared";
import { MatchStateContext } from "../MatchStateProvider/MatchStateProvider";
import React from "react";

export default function QuestionContainer() {
  const matchStateContext = useContext(MatchStateContext);
  const socket = useContext(SocketContext);

  const onShowingQuestion = useCallback((payload: GCShowingQuestion_Payload): void => {
    console.log(`QuestionContainer.onShowingQuestion called. payload = ${payload}. question = ${JSON.stringify(matchStateContext?.question)}.`);
    matchStateContext?.setQuestion(payload.question);
  }, [matchStateContext]);

  useEffect(() => {
    if (socket) {
      console.log("QuestionContainer.useEffect.onShowingQuestion called. socket.on called.");
      socket.on(SocketEvents.GC_SERVER_SHOWING_QUESTION, onShowingQuestion);
    }
    return () => {
      if (socket) {
        console.log("QuestionContainer.useEffect.onShowingQuestion called. socket.off called.");
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
    const choicesJSX: JSX.Element[] = [];
    const choices = question.choices;
    for (const choice of choices) {
      choicesJSX.push((
        <p>{choice.text}</p>
      ));
    }
    return (
      <React.Fragment>
        <p>{question.prompt}</p>
        {choicesJSX}
      </React.Fragment>
    );
  };

  return (
    <div>
      {displayQuestion()}
    </div>
  );
}
