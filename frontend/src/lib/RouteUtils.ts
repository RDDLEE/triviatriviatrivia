// TODO: Should remove to shared.
export default class RouteUtils {
  public static readonly HOME_PATH = "/";

  private static readonly PARAM_ROOM_ID = "roomID";
  public static readonly ROOM_PATH = `/r/:${RouteUtils.PARAM_ROOM_ID}`;
}
