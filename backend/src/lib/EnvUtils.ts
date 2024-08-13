import dotenv from "dotenv";

dotenv.config();

export default class EnvUtils {
  private static readonly PORT = process.env["PORT"];

  private static readonly COUNTDOWN_MULTIPLIER = process.env["COUNTDOWN_MULTIPLIER"];

  public static readonly getPort = (): string => {
    if (EnvUtils.PORT === undefined) {
      return "3000";
    }
    return EnvUtils.PORT;
  };

  public static readonly getCountdownMultiplier = (): number => {
    if (EnvUtils.COUNTDOWN_MULTIPLIER === undefined) {
      return 1;
    }
    const countdownMultiplier = Number(EnvUtils.COUNTDOWN_MULTIPLIER);
    if (countdownMultiplier <= 0) {
      console.warn(`COUNTDOWN_MULTIPLIER <= 0. Given value ${EnvUtils.COUNTDOWN_MULTIPLIER}. Defaulting to 1.`);
      return 1;
    }
    return Number(EnvUtils.COUNTDOWN_MULTIPLIER);
  };

}
