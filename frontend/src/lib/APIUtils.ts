import axios from "axios";
import { CreateRoomReturn, GetRoomReturn, RoomID } from "trivia-shared";

export default class APIUtils {
  private static readonly API_PREFIX = "/api";

  public static readonly createRoom = async (): Promise<string> => {
    const PATH = APIUtils.API_PREFIX + "/room/create";
    // FIXME: Use ResponseReturn<MyReturn> or AxiosResponse.
    const response = await axios.post<CreateRoomReturn>(PATH);
    // FIXME: Handle errors.
    return response.data.roomID;
  };

  public static readonly getRoomByRoomID = async (roomID: RoomID): Promise<boolean> => {
    const PATH = APIUtils.API_PREFIX + "/room/" + encodeURIComponent(roomID);
    // FIXME: Use ResponseReturn<MyReturn> or AxiosResponse.
    const response = await axios.get<GetRoomReturn>(PATH);
    // FIXME: Handle errors.
    return response.data.wasFound;
  };

}
