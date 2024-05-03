import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import { Server } from "socket.io";
import http from "http";
// import https from "https";
import path from "path";

dotenv.config();

const PORT = process.env["PORT"] || 3000;
const API_PREFIX = "/api";

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
app.use(express.static("dist/frontend/dist"));

app.get(API_PREFIX + "/hello", (_req: Request, res: Response) => {
  res.send("Hello, I am hello.");
});

app.get('*', (_req, res) => {
  const FRONTEND_INDEX_PATH = path.resolve(__dirname, "..", "..", "frontend", "dist", "index.html");
  console.log(`Serving frontend index.html from ${FRONTEND_INDEX_PATH}.`);
  res.sendFile(FRONTEND_INDEX_PATH);
});

io.on("connection", (socket) => {
  console.log(`io.connection called. socket.id = ${socket.id}.`);

  socket.on("disconnect", (reason) => {
    console.log(`io.connection.disconnect called and socket.id = ${socket.id}, reason = ${reason}.`);
  });

  socket.on("error", (error) => {
    console.log(`io.connection.error called and socket.id = ${socket.id}, error = ${error}. Disconnecting socket...`);
    socket.disconnect();
  });

});

server.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}.`);
});