import React, { createContext, useMemo, useState } from "react";
import { MatchStateStatuses, Client_StandardQuestion, Client_MatchState, Client_PlayerVanity, Client_PlayerStats } from "trivia-shared";

export interface MatchStateContextSchema extends Client_MatchState {
  setMatchStatus: React.Dispatch<React.SetStateAction<MatchStateStatuses>>;
  setRound: React.Dispatch<React.SetStateAction<number>>;
  setQuestion: React.Dispatch<React.SetStateAction<Client_StandardQuestion | null>>;
  setPlayerVanities: React.Dispatch<React.SetStateAction<Client_PlayerVanity[]>>;
  setPlayersStats: React.Dispatch<React.SetStateAction<Client_PlayerStats[]>>;
}

export const MatchStateContext = createContext<MatchStateContextSchema | null>(null);

export default function MatchStateProvider({ children }: Readonly<{ children: React.ReactNode; }>) {
  // Could use a Reducer.
  const [matchStatus, setMatchStatus] = useState<MatchStateStatuses>(MatchStateStatuses.NONE);
  // FIXME: Make const default.
  // Could use a Reducer.
  const [round, setRound] = useState<number>(0);
  const [question, setQuestion] = useState<Client_StandardQuestion | null>(null);
  const [playerVanities, setPlayerVanities] = useState<Client_PlayerVanity[]>([]);
  const [playersStats, setPlayersStats] = useState<Client_PlayerStats[]>([]);

  const matchState = useMemo<MatchStateContextSchema>(() => {
    return {
      matchStatus: matchStatus,
      setMatchStatus: setMatchStatus,
      round: round,
      setRound: setRound,
      question: question,
      setQuestion: setQuestion,
      playerVanities: playerVanities,
      setPlayerVanities: setPlayerVanities,
      playersStats: playersStats,
      setPlayersStats: setPlayersStats,
    };
  }, [matchStatus, playerVanities, playersStats, question, round]);

  return (
    <MatchStateContext.Provider value={matchState}>
      {children}
    </MatchStateContext.Provider>
  );
}
