export default class RouteUtils {
  public static readonly API_PREFIX = "/api";

  public static readonly HELLO_PATH = RouteUtils.API_PREFIX + "/hello";

  public static readonly CREATE_ROOM_PATH = RouteUtils.API_PREFIX + "/room/create";

  public static readonly ROOM_ID_PARAM = "roomID";

  public static readonly GET_ROOM_PATH = RouteUtils.API_PREFIX + `/room/:${RouteUtils.ROOM_ID_PARAM}`;

  public static readonly HOME_PAGE_PATH = "/";

  public static readonly ROOM_PAGE_PATH = `/r/:${RouteUtils.ROOM_ID_PARAM}`;

}
