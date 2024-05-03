import { io } from "socket.io-client";

// FIXME: File likely unnecessary.
// - Connection likely can/must only join dynamic namespace.

const generateSocketURL = (): string | undefined => {
  if (import.meta.env.PROD) {
    // "undefined" means the URL will be computed from the `window.location` object.
    // @see: https://socket.io/how-to/use-with-react.
    return undefined;
  }
  // FIXME: Make environment variable.
  return "http://localhost:3000";
};

// @ts-expect-error: undefined is acceptable.
const socket = io(generateSocketURL(), {
  autoConnect: false,
});

export default socket;