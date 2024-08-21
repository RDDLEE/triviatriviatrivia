import { Server } from "socket.io";
import http from "http";
import EnvUtils from "./src/lib/EnvUtils";
import app from "./src/app";
import AppUtils from "./src/lib/AppUtils";

console.log("Server running 1.0.2.");

// Deployed with Heroku. Heroku assumes HTTP traffic.
const server = http.createServer(app);
const ioServer = new Server(server, {
  cors: AppUtils.configureCORS(),
});
AppUtils.setIoServer(ioServer);

server.listen(EnvUtils.getPort(), () => {
  console.log(`[server]: Server is running at on port: (${EnvUtils.getPort()}).`);
});