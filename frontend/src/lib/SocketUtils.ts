import { io } from "socket.io-client";

// const generateSocketURL = (): string | undefined => {
//   if (import.meta.env.PROD) {
//     // "undefined" means the URL will be computed from the `window.location` object.
//     // @see: https://socket.io/how-to/use-with-react.
//     return undefined;
//   }
//   return "http://localhost:3000";
// }

const socket = io("http://localhost:3000", {
  autoConnect: false,
});

export default socket;