// FIXME: This should probably be a npm module.

export enum SocketEvents {
  CONNECTION = "connection",
}

export interface Player {
  // NOTE: SocketID should not be used for player persistence.
  socketID: string;
  name: string;
}