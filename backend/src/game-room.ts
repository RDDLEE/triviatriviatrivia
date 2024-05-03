import { Server } from "socket.io";
import { Player } from "../../shared/globals";
import GameState from "./game-state";

export default class GameRoom {
  public readonly roomID: string;

  private readonly ioServer: Server;

  public readonly players: Player[] = [];

  public readonly creationTime: number;

  public readonly gameState: GameState;

  constructor(roomID: string, ioServer: Server) {
    this.roomID = roomID;
    this.ioServer = ioServer;
    this.creationTime = Date.now();
    this.gameState = new GameState(ioServer);
    
    // TODO: Socket events.
  };

}