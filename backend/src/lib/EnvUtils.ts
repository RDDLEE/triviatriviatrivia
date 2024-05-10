import dotenv from "dotenv";

dotenv.config();

export default class EnvUtils {
  private static readonly PORT = process.env["PORT"];

  private static readonly COUNTDOWN_MULTIPLIER = Number(process.env["COUNTDOWN_MULTIPLIER"]);

  public static readonly checkEnvVars = (): void => {
    if (EnvUtils.PORT === undefined) {
      throw "env.PORT not specified.";
    }
    if (EnvUtils.COUNTDOWN_MULTIPLIER === undefined) {
      throw "env.COUNTDOWN_MULTIPLIER not specified.";
    }
  };

  public static readonly getPort = (): string => {
    return EnvUtils.PORT;
  };

  public static readonly getCountdownMultiplier = (): number => {
    return EnvUtils.COUNTDOWN_MULTIPLIER;
  };

}
