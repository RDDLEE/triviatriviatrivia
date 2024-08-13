import cors from "cors";
import EnvUtils, { EEnvironments } from "./EnvUtils";

export default class APIUtils {
  public static readonly API_PREFIX = "/api";

  public static readonly HELLO_PATH = APIUtils.API_PREFIX + "/hello";

  public static readonly CREATE_ROOM_PATH = APIUtils.API_PREFIX + "/room/create";

  public static readonly ROOM_ID_PARAM = "roomID";

  public static readonly GET_ROOM_PATH = APIUtils.API_PREFIX + `/room/:${APIUtils.ROOM_ID_PARAM}`;

  public static readonly configureCORS = (): cors.CorsOptions => {
    const environment = EnvUtils.getEnvironment();
    if (environment === EEnvironments.PRODUCTION) {
      return {
        origin: EnvUtils.getProdCorsOrigin(),
      };
    } else if (environment === EEnvironments.STAGING) {
      return {
        origin: "*",
      };
    }
    throw new Error(`Failed to configure cors due to invalid environment: (${environment}).`);
  };
}
