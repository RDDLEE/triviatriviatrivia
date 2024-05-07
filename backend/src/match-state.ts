import { Client_MatchState, Client_PlayerAnswerState, Client_PlayerStats, MatchSettings, MatchStateStages, PlayerID, Server_PlayerAnswerState, Server_PlayerStats } from "trivia-shared";
import { StandardQuestion } from "./lib/QuestionUtils";
import MatchStateUtils from "./lib/MatchStateUtils";
import GameRoom from "./game-room";

export interface MatchStateSchema {
  matchStage: MatchStateStages;
  questions: StandardQuestion[];
  round: number;
  matchSettings: MatchSettings;
  // TODO: Need to put a max length. Also, enforce stack.
  matchHistory: unknown[];
  playerStats: Map<PlayerID, Server_PlayerStats>;
  playerAnswerStates: Map<PlayerID, Server_PlayerAnswerState>;
}

export default class MatchState {
  private matchStage;
  private questions: StandardQuestion[];
  private round: number;
  private matchSettings: MatchSettings;
  private matchHistory: unknown[];
  private readonly playersStats: Map<PlayerID, Server_PlayerStats>;
  private readonly playerAnswerStates: Map<PlayerID, Server_PlayerAnswerState>;

  constructor() {
    const identity = MatchStateUtils.getMatchStateIdentity();
    this.matchStage = identity.matchStage;
    this.questions = identity.questions;
    this.round = identity.round;
    this.matchSettings = identity.matchSettings;
    this.matchHistory = identity.matchHistory;
    this.playersStats = identity.playerStats;
    this.playerAnswerStates = identity.playerAnswerStates;
  }

  public readonly addNewPlayer = (playerID: PlayerID): void => {
    this.playersStats.set(playerID, MatchStateUtils.getServerPlayerStatsIdentity());
    this.playerAnswerStates.set(playerID, MatchStateUtils.getServerPlayerAnswerStateIdentity());
  };

  public readonly onNewMatch = (matchSettings: MatchSettings): void => {
    const matchStateIdentity = MatchStateUtils.getMatchStateIdentity();
    this.matchStage = MatchStateStages.PREPARING_MATCH_START;
    this.questions = matchStateIdentity.questions;
    this.round = matchStateIdentity.round;
    this.matchSettings = matchSettings;
    this.matchHistory = matchStateIdentity.matchHistory;
    this.playersStats.forEach((_, key) => {
      this.playersStats.set(key, MatchStateUtils.getServerPlayerStatsIdentity());
    });
    this.playerAnswerStates.forEach((_, key) => {
      this.playerAnswerStates.set(key, MatchStateUtils.getServerPlayerAnswerStateIdentity());
    });
  };

  public readonly onWaitForMatchStart = (): void => {
    this.matchStage = MatchStateStages.WAITING_FOR_MATCH_START;
  };

  public readonly onShowQuestion = (): void => {
    this.matchStage = MatchStateStages.SHOWING_QUESTION;
    const answerStateIdentity = MatchStateUtils.getServerPlayerAnswerStateIdentity();
    this.playerAnswerStates.forEach((_, key) => {
      this.playerAnswerStates.set(key, {
        canAnswer: true,
        answerTime: answerStateIdentity.answerTime,
        didSelectAnswer: answerStateIdentity.didSelectAnswer,
        selectedAnswerID: answerStateIdentity.selectedAnswerID,
      });
    });
  }

  public readonly onJudgeAnswers = (): void => {
    this.matchStage = MatchStateStages.JUDGING_ANSWERS;
  };

  public readonly onJudgePlayers = (): void => {
    this.matchStage = MatchStateStages.JUDING_PLAYERS;
  };

  public readonly receiveQuestions = (questions: StandardQuestion[]): void => {
    this.questions.push(...questions);
  };

  // Returns true if answer was submitted.
  public readonly attemptSubmitAnswer = (playerID: PlayerID, selectedAnswerID: number): boolean => {
    const answerState = this.playerAnswerStates.get(playerID);
    if (!answerState.canAnswer) {
      return false;
    }
    if (answerState.didSelectAnswer) {
      return false;
    }
    this.playerAnswerStates.set(playerID, {
      canAnswer: false,
      didSelectAnswer: true,
      selectedAnswerID: selectedAnswerID,
      answerTime: Date.now(),
    });
    return true;
  };

  public readonly getAnswerStateByPlayerID = (playerID: PlayerID): Server_PlayerAnswerState => {
    return this.playerAnswerStates.get(playerID);
  };

  public readonly getClientAnswerStateByPlayerID = (playerID: PlayerID): Client_PlayerAnswerState => {
    return this.makeClientPlayerAnswerState(playerID, this.playerAnswerStates.get(playerID));
  };

  public readonly makeClientPlayerAnswerStates = (): Client_PlayerAnswerState[] => {
    const states: Client_PlayerAnswerState[] = [];
    this.playerAnswerStates.forEach((answerState: Server_PlayerAnswerState, playerID: PlayerID) => {
      states.push(this.makeClientPlayerAnswerState(playerID, answerState));
    });
    return states;
  };

  public readonly makeClientPlayerAnswerState = (playerID: PlayerID, answerState: Server_PlayerAnswerState): Client_PlayerAnswerState => {
    return {
      playerID: playerID,
      canAnswer: answerState.canAnswer,
      didSelectAnswer: answerState.didSelectAnswer,
      selectedAnswerID: answerState.selectedAnswerID,
      answerTime: answerState.answerTime,
    };
  };

  public readonly makeClientPlayersStats = (): Client_PlayerStats[] => {
    const playersStats: Client_PlayerStats[] = [];
    this.playersStats.forEach((stats: Server_PlayerStats, playerID: PlayerID) => {
      playersStats.push({
        playerID: playerID,
        score: stats.score,
        winStreak: stats.winStreak,
        lossStreak: stats.lossStreak,
        numCorrect: stats.numCorrect,
        numIncorrect: stats.numIncorrect,
        numNoAnswer: stats.numNoAnswer,
      });
    });
    return playersStats;
  };

  public readonly getClientMatchState = (gameRoom: GameRoom): Client_MatchState => {
    return {
      matchStage: this.matchStage,
      playerAnswerStates: this.makeClientPlayerAnswerStates(),
      playersStats: this.makeClientPlayersStats(),
      playerVanities: gameRoom.makeClientPlayerVanities(),
      round: this.round,
      question: this.getQuestions[this.round],
    };
  };

  public readonly getRound = (): number => {
    return this.round;
  };

  public readonly incrementRound = (): void => {
    this.round = this.round + 1;
  }

  public readonly getQuestions = (): StandardQuestion[] => {
    return this.questions;
  };

}
