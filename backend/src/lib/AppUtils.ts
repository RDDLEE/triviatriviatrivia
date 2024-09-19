import path from "path";
import { Server } from "socket.io";
import EnvUtils from "./EnvUtils";
import cors from "cors";

export default class AppUtils {
  // NOTE: Frontend directory name should match frontend/package.json build outDir.
  public static readonly FRONTEND_DIR_PATH = path.resolve(__dirname, "frontend-dist");
  public static readonly FRONTEND_INDEX_PATH = path.resolve(AppUtils.FRONTEND_DIR_PATH, "index.html");

  private static ioServer: Server | null = null;

  public static getIoServer = (): Server | null => {
    return AppUtils.ioServer;
  };

  public static setIoServer = (ioServer: Server): void => {
    AppUtils.ioServer = ioServer;
  };

  public static readonly configureCORS = (): cors.CorsOptions => {
    const enableCors = EnvUtils.getEnableCors();
    if (enableCors) {
      return {
        origin: EnvUtils.getProdCorsOrigin(),
      };
    } else {
      return {
        origin: "*",
      };
    }
  };

}