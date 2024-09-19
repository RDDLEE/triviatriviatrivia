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
  // @ts-expect-error Not yet utilized.
  private readonly creationTime: number;
  private isTerminating: boolean;
  private gameController: GameController | null;

  constructor(roomID: RoomID, ioServer: Server) {
    console.log(`Creating GameRoom with roomID: ${roomID}.`);
    this.roomID = roomID;
    this.ioServer = ioServer;
    this.creationTime = Date.now();
    this.gameController = new GameController(this, roomID, ioServer);
    this.isTerminating = false;
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
        if (this.gameController === null) {
          return;
        }
        // FIXME: Validate vanity.
        const player = this.players.get(socket.id);
        if (!player) {
          return;
        }
        this.players.set(socket.id, {
          playerID: player.playerID,
          joinTime: player.joinTime,
          vanity: payload.playerVanity,
        });
        this.gameController.onNewPlayer(socket, player.playerID);
      });

      socket.on(SocketEvents.DISCONNECT, (_reason) => {
        // console.log(`GameRoom.DISCONNECT called and socket.id = ${socket.id}, reason = ${reason}.`);
        const player = this.players.get(socket.id);
        if (player) {
          if (this.gameController !== null) {
            this.gameController.onRemovePlayer(player.playerID);
          }
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
    if (this.isTerminating) {
      return;
    }
    console.log(`Terminating room with roomID = ${this.roomID}.`);
    this.isTerminating = true;
    this.ioServer.of(this.roomID).disconnectSockets(true);
    this.ioServer.of(this.roomID).removeAllListeners();
    if (this.gameController !== null) {
      this.gameController.onGameRoomTermination();
    }
    this.gameController = null;
    const wasSuccessful = RoomManager.deleteRoom(this.roomID);
    if (!wasSuccessful) {
      // TODO: Handle failure.
      console.error(`GameRoom.terminateGameRoom called and failed to terminate room with roomID = ${this.roomID}.`);
    }
  };

  // TODO: Implement vanity changes.
  // @ts-expect-error Not yet implemented.
  private readonly updatePlayerVanities = (): void => {
    const vanities = this.makeClientPlayerVanities();
    this.ioServer.of(this.roomID).emit(SocketEvents.GR_SERVER_UPDATE_PLAYER_VANITIES, {
      playerVanities: vanities,
    } satisfies GRUpdatePlayerVanities_Payload);
  };

  public readonly makeClientPlayerVanities = (): Client_PlayerVanity[] => {
    const vanities: Client_PlayerVanity[] = [];
    this.players.forEach((value: Player, _: SocketID) => {
      if (!value.vanity) {
        return;
      }
      vanities.push({
        playerID: value.playerID,
        // TODO: Could create helper to convert from Client/Server PlayerVanities.
        displayName: value.vanity.displayName,
      });
    });
    return vanities;
  };

  public readonly getPlayerIDBySocketID = (socketID: SocketID): PlayerID | null => {
    const player = this.players.get(socketID);
    if (!player) {
      return null;
    }
    return player.playerID;
  };
}
