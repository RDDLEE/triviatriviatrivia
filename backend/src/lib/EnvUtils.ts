import dotenv from "dotenv";

export enum EEnvironments {
  NONE = "None",
  STAGING = "Staging",
  PRODUCTION = "Production"
}

dotenv.config();

export default class EnvUtils {
  private static readonly PORT = process.env["PORT"];

  private static readonly COUNTDOWN_MULTIPLIER = process.env["COUNTDOWN_MULTIPLIER"];

  private static readonly NODE_ENV = process.env["NODE_ENV"];

  private static readonly PROD_CORS_ORIGIN = process.env["CORS_ORIGIN"];

  public static readonly getEnvironment = (): EEnvironments => {
    const NODE_ENV = EnvUtils.NODE_ENV;
    if (NODE_ENV === "staging") {
      return EEnvironments.STAGING;
    } else if (NODE_ENV === "production") {
      return EEnvironments.PRODUCTION;
    }
    throw new Error(`NODE_ENV unknown. Received ${EnvUtils.NODE_ENV}.`);
  };

  public static readonly getProdCorsOrigin = (): string => {
    if (EnvUtils.PROD_CORS_ORIGIN === undefined) {
      throw new Error("PROD_CORS_ORIGIN undefined.");
    }
    return EnvUtils.PROD_CORS_ORIGIN;
  };

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
