import { Server } from "socket.io";
import GameController from "./game-controller";
import CryptoUtils from "./lib/CryptoUtils";
import { Client_PlayerVanity, GRJoinGame_Payload, GRUpdatePlayerVanities_Payload, Player, PlayerID, RoomID, SocketEvents, SocketID } from "trivia-shared";
import RoomManager from "./room-manager";

export default class GameRoom {
  private readonly roomID: string;
  private readonly ioServer: Server;
  private readonly players: Map<SocketID, Player>;
  // TODO: Terminate old GameRooms.
  private readonly creationTime: number;
  private readonly gameController: GameController;

  constructor(roomID: RoomID, ioServer: Server) {
    this.roomID = roomID;
    this.ioServer = ioServer;
    this.creationTime = Date.now();
    this.gameController = new GameController(this, roomID, ioServer);
    this.players = new Map();

    // FIXME: Extract to function.
    ioServer.of(roomID).on(SocketEvents.CONNECTION, (socket) => {
      // Store connected players, but defer handling until the player explicity requests to join.
      // FIXME: Check max players.
      const joinTime = Date.now();
      const playerID = CryptoUtils.generatePlayerID(socket.id, joinTime);
      this.players.set(socket.id, {
        playerID: playerID,
        joinTime: joinTime,
        vanity: null,
      });

      // Core player ingress.
      socket.on(SocketEvents.GR_CLIENT_JOIN_GAME, (payload: GRJoinGame_Payload) => {
        // FIXME: Validate vanity.
        const player = this.players.get(socket.id);
        this.players.set(socket.id, {
          ...player,
          vanity: payload.playerVanity,
        });
        this.gameController.onNewPlayer(socket, player.playerID);
      });

      socket.on(SocketEvents.DISCONNECT, (reason) => {
        console.log(`GameRoom.DISCONNECT called and socket.id = ${socket.id}, reason = ${reason}.`);
        const player = this.players.get(socket.id);
        if (player) {
          this.gameController.onRemovePlayer(player.playerID);
          this.players.delete(socket.id);
        } else {
          // FIXME: Log.
        }
        if (this.players.size < 1) {
          this.terminateGameRoom();
        }
      });

      socket.on(SocketEvents.ERROR, (error) => {
        console.log(`GameRoom.ERROR called and socket.id = ${socket.id}, error = ${error}. Disconnecting socket...`);
        socket.disconnect(true);
      });
    });
  }

  public readonly terminateGameRoom = (): void => {
    console.log(`GameRoom.terminateGameRoom called and is terminating room with roomID = ${this.roomID}.`);
    const wasSuccessful = RoomManager.deleteRoom(this.roomID);
    if (!wasSuccessful) {
      // TODO: Handle failure.
    }
    this.ioServer.of(this.roomID).disconnectSockets(true);
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
