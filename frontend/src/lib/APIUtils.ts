import axios from "axios";

// FIXME: Extract to shared module with backend.
export default class APIUtils {
  private static readonly initBasePath = (): string => {
    if (import.meta.env.PROD) {
      // FIXME: Maybe always use HTTPS for PROD.
      return window.location.protocol + "//" + window.location.host;
    }
    // FIXME: Make environment variable.
    return "http://localhost:3000";
  };

  // FIXME: Extract to shared module.
  private static readonly API_PREFIX = "/api";

  private static readonly BASE_PATH = APIUtils.initBasePath() + APIUtils.API_PREFIX;

  public static readonly createRoom = async (): Promise<string> => {
    // FIXME: Extract to shared module.
    const CREATE_ROOM_PATH = APIUtils.BASE_PATH + "/room/create";
    console.log(`APIUtils.createRoom called and CREATE_ROOM_PATH = ${CREATE_ROOM_PATH}.`);
    // FIXME: Use ResponseReturn<MyReturn> or AxiosResponse.
    // FIXME: Extract return type to shared module.
    const response = await axios.post<unknown>(CREATE_ROOM_PATH);
    // FIXME: Handle errors.
    // FIXME: Use explicit roomID return.
    // @ts-expect-error: Will fix later.
    return response.data["roomID"] as string;
  };

}
