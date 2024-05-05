import { getMatchSettingsIdentity, MatchSettings, MatchStateStates, PlayerID, Server_PlayerStats } from "trivia-shared";
import { StandardQuestion } from "./lib/QuestionUtils";

export interface MatchStateSchema {
  state: MatchStateStates;
  questions: StandardQuestion[];
  round: number;
  matchSettings: MatchSettings;
  matchHistory: unknown[];
  playerStats: Map<PlayerID, Server_PlayerStats>;
  // FIXME: Need to put a max length. Also, enforce stack.
}

export default class MatchState {
  private state: MatchStateStates;
  private questions: StandardQuestion[];
  private round: number;
  private matchSettings: MatchSettings;
  private matchHistory: unknown[];
  private readonly playerStats: Map<PlayerID, Server_PlayerStats>;
  // TODO: PlayerAnswerStates.

  constructor() {
    const identity = MatchState.getMatchStateIdentity();
    this.state = identity.state;
    this.questions = identity.questions;
    this.round = identity.round;
    this.matchSettings = identity.matchSettings;
    this.matchHistory = identity.matchHistory;
    this.playerStats = identity.playerStats;
  }

  // FIXME: Extract to MatchStateUtils.
  public static readonly getMatchStateIdentity = (): MatchStateSchema => {
    return {
      state: MatchStateStates.WAITING_FOR_MATCH_START,
      questions: [],
      round: 0,
      matchHistory: [],
      matchSettings: getMatchSettingsIdentity(),
      playerStats: new Map(),
    };
  };

  private static readonly getServerPlayerStatsIdentity = (): Server_PlayerStats => {
    return {
      score: 0,
      winStreak: 0,
      lossStreak: 0,
      numCorrect: 0,
      numIncorrect: 0,
    };
  };

  public readonly addNewPlayer = (playerID: PlayerID): void => {
    this.playerStats.set(playerID, MatchState.getServerPlayerStatsIdentity());
  };

  public readonly onNewMatch = (matchSettings: MatchSettings): void => {
    const matchStateIdentity = MatchState.getMatchStateIdentity();
    this.state = MatchStateStates.LOADING_QUESTIONS;
    this.questions = matchStateIdentity.questions;
    this.round = matchStateIdentity.round;
    this.matchSettings = matchSettings;
    this.matchHistory = matchStateIdentity.matchHistory;
    this.playerStats.forEach((_, key) => {
      this.playerStats.set(key, MatchState.getServerPlayerStatsIdentity());
    });
  };

  public readonly receiveQuestions = (questions: StandardQuestion[]): void => {
    this.questions.push(...questions);
  };

  public readonly updateMatchStateState = (newState: MatchStateStates): void => {
    this.state = newState;
  };

  public readonly getMatchStateState = (): MatchStateStates => {
    return this.state;
  };

}
