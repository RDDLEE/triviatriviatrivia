import { MantineGradient } from "@mantine/core";
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

  private static readonly ANSWER_ID_NONE_COLOR = "white";
  public static readonly ANSWER_SELECTED_UNREVEALED_COLOR = "lime.7";
  private static readonly ANSWER_ID_NOT_FOUND_COLOR = "gray.7";

  private static readonly ANSWER_ID_NONE_TEXT = "~";

  public static readonly ANSWER_CORRECT_COLOR = "green.7";
  public static readonly ANSWER_INCORRECT_COLOR = "red.7";
  public static readonly ANSWER_NOT_SELECTED_COLOR = "dark.6";

  public static readonly ANSWER_CHOICE_UNSELECTED_COLOR = "cyan.7";
  public static readonly ANSWER_CHOICE_SELECTED_COLOR = "cyan.7";
  public static readonly ANSWER_CHOICE_CORRECT_COLOR = "green.7";

  public static readonly FLOATER_COLOR_BLUE = "#8379DE";
  public static readonly FLOATER_COLOR_RED = "#DE8379";
  public static readonly FLOATER_COLOR_YELLOW = "#79DE83";

  public static readonly convertAnswerIDToText = (answerID: AnswerID): string => {
    if (answerID === ANSWER_ID_NONE) {
      return StyleUtils.ANSWER_ID_NONE_TEXT;
    }
    return (answerID + 1).toString();
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
      // This is just to handle questions with more than 4 answers.
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

  public static readonly getRankGradient = (rank: number): MantineGradient  => {
    const degree = 90;
    if (rank === 1) {
      return {
        from: "#ffdf00",
        to: "#b8860b",
        deg: degree,
      };
    }
    if (rank === 2) {
      return {
        from: "#e3e3e3",
        to: "#a8a9ad",
        deg: degree,
      };
    }
    if (rank === 3) {
      return {
        from: "#cd7f31",
        to: "#6e3a06",
        deg: degree,
      };
    }
    return {
      from: "#6a7a79",
      to: "#2b3638",
      deg: degree,
    };
  };
}
