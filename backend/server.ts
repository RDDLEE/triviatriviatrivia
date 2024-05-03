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
// import { SocketEvents } from "../shared/globals";

dotenv.config();

const PORT = process.env["PORT"];
if (PORT === undefined) {
  throw "env.PORT not specified.";
}
const API_PREFIX = "/api";
const FRONTEND_INDEX_PATH = path.resolve(__dirname, "..", "..", "frontend", "dist", "index.html");
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
app.use(cors({
  origin: "*"
}));
app.use(express.static("dist/frontend/dist"));

// FIXME: Make map?
const gameRooms: GameRoom[] = [];

app.get(API_PREFIX + "/hello", (_req: Request, res: Response) => {
  res.send("Hello, I am hello.");
});

app.get('*', (_req, res) => {
  res.sendFile(FRONTEND_INDEX_PATH);
});

app.post(API_PREFIX + "/room/create", (_req, res) => {
  const roomID = RoomUtils.generateRoomID();
  // FIXME: Check if roomID is taken.
  console.log(`/room/create called. roomID = ${roomID}.`);
  const newRoom = new GameRoom(roomID, io);
  gameRooms.push(newRoom);
  res.json({ roomID: roomID });
});

/* io.on("connection", (socket) => {
  console.log(`io.connection called. socket.id = ${socket.id}.`);

  socket.on("disconnect", (reason) => {
    console.log(`io.connection.disconnect called and socket.id = ${socket.id}, reason = ${reason}.`);
  });

  socket.on("error", (error) => {
    console.log(`io.connection.error called and socket.id = ${socket.id}, error = ${error}. Disconnecting socket...`);
    socket.disconnect();
  });
}); */

server.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}.`);
});