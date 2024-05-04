import { Server } from "socket.io";
import GameState from "./game-state";
import RoomUtils from "./lib/RoomUtils";
import CryptoUtils from "./lib/CryptoUtils";
import { Player, PlayerID, PlayerVanity, SocketEvents, SocketID } from "trivia-shared";

export default class GameRoom {
  private readonly roomID: string;

  private readonly ioServer: Server;

  // K: SocketID, V: Player.
  private readonly players: Map<SocketID, Player> = new Map();

  // TODO: Terminate old GameRooms.
  private readonly creationTime: number;

  private readonly gameState: GameState;

  constructor(roomID: string, ioServer: Server) {
    this.roomID = roomID;
    this.ioServer = ioServer;
    this.creationTime = Date.now();
    this.gameState = new GameState(roomID, ioServer);

    ioServer.of(roomID).on(SocketEvents.CONNECTION, (socket) => {
      console.log(`GameRoom.connection called and socket.id = ${socket.id}.`);
      // Store connected players, but defer handling until the player explicity 
      // - requests to join.
      // FIXME: Check max players.
      const joinTime = Date.now();
      const playerID = CryptoUtils.generatePlayerID(socket.id, joinTime);
      this.players.set(socket.id, {
        playerID: playerID,
        joinTime: joinTime,
        vanity: null
      });

      // Core player ingress.
      // FIXME: Init Player Ready params.
      socket.on(SocketEvents.GAME_ROOM_PLAYER_INIT_READY, (vanity: PlayerVanity) => {
        console.log(`GameRoom.GAME_ROOM_PLAYER_INIT_READY called and socket.id = ${socket.id}, vanity = ${vanity}.`);
        // FIXME: Validate vanity.
        this.players.get(socket.id).vanity = vanity;
        this.gameState.onNewPlayer(socket);
        this.emit_AllPlayerVanities();
      });

      socket.on(SocketEvents.DISCONNECT, (reason) => {
        console.log(`GameRoom.disconnect called and socket.id = ${socket.id}, reason = ${reason}.`);
        this.players.delete(socket.id);
      });

      socket.on(SocketEvents.ERROR, (error) => {
        console.log(`GameRoom.error called and socket.id = ${socket.id}, error = ${error}. Disconnecting socket...`);
        socket.disconnect(true);
      });

    });
  };

  private readonly emit_AllPlayerVanities = (): void => {
    const vanities: Map<PlayerID, PlayerVanity> = new Map();
    this.players.forEach((value: Player, key: SocketID) => {
      vanities.set(key, value.vanity);
    });
    this.ioServer.of(this.roomID).emit(SocketEvents.GAME_ROOM_ALL_PLAYER_VANITIES, vanities);
  };

}
