import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import path from "path";
import { CreateRoomReturn, GetRoomReturn } from "trivia-shared";
import RoomManager from "./src/room-manager";
import EnvUtils from "./src/lib/EnvUtils";

// FIXME: Extract constants to utils.
const API_PREFIX = "/api";
// Frontend directory name should match frontend/package.json build outDir.
const FRONTEND_DIR_PATH = path.resolve(__dirname, "frontend-dist");
console.log(`Using frontend directory from ${FRONTEND_DIR_PATH}.`);
const FRONTEND_INDEX_PATH = path.resolve(FRONTEND_DIR_PATH, "index.html");
console.log(`Serving frontend index.html from ${FRONTEND_INDEX_PATH}.`);

const app: Express = express();

const server = http.createServer(app);
// TODO: Handle CORS.
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(helmet());
// FIXME: Configure CORS by environment.
app.use(cors({ origin: "*" }));
app.use(express.static(FRONTEND_DIR_PATH));

app.get(API_PREFIX + "/hello", (_req: Request, res: Response) => {
  res.send("Hello, I am hello.");
});

app.post(API_PREFIX + "/room/create", (_req, res) => {
  const roomID = RoomManager.createRoom(io);
  // FIXME: Handle response errors/codes.
  res.json({ roomID: roomID } satisfies CreateRoomReturn);
});

app.get(API_PREFIX + "/room/:roomID", (req, res) => {
  const roomID = req.params["roomID"];
  if (roomID === undefined) {
    return;
  }
  const wasFound = RoomManager.checkIfRoomExistsByRoomID(roomID);
  res.json({ wasFound: wasFound } satisfies GetRoomReturn);
});

app.get("*", (_req, res) => {
  res.sendFile(FRONTEND_INDEX_PATH);
});

// TODO: Perhaps store all players/connections
// - to ensure that one player/socket can only be in one room.

server.listen(EnvUtils.getPort(), () => {
  console.log(`[server]: Server is running at http://localhost:${EnvUtils.getPort()}.`);
});