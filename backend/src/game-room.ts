import { Server } from "socket.io";
import GameController from "./game-controller";
import RoomUtils from "./lib/RoomUtils";
import CryptoUtils from "./lib/CryptoUtils";
import { Player, PlayerID, PlayerVanity, SocketEvents, SocketID } from "trivia-shared";

export default class GameRoom {
  private readonly roomID: string;
  private readonly ioServer: Server;
  // K: SocketID, V: Player.
  private readonly players: Map<SocketID, Player> = new Map();
  // TODO: Terminate old GameRooms.
  // TODO: Create GameRoomDetails obj.
  private readonly creationTime: number;
  private readonly gameController: GameController;

  constructor(roomID: string, ioServer: Server) {
    this.roomID = roomID;
    this.ioServer = ioServer;
    this.creationTime = Date.now();
    this.gameController = new GameController(roomID, ioServer);

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
      socket.on(SocketEvents.GR_INIT_PLAYER_READY, (vanity: PlayerVanity) => {
        console.log(`GameRoom.GR_INIT_PLAYER_READY called and socket.id = ${socket.id}, vanity = ${JSON.stringify(vanity)}.`);
        // FIXME: Validate vanity.
        const player = this.players.get(socket.id);
        player.vanity = vanity;
        this.gameController.onNewPlayer(socket, playerID);
        // FIXME: Need to emit all (GS/GR) values to the new player.
        // FIXME: Need to emit all (GS/GR) values of the new player to all players.
        this.emit_AllPlayerVanities();
      });

      socket.on(SocketEvents.DISCONNECT, (reason) => {
        console.log(`GameRoom.disconnect called and socket.id = ${socket.id}, reason = ${reason}.`);
        this.players.delete(socket.id);
        // TODO: Delete PlayerState in GS.
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
    this.ioServer.of(this.roomID).emit(SocketEvents.GR_UPDATE_PLAYER_VANITIES, vanities);
  };

  public readonly getPlayerIDBySocketID = (socketID: SocketID): PlayerID => {
    return this.players.get(socketID).playerID;
  };

}
