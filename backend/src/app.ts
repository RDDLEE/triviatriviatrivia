import { Request, Response } from "express";
import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import EnvUtils, { EEnvironments } from "../src/lib/EnvUtils";
import AppUtils from "./lib/AppUtils";
import { CreateRoomReturn, GetRoomReturn } from "trivia-shared";
import RoomManager from "../src/room-manager";
import RouteUtils from "./lib/RouteUtils";
import fs from "fs";

const app: Express = express();

console.log(`Serving index.html at ${AppUtils.FRONTEND_INDEX_PATH}.`);
if (!fs.existsSync(AppUtils.FRONTEND_INDEX_PATH)) {
  if (EnvUtils.getEnvironment() === EEnvironments.TEST) {
    console.error("Failed to locate index.html.");
  } else {
    throw "Failed to locate index.html.";
  }
}

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

app.get(RouteUtils.HOME_PAGE_PATH, (_req, res) => {
  res.sendFile(AppUtils.FRONTEND_INDEX_PATH);
});

app.get(RouteUtils.ROOM_PAGE_PATH, (_req, res) => {
  res.sendFile(AppUtils.FRONTEND_INDEX_PATH);
});

app.get("*", (_req, res) => {
  // TODO: Make 404 page.
  res.sendStatus(404);
});

export default app;
