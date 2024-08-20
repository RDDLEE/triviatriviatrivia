import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import path from "path";
import { CreateRoomReturn, GetRoomReturn } from "trivia-shared";
import RoomManager from "./src/room-manager";
import EnvUtils, { EEnvironments } from "./src/lib/EnvUtils";
import APIUtils from "./src/lib/APIUtils";

console.log("Server running 1.0.1.");

// NOTE: Frontend directory name should match frontend/package.json build outDir.
const FRONTEND_DIR_PATH = path.resolve(__dirname, "frontend-dist");
console.log(`Using frontend directory from ${FRONTEND_DIR_PATH}.`);
const FRONTEND_INDEX_PATH = path.resolve(FRONTEND_DIR_PATH, "index.html");
console.log(`Serving frontend index.html from ${FRONTEND_INDEX_PATH}.`);

const app: Express = express();

app.enable("trust proxy");
if (EnvUtils.getEnvironment() === EEnvironments.PRODUCTION) {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      res.redirect(`https://${req.header("host")}${req.url}`);
    } else {
      next();
    }
  });
}
app.use(helmet());
app.use(cors(APIUtils.configureCORS()));
app.use(express.static(FRONTEND_DIR_PATH));

const server = http.createServer(app);
const io = new Server(server, {
  cors: APIUtils.configureCORS(),
});

app.get(APIUtils.HELLO_PATH, (_req: Request, res: Response) => {
  res.send("Hello.");
});

app.post(APIUtils.CREATE_ROOM_PATH, (_req, res) => {
  const roomID = RoomManager.createRoom(io);
  // FIXME: Handle response errors/codes.
  res.json({ roomID: roomID } satisfies CreateRoomReturn);
});

app.get(APIUtils.GET_ROOM_PATH, (req, res) => {
  const roomID = req.params[APIUtils.ROOM_ID_PARAM];
  if (roomID === undefined) {
    // TODO: Handle.
    return;
  }
  const wasFound = RoomManager.checkIfRoomExistsByRoomID(roomID);
  res.json({ wasFound: wasFound } satisfies GetRoomReturn);
});

app.get("/", (_req, res) => {
  res.sendFile(FRONTEND_INDEX_PATH);
});

app.get("/:roomID", (_req, res) => {
  res.sendFile(FRONTEND_INDEX_PATH);
});

app.get("*", (_req, res) => {
  res.status(404).send("404: Page not found.");
});

server.listen(EnvUtils.getPort(), () => {
  console.log(`[server]: Server is running at http://localhost:${EnvUtils.getPort()}.`);
});