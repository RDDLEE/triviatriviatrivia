import { ANSWER_ID_NONE, AnswerID, Client_MatchState, Client_PlayerAnswerJudgment, Client_PlayerAnswerState, Client_PlayerJudgment, Client_PlayerStats, MatchSettings, MatchStageTimeFrame, MatchStateStages, PlayerID, Server_PlayerAnswerJudgment, Server_PlayerAnswerState, Server_PlayerStats } from "trivia-shared";
import { StandardQuestion } from "./lib/QuestionUtils";
import MatchStateUtils from "./lib/MatchStateUtils";
import GameRoom from "./game-room";

export interface MatchStateSchema {
  matchStage: MatchStateStages;
  matchStageTimeFrame: MatchStageTimeFrame;
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
  private matchStageTimeFrame: MatchStageTimeFrame;
  private questions: StandardQuestion[];
  private round: number;
  private matchSettings: MatchSettings;
  // TODO: Implement matchHistory.
  private matchHistory: unknown[];
  private readonly playersStats: Map<PlayerID, Server_PlayerStats>;
  private readonly playerAnswerStates: Map<PlayerID, Server_PlayerAnswerState>;

  constructor() {
    this.matchStage = MatchStateStages.WAITING_FOR_MATCH_START;
    const identity = MatchStateUtils.getMatchStateIdentity();
    this.matchStageTimeFrame = identity.matchStageTimeFrame;
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

  public readonly removePlayer = (playerID: PlayerID): void => {
    this.playersStats.delete(playerID);
    this.playerAnswerStates.delete(playerID);
  };

  public readonly onNewMatch = (matchSettings: MatchSettings): void => {
    this.matchStage = MatchStateStages.PREPARING_MATCH_START;
    const identity = MatchStateUtils.getMatchStateIdentity();
    this.matchStageTimeFrame = identity.matchStageTimeFrame;
    this.questions = identity.questions;
    this.round = identity.round;
    this.matchSettings = matchSettings;
    this.matchHistory = identity.matchHistory;
    this.playersStats.forEach((_, key) => {
      this.playersStats.set(key, MatchStateUtils.getServerPlayerStatsIdentity());
    });
    this.playerAnswerStates.forEach((_, key) => {
      this.playerAnswerStates.set(key, MatchStateUtils.getServerPlayerAnswerStateIdentity());
    });
  };

  public readonly onShowQuestion = (matchStageTimeFrame: MatchStageTimeFrame): void => {
    this.matchStage = MatchStateStages.SHOWING_QUESTION;
    this.matchStageTimeFrame = matchStageTimeFrame;
    const answerStateIdentity = MatchStateUtils.getServerPlayerAnswerStateIdentity();
    this.playerAnswerStates.forEach((_, key) => {
      this.playerAnswerStates.set(key, {
        canAnswer: true,
        answerTime: answerStateIdentity.answerTime,
        didSelectAnswer: answerStateIdentity.didSelectAnswer,
        selectedAnswerID: answerStateIdentity.selectedAnswerID,
      });
    });
  };

  public readonly onJudgeAnswers = (matchStageTimeFrame: MatchStageTimeFrame): Map<PlayerID, Server_PlayerAnswerJudgment> | null => {
    this.matchStage = MatchStateStages.JUDGING_ANSWERS;
    this.matchStageTimeFrame = matchStageTimeFrame;
    this.playerAnswerStates.forEach((state: Server_PlayerAnswerState, playerID: PlayerID) => {
      this.playerAnswerStates.set(playerID, {
        canAnswer: false,
        didSelectAnswer: state.didSelectAnswer,
        selectedAnswerID: state.selectedAnswerID,
        answerTime: state.answerTime,
      });
    });
    const judgments = this.produceAnswerJudgments();
    if (!judgments) {
      return null;
    }
    this.processAnswerJudgments(judgments);
    return judgments;
  };

  public readonly onJudgePlayers = (matchStageTimeFrame: MatchStageTimeFrame): Client_PlayerJudgment[] => {
    this.matchStage = MatchStateStages.JUDING_PLAYERS;
    this.matchStageTimeFrame = matchStageTimeFrame;
    const playerJudgments: Client_PlayerJudgment[] = [];
    const scoreRanks = this.getPlayerScoreRanks();
    this.playersStats.forEach((_: Server_PlayerStats, playerID: PlayerID) => {
      const scoreRank = scoreRanks.get(playerID);
      if (scoreRank === undefined) {
        return;
      }
      const cPlayerStats = this.makeClientPlayerStats(playerID);
      if (!cPlayerStats) {
        return;
      }
      playerJudgments.push({
        playerID: playerID,
        rank: scoreRank,
        finalPlayerStats: cPlayerStats,
      });
    });
    playerJudgments.sort((a, b) => { return a.rank - b.rank; });
    return playerJudgments;
  };

  public readonly receiveQuestions = (questions: StandardQuestion[]): void => {
    this.questions.push(...questions);
  };

  // Returns true if answer was submitted.
  public readonly attemptSubmitAnswer = (playerID: PlayerID, selectedAnswerID: AnswerID): boolean => {
    const answerState = this.playerAnswerStates.get(playerID);
    if (!answerState) {
      return false;
    }
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

  public readonly produceAnswerJudgments = (): Map<PlayerID, Server_PlayerAnswerJudgment> | null => {
    const judgments: Map<PlayerID, Server_PlayerAnswerJudgment> = new Map();
    const currQuestion = this.getCurrentQuestion();
    if (!currQuestion) {
      return null;
    }
    this.playerAnswerStates.forEach((answerState: Server_PlayerAnswerState, playerID: PlayerID): void => {
      const playerStats = this.playersStats.get(playerID);
      if (!playerStats) {
        return;
      }
      if (!answerState.didSelectAnswer || answerState.selectedAnswerID === ANSWER_ID_NONE) {
        // If did not answer.
        judgments.set(playerID, {
          previousScore: playerStats.score,
          wasCorrect: false,
          scoreModification: this.matchSettings.pointsOnNoAnswer,
          didSelectAnswer: false,
          selectedAnswerID: ANSWER_ID_NONE,
        });
      } else {
        if (answerState.selectedAnswerID === currQuestion.correctAnswerID) {
          // If correct, selected a non-pass answer.
          // TODO: Allow answer time bonus score.
          judgments.set(playerID, {
            previousScore: playerStats.score,
            wasCorrect: true,
            scoreModification: this.matchSettings.pointsOnCorrect,
            didSelectAnswer: true,
            selectedAnswerID: answerState.selectedAnswerID,
          });
        } else {
          // If incorrect, non-pass answer.
          judgments.set(playerID, {
            previousScore: playerStats.score,
            wasCorrect: false,
            scoreModification: this.matchSettings.pointsOnIncorrect,
            didSelectAnswer: true,
            selectedAnswerID: answerState.selectedAnswerID,
          });
        }
      }
    });
    return judgments;
  };

  public readonly processAnswerJudgments = (judgments: Map<PlayerID, Server_PlayerAnswerJudgment>): void => {
    judgments.forEach((judgment: Server_PlayerAnswerJudgment, playerID: PlayerID) => {
      const currStat = this.playersStats.get(playerID);
      if (!currStat) {
        return;
      }
      let newWinStreak = currStat.winStreak;
      let newLossStreak = currStat.lossStreak;
      let newNumCorrect = currStat.numCorrect;
      let newNumIncorrect = currStat.numIncorrect;
      let newNumNoAnswer = currStat.numNoAnswer;
      if (judgment.didSelectAnswer) {
        if (judgment.wasCorrect) {
          newWinStreak = newWinStreak + 1;
          newLossStreak = 0;
          newNumCorrect = newNumCorrect + 1;
        } else {
          newWinStreak = 0;
          newLossStreak = newLossStreak + 1;
          newNumIncorrect = newNumIncorrect + 1;
        }
      } else {
        newWinStreak = 0;
        newLossStreak = 0;
        newNumNoAnswer = newNumNoAnswer + 1;
      }
      this.playersStats.set(playerID, {
        score: currStat.score + judgment.scoreModification,
        winStreak: newWinStreak,
        lossStreak: newLossStreak,
        numCorrect: newNumCorrect,
        numIncorrect: newNumIncorrect,
        numNoAnswer: newNumNoAnswer,
      });
    });
  };

  public readonly getAnswerStateByPlayerID = (playerID: PlayerID): Server_PlayerAnswerState | null => {
    const answerState = this.playerAnswerStates.get(playerID);
    if (!answerState) {
      return null;
    }
    return answerState;
  };

  public readonly getClientAnswerStateByPlayerID = (playerID: PlayerID): Client_PlayerAnswerState | null => {
    const answerState = this.getAnswerStateByPlayerID(playerID);
    if (!answerState) {
      return null;
    }
    return this.makeClientPlayerAnswerState(playerID, answerState);
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
    this.playersStats.forEach((_: Server_PlayerStats, playerID: PlayerID) => {
      const stats = this.makeClientPlayerStats(playerID);
      if (stats) {
        playersStats.push(stats);
      }
    });
    return playersStats;
  };

  public readonly makeClientPlayerStats = (playerID: PlayerID): Client_PlayerStats | null => {
    const stats = this.playersStats.get(playerID);
    if (!stats) {
      return null;
    }
    return {
      playerID: playerID,
      score: stats.score,
      winStreak: stats.winStreak,
      lossStreak: stats.lossStreak,
      numCorrect: stats.numCorrect,
      numIncorrect: stats.numIncorrect,
      numNoAnswer: stats.numNoAnswer,
    };
  };

  public readonly makeClientPlayerAnswerJudgments = (judgments: Map<PlayerID, Server_PlayerAnswerJudgment>): Client_PlayerAnswerJudgment[] => {
    const result: Client_PlayerAnswerJudgment[] = [];
    judgments.forEach((judgment: Server_PlayerAnswerJudgment, playerID: PlayerID) => {
      result.push({
        playerID: playerID,
        previousScore: judgment.previousScore,
        didSelectAnswer: judgment.didSelectAnswer,
        wasCorrect: judgment.wasCorrect,
        scoreModification: judgment.scoreModification,
        selectedAnswerID: judgment.selectedAnswerID,
      });
    });
    return result;
  };

  public readonly getClientMatchState = (gameRoom: GameRoom): Client_MatchState => {
    return {
      matchStage: this.matchStage,
      matchStageTimeFrame: this.matchStageTimeFrame,
      playerAnswerStates: this.makeClientPlayerAnswerStates(),
      playersStats: this.makeClientPlayersStats(),
      playerVanities: gameRoom.makeClientPlayerVanities(),
      round: this.round,
      question: this.getCurrentQuestion(),
    };
  };

  // FIXME: Need to account for ties.
  public readonly getPlayerScoreRanks = (): Map<PlayerID, number> => {
    const scoreRanks: Map<PlayerID, number> = new Map();
    const scoresDescending: number[] = [];
    this.playersStats.forEach((stats: Server_PlayerStats, _: PlayerID) => {
      scoresDescending.push(stats.score);
    });
    scoresDescending.sort((a, b) => { return b - a; });
    this.playersStats.forEach((stats: Server_PlayerStats, playerID: PlayerID) => {
      const index = scoresDescending.findIndex((score: number): boolean => {
        if (score === stats.score) {
          return true;
        }
        return false;
      });
      // FIXME: Handle if index -1.
      // NOTE: Rank is 1 indexed.
      scoreRanks.set(playerID, index + 1);
    });
    return scoreRanks;
  };

  public readonly getRound = (): number => {
    return this.round;
  };

  public readonly incrementRound = (): void => {
    this.round = this.round + 1;
  };

  public readonly getQuestions = (): StandardQuestion[] => {
    return this.questions;
  };

  public readonly getCurrentQuestion = (): StandardQuestion | null => {
    const round = this.round;
    const questions = this.questions;
    if (round >= 0 && round < questions.length) {
      const currQ = this.questions[this.round];
      if (!currQ) {
        return null;
      }
      return currQ;
    }
    return null;
  };
}
