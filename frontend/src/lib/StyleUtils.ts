export default class StyleUtils {
  public static readonly DISPLAY_NAME_FONT_WEIGHT = 700;
  public static readonly SCORE_FONT_WEIGHT = 700;

  public static readonly POSITIVE_SCORE_COLOR = "green";
  public static readonly NEGATIVE_SCORE_COLOR = "red";

  public static readonly getColorOfScore = (score: number): "green" | "red" => {
    let scoreColor: "green" | "red" = StyleUtils.POSITIVE_SCORE_COLOR;
    if (score < 0) {
      scoreColor = StyleUtils.NEGATIVE_SCORE_COLOR;
    }
    return scoreColor;
  };
}
