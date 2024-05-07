export enum SocketEvents {
  CONNECTION = "connection",
  DISCONNECT = "disconnect",
  ERROR = "error",

  // NOTE: Server/Client naming denotes the origin of the event.
  // - i.e. Who emits the event.

  // Section GR.
  // GameRoom Client.
  GR_CLIENT_JOIN_GAME = "GR::join_game",

  // GameRoom Server.
  GR_SERVER_UPDATE_PLAYER_VANITIES = "GR::update_player_vanities",

  // Section GC.
  // GameController Client.
  GC_CLIENT_REQUEST_START_MATCH = "GC::request_start_match",
  GC_CLIENT_ATTEMPT_SUBMIT_ANSWER = "GC::attempt_submit_answer",

  // GameController Server.
  GC_SERVER_RECEIVE_PLAYER_ID = "GC::receive_player_id",
  GC_SERVER_ANSWER_SUBMITTED = "GC::answer_submitted",
  GC_SERVER_REFRESH_MATCH_STATE = "GC::refresh_match_state",
  // Section: Match statuses.
  // These statuses should logically match MatchStateStatuses.
  GC_SERVER_WAITING_FOR_MATCH_START = "GC::waiting_for_match_start",
  GC_SERVER_PREPARING_MATCH = "GC::preparing_match",
  GC_SERVER_STARTING_MATCH = "GC::starting_match",
  GC_SERVER_SHOWING_QUESTION = "GC::showing_question",
  GC_SERVER_JUDGING_ANSWERS = "GC::judging_answers",
  GC_SERVER_JUDGING_PLAYERS = "GC::judging_players",
  // Endsection: Match statuses.
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

// Corresponds with GC_SERVER_RECEIVE_PLAYER_ID.
export interface GCReceivePlayerID_Payload {
  playerID: PlayerID;
}

// Correponds with GC_SERVER_ANSWER_SUBMITTED.
export interface GCAnswerSubmitted_Payload {
  answerState: Client_PlayerAnswerState;
}

// Correponds with GC_SERVER_REFRESH_MATCH_STATE.
export interface GCRefreshMatchState_Payload {
  matchState: Client_MatchState;
}

// Corresponds with GC_CLIENT_ATTEMPT_SUBMIT_ANSWER.
export interface GCAttemptSubmitAnswer_Payload {
  selectedAnswerID: number;
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

// Corresponds with GC_SERVER_JUDGING_ANSWERS.
export interface GCJudgingAnswers_Payload extends BaseGCTimedStatusPayload {
  // TODO: Attributes.
}

// Corresponds with GC_SERVER_JUDGING_PLAYERS.
export interface GCJudgingPlayers_Payload extends BaseGCTimedStatusPayload {
  // TODO: Attributes.
}

export type SocketID = string;

// In theory, would be good if TypeScript could explicitly require type.
export type PlayerID = string;

export const PLAYER_ID_NONE = "-1";

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
  // Ephemeral state - counting down before showing first question.
  PREPARING_MATCH_START = 1,
  // Ephemeral state - showing question, counting down before revealing answer.
  SHOWING_QUESTION = 2,
  // Ephemeral state - showing answer and evaluating players, 
  // - counting down before showing next question.
  JUDGING_ANSWERS = 3,
  // Ephemeral state - judging players - counting down before waiting for next match start.
  JUDING_PLAYERS = 4,
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

export const ANSWER_STATE_ANSWER_TIME_NONE = -1;

export const ANSWER_ID_NONE = -1;

export const ANSWER_ID_NO_ANSWER = 99;

export interface Server_PlayerAnswerState {
  canAnswer: boolean;
  didSelectAnswer: boolean;
  selectedAnswerID: number;
  // Time (millis) of when the answer was registered (by the server).
  answerTime: number;
}

export interface Client_PlayerAnswerState {
  playerID: PlayerID;
  canAnswer: boolean;
  didSelectAnswer: boolean;
  // Broadcasting selectedAnswerID presents an opportunity for cheating.
  selectedAnswerID: number;
  answerTime: number;
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
  // Consider changing the arrays to maps on the client.
  playerVanities: Client_PlayerVanity[];
  playersStats: Client_PlayerStats[];
  playerAnswerStates: Client_PlayerAnswerState[];
}

// REST API.
export interface CreateRoomReturn {
  roomID: string;
}
