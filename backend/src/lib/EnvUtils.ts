import dotenv from "dotenv";

dotenv.config();

export default class EnvUtils {
  // NOTE: This will be automatically set by Heroku.
  private static readonly PORT = process.env["PORT"];

  private static readonly COUNTDOWN_MULTIPLIER = process.env["COUNTDOWN_MULTIPLIER"];

  public static readonly getPort = (): string => {
    if (EnvUtils.PORT === undefined) {
      throw "env.PORT not specified.";
    }
    return EnvUtils.PORT;
  };

  public static readonly getCountdownMultiplier = (): number => {
    if (EnvUtils.COUNTDOWN_MULTIPLIER === undefined) {
      throw "env.COUNTDOWN_MULTIPLIER not specified.";
    }
    const countdownMultiplier = Number(EnvUtils.COUNTDOWN_MULTIPLIER);
    if (countdownMultiplier <= 0) {
      throw "countdownMultiplier <= 0.";
    }
    return Number(EnvUtils.COUNTDOWN_MULTIPLIER);
  };

}
