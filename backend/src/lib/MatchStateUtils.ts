import { ANSWER_ID_NONE, ANSWER_STATE_ANSWER_TIME_NONE, getMatchSettingsIdentity, MATCH_STAGE_COUNTDOWN_TIME_INDEFINITE, MATCH_STAGE_TERMINATION_TIME_INDEFINITE, MatchStageTimeFrame, MatchStateStages, Server_PlayerAnswerState, Server_PlayerStats } from "trivia-shared";
import { MatchStateSchema } from "../match-state";

export default class MatchStateUtils {
  public static readonly getMatchStateIdentity = (): MatchStateSchema => {
    return {
      matchStage: MatchStateStages.NONE,
      matchStageTimeFrame: MatchStateUtils.getMatchStageTimeFrameIdentity(),
      questions: [],
      round: 0,
      matchHistory: [],
      matchSettings: getMatchSettingsIdentity(),
      playerStats: new Map(),
      playerAnswerStates: new Map(),
    };
  };

  public static readonly getMatchStageTimeFrameIdentity = (): MatchStageTimeFrame => {
    return {
      terminationTime: MATCH_STAGE_TERMINATION_TIME_INDEFINITE,
      countdownTime: MATCH_STAGE_COUNTDOWN_TIME_INDEFINITE,
    };
  };

  public static readonly getServerPlayerStatsIdentity = (): Server_PlayerStats => {
    return {
      score: 0,
      winStreak: 0,
      lossStreak: 0,
      numCorrect: 0,
      numIncorrect: 0,
      numNoAnswer: 0,
    };
  };

  public static readonly getServerPlayerAnswerStateIdentity = (): Server_PlayerAnswerState => {
    return {
      canAnswer: false,
      didSelectAnswer: false,
      selectedAnswerID: ANSWER_ID_NONE,
      answerTime: ANSWER_STATE_ANSWER_TIME_NONE,
    };
  };
}
