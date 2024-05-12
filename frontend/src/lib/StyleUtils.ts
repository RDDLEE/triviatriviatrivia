import { ANSWER_ID_NONE, AnswerID } from "trivia-shared";

export default class StyleUtils {
  public static readonly THEME_CONFIG = {
    titleColor: "#FFE3E0",
    textColor: "#FFE3E0",
  };

  public static readonly DISPLAY_NAME_FONT_WEIGHT = 700;
  public static readonly SCORE_FONT_WEIGHT = 700;

  public static readonly DEFAULT_ACTION_BUTTON_COLOR = "green.7";

  public static readonly POSITIVE_SCORE_COLOR = "green.7";
  public static readonly NEGATIVE_SCORE_COLOR = "red.7";

  private static readonly ANSWER_ID_NONE_COLOR = "dark.7";
  public static readonly ANSWER_SELECTED_UNREVEALED_COLOR = "lime.7";
  private static readonly ANSWER_ID_NOT_FOUND_COLOR = "gray.7";

  private static readonly ANSWER_ID_NONE_TEXT = "~";

  public static readonly convertAnswerIDToText = (answerID: AnswerID): string => {
    if (answerID === ANSWER_ID_NONE) {
      return StyleUtils.ANSWER_ID_NONE_TEXT;
    }
    return answerID.toString();
  };

  private static readonly answerColorMap: Map<AnswerID, string> = new Map([
    [ANSWER_ID_NONE, StyleUtils.ANSWER_ID_NONE_COLOR],
    [0, "blue.7"],
    [1, "orange.7"],
    [2, "yellow.7"],
    [3, "red.7"],
  ]);

  public static readonly getAnswerColor = (answerID: AnswerID): string => {
    const foundColor = StyleUtils.answerColorMap.get(answerID);
    if (foundColor === undefined) {
      return StyleUtils.ANSWER_ID_NOT_FOUND_COLOR;
    }
    return foundColor;
  };

  public static readonly getColorOfScore = (score: number): "green.7" | "red.7" => {
    let scoreColor: "green.7" | "red.7" = StyleUtils.POSITIVE_SCORE_COLOR;
    if (score < 0) {
      scoreColor = StyleUtils.NEGATIVE_SCORE_COLOR;
    }
    return scoreColor;
  };
}
