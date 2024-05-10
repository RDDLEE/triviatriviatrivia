import axios from "axios";
import { CreateRoomReturn } from "trivia-shared";

// FIXME: Extract to shared module with backend.
export default class APIUtils {
  public static readonly BASE_PATH = import.meta.env.VITE_BASE_SERVER_URL;

  // FIXME: Extract to shared module.
  private static readonly API_PREFIX = "/api";

  private static readonly BASE_API_PATH = APIUtils.BASE_PATH + APIUtils.API_PREFIX;

  public static readonly createRoom = async (): Promise<string> => {
    // FIXME: Extract to shared module.
    const CREATE_ROOM_PATH = APIUtils.BASE_API_PATH + "/room/create";
    // FIXME: Use ResponseReturn<MyReturn> or AxiosResponse.
    // FIXME: Extract return type to shared module.
    const response = await axios.post<CreateRoomReturn>(CREATE_ROOM_PATH);
    // FIXME: Handle errors.
    // FIXME: Use explicit roomID return.
    return response.data.roomID;
  };

}
