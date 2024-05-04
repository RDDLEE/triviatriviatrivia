import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import { Server } from "socket.io";
import http from "http";
// import https from "https";
import cors from "cors";
import path from "path";
import GameRoom from "./src/game-room";
import RoomUtils from "./src/lib/RoomUtils";

dotenv.config();

const PORT = process.env["PORT"];
if (PORT === undefined) {
  throw "env.PORT not specified.";
}
const API_PREFIX = "/api";
const FRONTEND_DIR_PATH = path.resolve(__dirname, "frontend");
const FRONTEND_INDEX_PATH = path.resolve(FRONTEND_DIR_PATH, "index.html");
console.log(`Serving frontend index.html from ${FRONTEND_INDEX_PATH}.`);

const app: Express = express();

const server = http.createServer(app);
// TODO: Handle HTTPS.
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

// FIXME: Make map?
const gameRooms: GameRoom[] = [];

app.get(API_PREFIX + "/hello", (_req: Request, res: Response) => {
  res.send("Hello, I am hello.");
});

app.post(API_PREFIX + "/room/create", (_req, res) => {
  const roomID = RoomUtils.generateRoomID();
  // FIXME: Check if roomID is taken.
  console.log(`/room/create called. roomID = ${roomID}.`);
  const newRoom = new GameRoom(roomID, io);
  gameRooms.push(newRoom);
  res.json({ roomID: roomID });
});

app.get('*', (req, res) => {
  res.sendFile(FRONTEND_INDEX_PATH);
});

// TODO: Perhaps store all players/connections 
// - to ensure that one player/socket can only be in one room.

server.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}.`);
});