import axios from "axios";
import { CreateRoomReturn } from "trivia-shared";

export default class APIUtils {
  // FIXME: Extract to shared module.
  private static readonly API_PREFIX = "/api";

  public static readonly createRoom = async (): Promise<string> => {
    // FIXME: Extract to shared module.
    const CREATE_ROOM_PATH = APIUtils.API_PREFIX + "/room/create";
    // FIXME: Use ResponseReturn<MyReturn> or AxiosResponse.
    // FIXME: Extract return type to shared module.
    const response = await axios.post<CreateRoomReturn>(CREATE_ROOM_PATH);
    // FIXME: Handle errors.
    // FIXME: Use explicit roomID return.
    return response.data.roomID;
  };

}
