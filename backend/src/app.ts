import { Request, Response } from "express";
import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import EnvUtils from "../src/lib/EnvUtils";
import AppUtils from "./lib/AppUtils";
import { CreateRoomReturn, GetRoomReturn } from "trivia-shared";
import RoomManager from "../src/room-manager";
import RouteUtils from "./lib/RouteUtils";

const app: Express = express();

app.enable("trust proxy");
if (EnvUtils.getRequireSsl()) {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      res.redirect(`https://${req.header("host")}${req.url}`);
    } else {
      next();
    }
  });
}
app.use(helmet());
app.use(cors(AppUtils.configureCORS()));
app.use(express.static(AppUtils.FRONTEND_DIR_PATH));

app.get(RouteUtils.HELLO_PATH, (_req: Request, res: Response) => {
  res.send("Hello.");
});

app.post(RouteUtils.CREATE_ROOM_PATH, (_req, res) => {
  try {
    const roomID = RoomManager.createRoom(AppUtils.getIoServer());
    // FIXME: Handle response errors/codes.
    res.json({ roomID: roomID } satisfies CreateRoomReturn);
  } catch (_error) {
    res.sendStatus(500);
  }
});

app.get(RouteUtils.GET_ROOM_PATH, (req, res) => {
  const roomID = req.params[RouteUtils.ROOM_ID_PARAM];
  if (roomID === undefined) {
    // TODO: Handle.
    return;
  }
  const wasFound = RoomManager.checkIfRoomExistsByRoomID(roomID);
  res.json({ wasFound: wasFound } satisfies GetRoomReturn);
});

// FIXME: Make const in PageUtils.
app.get(RouteUtils.HOME_PAGE_PATH, (_req, res) => {
  res.sendFile(
    AppUtils.FRONTEND_INDEX_PATH,
    () => {
      res.sendStatus(500);
    }
  );
});

app.get(RouteUtils.ROOM_PAGE_PATH, (_req, res) => {
  res.sendFile(
    AppUtils.FRONTEND_INDEX_PATH,
    () => {
      res.sendStatus(500);
    }
  );
});

app.get("*", (_req, res) => {
  res.status(404).send("404: Page not found.");
});

export default app;
