import { io } from "socket.io-client";

// FIXME: File likely unnecessary. Only used in RoomPage.

const socket = io(import.meta.env.VITE_BASE_SERVER_URL, {
  autoConnect: false,
});

export default socket;