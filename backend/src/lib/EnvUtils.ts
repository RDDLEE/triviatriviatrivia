import dotenv from "dotenv";

export enum EEnvironments {
  NONE = "None",
  STAGING = "Staging",
  PRODUCTION = "Production",
  TEST = "Test"
}

dotenv.config();

export default class EnvUtils {
  private static readonly PORT = process.env["PORT"];

  private static readonly COUNTDOWN_MULTIPLIER = process.env["COUNTDOWN_MULTIPLIER"];

  private static readonly NODE_ENV = process.env["NODE_ENV"];

  private static readonly REQUIRE_SSL = process.env["REQUIRE_SSL"];

  private static readonly ENABLE_CORS = process.env["ENABLE_CORS"];

  private static readonly PROD_CORS_ORIGIN = process.env["CORS_ORIGIN"];

  public static readonly getEnvironment = (): EEnvironments => {
    const NODE_ENV = EnvUtils.NODE_ENV;
    if (NODE_ENV === "staging") {
      return EEnvironments.STAGING;
    } else if (NODE_ENV === "production") {
      return EEnvironments.PRODUCTION;
    } else if (NODE_ENV === "test") {
      return EEnvironments.TEST;
    }
    throw new Error(`NODE_ENV unknown. Received (${EnvUtils.NODE_ENV}).`);
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

  public static readonly getRequireSsl = (): boolean => {
    if (EnvUtils.REQUIRE_SSL === undefined) {
      return true;
    }
    if (EnvUtils.REQUIRE_SSL === "true") {
      return true;
    }
    return false;
  };

  public static readonly getEnableCors = (): boolean => {
    if (EnvUtils.ENABLE_CORS === undefined) {
      return true;
    }
    if (EnvUtils.ENABLE_CORS === "true") {
      return true;
    }
    return false;
  };

  public static readonly getProdCorsOrigin = (): string => {
    if (EnvUtils.PROD_CORS_ORIGIN === undefined) {
      throw new Error("PROD_CORS_ORIGIN undefined.");
    }
    return EnvUtils.PROD_CORS_ORIGIN;
  };

}
