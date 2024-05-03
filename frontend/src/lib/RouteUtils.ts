export default class RouteUtils {
  public static readonly HOME_PATH = "/";

  public static readonly PARAM_ROOM_ID = "roomID";
  public static readonly ROOM_PATH = `/:${RouteUtils.PARAM_ROOM_ID}`;
}
