import { Client_PlayerAnswerState, PlayerID } from "trivia-shared";
import { MatchStateContextSchema } from "../components/MatchStateProvider/MatchStateProvider";

export default class MatchStateUtils {
  public static readonly getPlayerAnswerStateByPlayerID = (matchStateContext: MatchStateContextSchema | null, playerID: PlayerID): Client_PlayerAnswerState | null => {
    if (!matchStateContext) {
      // FIXME: Log/Throw.
      return null;
    }
    const foundAnswerState = matchStateContext.playerAnswerStates.find(
      (answerState: Client_PlayerAnswerState): boolean => {
        if (answerState.playerID === playerID) {
          return true;
        }
        return false;
      }
    );
    if (!foundAnswerState) {
      // FIXME: Log/Throw.
      return null;
    }
    return foundAnswerState;
  };

  public static readonly getIndexOfAnswerStateByPlayerID = (matchStateContext: MatchStateContextSchema | null, playerID: PlayerID): number => {
    if (!matchStateContext) {
      // FIXME: Log/Throw.
      return -1;
    }
    const index = matchStateContext.playerAnswerStates.findIndex((answerState) => {
      if (answerState.playerID === playerID) {
        return true;
      }
      return false;
    });
    // FIXME: Should check if index < 0, and log/throw.
    return index;
  };
}
