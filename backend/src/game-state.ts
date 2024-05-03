import { Server } from "socket.io";
// import { Player } from "../../shared/globals";

export default class GameState {
  private readonly ioServer: Server;

  private readonly questions: unknown[] = [];

  // K: Player SocketID, V: Score.
  private readonly scores: Map<string, number> = new Map();

  private readonly questionHistory: unknown[] = [];

  // FIXME: Maybe collapse round and answerSubmissions to a single object.
  // - Probably same singular type as questionHistory.
  private readonly round: number = 0;
  private readonly answerSubmissions: unknown[] = [];

  constructor(ioServer: Server) {
    this.ioServer = ioServer;

    // TODO: Socket events.
  };

}