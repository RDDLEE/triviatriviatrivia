export enum SocketEvents {
  CONNECTION = "connection",
  DISCONNECT = "disconnect",
  ERROR = "error",

  GAME_ROOM_PLAYER_INIT_READY = "GR::player_init_ready",
  GAME_ROOM_ALL_PLAYER_VANITIES = "GR::all_player_vanities"
}

export type SocketID = string;

// In theory, would be good if TypeScript could force explicit type.
export type PlayerID = string;

export interface Player {
  // PlayerID generated from hash(socket.id).concat(joinTime).
  playerID: PlayerID;
  // Time of join in millis.
  joinTime: number;
  vanity: PlayerVanity | null;
}

export interface PlayerVanity {
  displayName: string;
}

export interface PlayerState {
  // FIXME: Maybe remove from PlayerState and just use playerID as key.
  playerID: PlayerID;

}