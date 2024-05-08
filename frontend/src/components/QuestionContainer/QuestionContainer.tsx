import React, { useCallback, useContext, useEffect } from "react";
import { GCJudgingAnswers_Payload, GCShowingQuestion_Payload, MatchStateStages, SocketEvents } from "trivia-shared";
import { SocketContext } from "../../pages/RoomPage/RoomPage";
import { MatchStateContext } from "../MatchStateProvider/MatchStateProvider";
import AnswerChoice from "../AnswerChoice/AnswerChoice";

export default function QuestionContainer() {
  const matchStateContext = useContext(MatchStateContext);
  const socket = useContext(SocketContext);

  const onGCStageShowingQuestion = useCallback((payload: GCShowingQuestion_Payload): void => {
    matchStateContext?.setMatchStage(MatchStateStages.SHOWING_QUESTION);
    matchStateContext?.setQuestion(payload.question);
    matchStateContext?.setPlayerAnswerStates(payload.playerAnswerStates);
    matchStateContext?.setJudgments(null);
  }, [matchStateContext]);

  useEffect(() => {
    socket?.on(SocketEvents.GC_SERVER_STAGE_SHOWING_QUESTION, onGCStageShowingQuestion);
    return () => {
      socket?.off(SocketEvents.GC_SERVER_STAGE_SHOWING_QUESTION, onGCStageShowingQuestion);
    };
  }, [onGCStageShowingQuestion, socket]);

  const onGCStageJudingAnswers = useCallback((payload: GCJudgingAnswers_Payload): void => {
    // payload.terminationTime;
    matchStateContext?.setMatchStage(MatchStateStages.JUDGING_ANSWERS);
    matchStateContext?.setPlayerAnswerStates(payload.playerAnswerStates);
    matchStateContext?.setPlayersStats(payload.playersStats);
    matchStateContext?.setJudgments(payload.judgmentResults);
  }, [matchStateContext]);

  useEffect(() => {
    socket?.on(SocketEvents.GC_SERVER_STAGE_JUDGING_ANSWERS, onGCStageJudingAnswers);
    return () => {
      socket?.off(SocketEvents.GC_SERVER_STAGE_JUDGING_ANSWERS, onGCStageJudingAnswers);
    };
  }, [onGCStageJudingAnswers, socket]);

  const renderQuestion = (): JSX.Element | null => {
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
      {renderQuestion()}
    </div>
  );
}
