import { Server, Socket } from "socket.io";

export default class GameState {
  private readonly roomID: string;

  private readonly ioServer: Server;

  private readonly questions: unknown[] = [];

  // K: Player SocketID, V: Score.
  private readonly scores: Map<string, number> = new Map();

  // FIXME: Need to put a max length. Also, enforce stack.
  private readonly gameHistory: unknown[] = [];

  // FIXME: Maybe collapse round and answerSubmissions to a single object.
  // - Probably same singular type as questionHistory.
  private readonly round: number = 0;
  private readonly answerSubmissions: unknown[] = [];

  private readonly gameSettings: unknown;

  constructor(roomID: string, ioServer: Server) {
    this.roomID = roomID;
    this.ioServer = ioServer;
  };

  public readonly onNewPlayer = (socket: Socket): void => {
    this.scores.set(socket.id, 0);
    // TODO: Emit 
  };

}