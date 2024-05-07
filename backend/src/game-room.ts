import { Server } from "socket.io";
import GameController from "./game-controller";
import RoomUtils from "./lib/RoomUtils";
import CryptoUtils from "./lib/CryptoUtils";
import { Client_PlayerVanity, GRJoinGame_Payload, GRUpdatePlayerVanities_Payload, Player, PlayerID, Server_PlayerVanity, SocketEvents, SocketID } from "trivia-shared";

export default class GameRoom {
  private readonly roomID: string;
  private readonly ioServer: Server;
  // K: SocketID, V: Player.
  private readonly players: Map<SocketID, Player>;
  // TODO: Terminate old GameRooms.
  // TODO: Create GameRoomDetails obj.
  private readonly creationTime: number;
  private readonly gameController: GameController;

  constructor(roomID: string, ioServer: Server) {
    this.roomID = roomID;
    this.ioServer = ioServer;
    this.creationTime = Date.now();
    this.gameController = new GameController(this, roomID, ioServer);
    this.players = new Map();

    // FIXME: Extract to function.
    ioServer.of(roomID).on(SocketEvents.CONNECTION, (socket) => {
      console.log(`GameRoom.CONNECTION called and socket.id = ${socket.id}.`);
      // Store connected players, but defer handling until the player explicity 
      // - requests to join.
      // FIXME: Check max players.
      const joinTime = Date.now();
      const playerID = CryptoUtils.generatePlayerID(socket.id, joinTime);
      this.players.set(socket.id, {
        playerID: playerID,
        joinTime: joinTime,
        vanity: null,
      });

      // Core player ingress.
      // FIXME: Init Player Ready params.
      socket.on(SocketEvents.GR_CLIENT_JOIN_GAME, (payload: GRJoinGame_Payload) => {
        console.log(`GameRoom.GR_CLIENT_JOIN_GAME called and socket.id = ${socket.id}, vanity = ${JSON.stringify(payload.playerVanity)}.`);
        // FIXME: Validate vanity.
        const player = this.players.get(socket.id);
        this.players.set(socket.id, {
          ...player,
          vanity: payload.playerVanity,
        });
        this.gameController.onNewPlayer(socket, player.playerID);
        // FIXME: Need to emit all (GS/GR) values to the new player.
        // FIXME: Need to emit all (GS/GR) values of the new player to all players.
        // this.updatePlayerVanities();
      });

      socket.on(SocketEvents.DISCONNECT, (reason) => {
        console.log(`GameRoom.DISCONNECT called and socket.id = ${socket.id}, reason = ${reason}.`);
        this.players.delete(socket.id);
        // TODO: Delete Player in GS.
      });

      socket.on(SocketEvents.ERROR, (error) => {
        console.log(`GameRoom.ERROR called and socket.id = ${socket.id}, error = ${error}. Disconnecting socket...`);
        socket.disconnect(true);
      });
    });
  };

  // TODO: Implement vanity changes.
  private readonly updatePlayerVanities = (): void => {
    const vanities = this.makeClientPlayerVanities();
    this.ioServer.of(this.roomID).emit(SocketEvents.GR_SERVER_UPDATE_PLAYER_VANITIES, {
      playerVanities: vanities,
    } satisfies GRUpdatePlayerVanities_Payload);
  };

  public readonly makeClientPlayerVanities = (): Client_PlayerVanity[] => {
    const vanities: Client_PlayerVanity[] = [];
    this.players.forEach((value: Player, _: SocketID) => {
      vanities.push({
        playerID: value.playerID,
        // TODO: Could create helper to convert from Client/Server PlayerVanities.
        displayName: value.vanity.displayName,
      });
    });
    return vanities;
  };

  public readonly getPlayerIDBySocketID = (socketID: SocketID): PlayerID => {
    return this.players.get(socketID).playerID;
  };

}
