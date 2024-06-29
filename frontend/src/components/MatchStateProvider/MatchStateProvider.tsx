import React, { createContext, useMemo, useState } from "react";
import {
  MatchStateStages, Client_StandardQuestion, Client_MatchState, Client_PlayerVanity, Client_PlayerStats,
  Client_PlayerAnswerState, PlayerID, Client_AnswerJudgmentResults, Client_PlayerJudgment,
  MatchStageTimeFrame,
  MATCH_STAGE_TERMINATION_TIME_INDEFINITE,
  MATCH_STAGE_COUNTDOWN_TIME_INDEFINITE,
} from "trivia-shared";

export interface MatchStateContextSchema extends Client_MatchState {
  clientPlayerID: PlayerID | null;
  setClientPlayerID: React.Dispatch<React.SetStateAction<string | null>>
  setMatchStage: React.Dispatch<React.SetStateAction<MatchStateStages>>;
  setMatchStageTimeFrame: React.Dispatch<React.SetStateAction<MatchStageTimeFrame>>;
  setRound: React.Dispatch<React.SetStateAction<number>>;
  setTotalQuestionCount: React.Dispatch<React.SetStateAction<number>>;
  setQuestion: React.Dispatch<React.SetStateAction<Client_StandardQuestion | null>>;
  setPlayerVanities: React.Dispatch<React.SetStateAction<Client_PlayerVanity[]>>;
  setPlayersStats: React.Dispatch<React.SetStateAction<Client_PlayerStats[]>>;
  setPlayerAnswerStates: React.Dispatch<React.SetStateAction<Client_PlayerAnswerState[]>>;
  answerJudgments: Client_AnswerJudgmentResults | null;
  setAnswerJudgments: React.Dispatch<React.SetStateAction<Client_AnswerJudgmentResults | null>>;
  playerJudgments: Client_PlayerJudgment[];
  setPlayerJudgments: React.Dispatch<React.SetStateAction<Client_PlayerJudgment[]>>;
}

export const MatchStateContext = createContext<MatchStateContextSchema | null>(null);

export default function MatchStateProvider({ children }: Readonly<{ children: React.ReactNode; }>) {
  const [clientPlayerID, setClientPlayerID] = useState<PlayerID | null>(null);
  // Could use a Reducer.
  const [matchStage, setMatchStage] = useState<MatchStateStages>(MatchStateStages.NONE);
  const [matchStageTimeFrame, setMatchStageTimeFrame] = useState<MatchStageTimeFrame>({
    terminationTime: MATCH_STAGE_TERMINATION_TIME_INDEFINITE,
    countdownTime: MATCH_STAGE_COUNTDOWN_TIME_INDEFINITE
  });
  // FIXME: Make const default.
  // Could use a Reducer.
  const [round, setRound] = useState<number>(0);
  const [totalQuestionCount, setTotalQuestionCount] = useState<number>(0);
  const [question, setQuestion] = useState<Client_StandardQuestion | null>(null);
  const [playerVanities, setPlayerVanities] = useState<Client_PlayerVanity[]>([]);
  const [playersStats, setPlayersStats] = useState<Client_PlayerStats[]>([]);
  const [playerAnswerStates, setPlayerAnswerStates] = useState<Client_PlayerAnswerState[]>([]);
  const [answerJudgments, setAnswerJudgments] = useState<Client_AnswerJudgmentResults | null>(null);
  const [playerJudgments, setPlayerJudgments] = useState<Client_PlayerJudgment[]>([]);

  const matchState = useMemo<MatchStateContextSchema>(() => {
    return {
      clientPlayerID: clientPlayerID,
      setClientPlayerID: setClientPlayerID,
      matchStage: matchStage,
      setMatchStage: setMatchStage,
      matchStageTimeFrame: matchStageTimeFrame,
      setMatchStageTimeFrame: setMatchStageTimeFrame,
      round: round,
      setRound: setRound,
      totalQuestionCount: totalQuestionCount,
      setTotalQuestionCount: setTotalQuestionCount,
      question: question,
      setQuestion: setQuestion,
      playerVanities: playerVanities,
      setPlayerVanities: setPlayerVanities,
      playersStats: playersStats,
      setPlayersStats: setPlayersStats,
      playerAnswerStates: playerAnswerStates,
      setPlayerAnswerStates: setPlayerAnswerStates,
      answerJudgments: answerJudgments,
      setAnswerJudgments: setAnswerJudgments,
      playerJudgments: playerJudgments,
      setPlayerJudgments: setPlayerJudgments,
    };
  }, [clientPlayerID, matchStage, matchStageTimeFrame, round, totalQuestionCount, question, playerVanities, playersStats, playerAnswerStates, answerJudgments, playerJudgments]);

  return (
    <MatchStateContext.Provider value={matchState}>
      {children}
    </MatchStateContext.Provider>
  );
}
