export enum SocketEvents {
  CONNECTION = "connection",
  DISCONNECT = "disconnect",
  ERROR = "error",

  GR_INIT_PLAYER_READY = "GR::init_player_ready",
  GR_UPDATE_PLAYER_VANITIES = "GR::update_player_vanities",

  GC_UPDATE_STATE = "GC::update_state",
  GC_START_MATCH = "GC::start_match",
  GC_UPDATE_PLAYER_SCORES = "GC::update_player_scores",
}

export type SocketID = string;

// In theory, would be good if TypeScript could force explicit type.
export type PlayerID = string;

export interface Player {
  // PlayerID generated from hash(socket.id).concat(joinTime).
  playerID: PlayerID;
  // Time of join in millis.
  joinTime: number;
  vanity: PlayerVanity | null;
}

export interface PlayerVanity {
  displayName: string;
}

export enum MatchStateStates {
  // Idle state - waiting for match start.
  WAITING_FOR_MATCH_START = 0,
  // Loading state - fetching questions.
  LOADING_QUESTIONS = 1,
  // Ephemeral state - counting down before showing first question.
  PREPARING_MATCH_START = 2,
  // Ephemeral state - showing question, counting down before revealing answer.
  SHOWING_QUESTION = 3,
  // Ephemeral state - showing answer and evaluating players, 
  // - counting down before showing next question.
  JUDGING_ANSWER = 4,
  // Ephemeral state - judging players - counting down before waiting for next match start.
  JUDING_PLAYERS = 5,
}

export interface Server_PlayerStats {
  score: number;
  winStreak: number;
  lossStreak: number;
  numCorrect: number;
  numIncorrect: number;
}

export interface Client_PlayerStats extends Server_PlayerStats {
  playerID: PlayerID;
}

export interface PlayerAnswerState {
  didSelectAnswer: boolean;
  selectedAnswerID: number;
}

export enum QuestionProvider {
  OPENTDB = "OpenTDB",
}

export interface MatchSettings {
  questionProvider: QuestionProvider;
}

export const getMatchSettingsIdentity = (): MatchSettings => {
  return {
    questionProvider: QuestionProvider.OPENTDB,
  };
};

export interface Client_StandardQuestion {
  // FIXME: Add type, category, difficulty, etc.
  prompt: string;
  choices: Client_StandardAnswerCoice[];
}

export interface Client_StandardAnswerCoice {
  answerID: number;
  text: string;
}
