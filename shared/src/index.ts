export enum SocketEvents {
  CONNECTION = "connection",
  DISCONNECT = "disconnect",
  ERROR = "error",

  // NOTE: Server/Client naming denotes the origin of the event.
  // - i.e. Who emits the event.

  // Section GR.
  // GR Client.
  GR_CLIENT_JOIN_GAME = "GR::join_game",

  // GR Server.
  GR_SERVER_UPDATE_PLAYER_VANITIES = "GR::update_player_vanities",

  // Section GC.
  // GC Client.
  GC_CLIENT_REQUEST_START_MATCH = "GC::request_start_match",

  // GC Server.
  // Section: Match statuses.
  // These statuses should logically match MatchStateStatuses.
  GC_SERVER_WAITING_FOR_MATCH_START = "GC::waiting_for_match_start",
  GC_SERVER_PREPARING_MATCH = "GC::preparing_match",
  GC_SERVER_STARTING_MATCH = "GC::starting_match",
  GC_SERVER_SHOWING_QUESTION = "GC::showing_question",
  GC_SERVER_JUDGING_ANSWER = "GC::judging_answer",
  GC_SERVER_JUDGING_PLAYERS = "GC::judging_players",
  // Endsection: match statuses.

}

// SECTION: GR Event Payloads.
// Corresponds with GR_CLIENT_JOIN_GAME.
export interface GRJoinGame_Payload {
  playerVanity: Server_PlayerVanity;
}

// Corresponds with GR_SERVER_UPDATE_PLAYER_VANITIES.
export interface GRUpdatePlayerVanities_Payload {
  playerVanities: Client_PlayerVanity[];
}

// SECTION: GC Event Payloads.
// Corresponds with GC_CLIENT_REQUEST_START_MATCH.
export interface GCReqestStartMatch_Payload {
  matchSettings: MatchSettings;
}

export interface BaseGCTimedStatusPayload {
  // Time when the status will transition to the next status.
  // A time of -1 denotes that the status will last indeterminately.
  terminationTime: number;
}

// Corresponds with GC_SERVER_WAITING_FOR_MATCH_START.
export interface GCWaitingForMatchStart_Payload {
  // TODO: Attributes.
}

// Corresponds with GC_SERVER_PREPARING_MATCH.
export interface GCPreparingMatch_Payload {
  // TODO: Attributes.
}

// Corresponds with GC_SERVER_STARTING_MATCH.
export interface GCStartingMatch_Payload extends BaseGCTimedStatusPayload {
  // TODO: Attributes.
}

// Corresponds with GC_SERVER_SHOWING_QUESTION.
export interface GCShowingQuestion_Payload extends BaseGCTimedStatusPayload {
  question: Client_StandardQuestion;
}

// Corresponds with GC_SERVER_JUDGING_ANSWER.
export interface GCJudgingAnswer_Payload extends BaseGCTimedStatusPayload {
  // TODO: Attributes.
}

// Corresponds with GC_SERVER_JUDGING_PLAYERS.
export interface GCJudgingPlayers_Payload extends BaseGCTimedStatusPayload {
  // TODO: Attributes.
}

export type SocketID = string;

// In theory, would be good if TypeScript could explicitly require type.
export type PlayerID = string;

export interface Player {
  // PlayerID generated from hash(socket.id).concat(joinTime).
  playerID: PlayerID;
  // Time of join in millis.
  joinTime: number;
  vanity: Server_PlayerVanity | null;
}

export interface Server_PlayerVanity {
  displayName: string;
}

export interface Client_PlayerVanity extends Server_PlayerVanity {
  playerID: PlayerID;
}

export enum MatchStateStatuses {
  // Initial not loaded state.
  NONE = -1,
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
  numNoAnswer: number;
}

export interface Client_PlayerStats extends Server_PlayerStats {
  playerID: PlayerID;
}

// TODO: Implement.
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
  // TODO: Add type, category, difficulty, etc.
  prompt: string;
  choices: Client_StandardAnswerCoice[];
}

export interface Client_StandardAnswerCoice {
  answerID: number;
  text: string;
}

export interface Client_MatchState {
  matchStatus: MatchStateStatuses;
  round: number;
  question: Client_StandardQuestion | null;
  playerVanities: Client_PlayerVanity[];
  playersStats: Client_PlayerStats[];
  // TODO: Answer states, matchSettings?, etc.
}
