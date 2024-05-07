import React, { createContext, useMemo, useState } from "react";
import { MatchStateStages, Client_StandardQuestion, Client_MatchState, Client_PlayerVanity, Client_PlayerStats, Client_PlayerAnswerState, PlayerID, PLAYER_ID_NONE } from "trivia-shared";

export interface MatchStateContextSchema extends Client_MatchState {
  clientPlayerID: PlayerID;
  setClientPlayerID: React.Dispatch<React.SetStateAction<string>>
  setMatchStage: React.Dispatch<React.SetStateAction<MatchStateStages>>;
  setRound: React.Dispatch<React.SetStateAction<number>>;
  setQuestion: React.Dispatch<React.SetStateAction<Client_StandardQuestion | null>>;
  setPlayerVanities: React.Dispatch<React.SetStateAction<Client_PlayerVanity[]>>;
  setPlayersStats: React.Dispatch<React.SetStateAction<Client_PlayerStats[]>>;
  setPlayerAnswerStates: React.Dispatch<React.SetStateAction<Client_PlayerAnswerState[]>>;
}

export const MatchStateContext = createContext<MatchStateContextSchema | null>(null);

export default function MatchStateProvider({ children }: Readonly<{ children: React.ReactNode; }>) {
  const [clientPlayerID, setClientPlayerID] = useState<PlayerID>(PLAYER_ID_NONE);
  // Could use a Reducer.
  const [matchStage, setMatchStage] = useState<MatchStateStages>(MatchStateStages.NONE);
  // FIXME: Make const default.
  // Could use a Reducer.
  const [round, setRound] = useState<number>(0);
  const [question, setQuestion] = useState<Client_StandardQuestion | null>(null);
  const [playerVanities, setPlayerVanities] = useState<Client_PlayerVanity[]>([]);
  const [playersStats, setPlayersStats] = useState<Client_PlayerStats[]>([]);
  const [playerAnswerStates, setPlayerAnswerStates] = useState<Client_PlayerAnswerState[]>([]);

  const matchState = useMemo<MatchStateContextSchema>(() => {
    return {
      clientPlayerID: clientPlayerID,
      setClientPlayerID: setClientPlayerID,
      matchStage: matchStage,
      setMatchStage: setMatchStage,
      round: round,
      setRound: setRound,
      question: question,
      setQuestion: setQuestion,
      playerVanities: playerVanities,
      setPlayerVanities: setPlayerVanities,
      playersStats: playersStats,
      setPlayersStats: setPlayersStats,
      playerAnswerStates: playerAnswerStates,
      setPlayerAnswerStates: setPlayerAnswerStates,
    };
  }, [clientPlayerID, matchStage, playerAnswerStates, playerVanities, playersStats, question, round]);

  return (
    <MatchStateContext.Provider value={matchState}>
      {children}
    </MatchStateContext.Provider>
  );
}
