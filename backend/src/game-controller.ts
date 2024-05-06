import axios from "axios";
import { Server, Socket } from "socket.io";
import { GCJudgingAnswer_Payload, GCJudgingPlayers_Payload, GCPreparingMatch_Payload, GCShowingQuestion_Payload, GCWaitingForMatchStart_Payload, MatchSettings, PlayerID, SocketEvents } from "trivia-shared";
import OTDBUtils, { OTDBResponse, OTDBResponseCodes } from "./lib/OTDBUtils";
import GameRoom from "./game-room";
import MatchState from "./match-state";

export default class GameController {
  private readonly roomID: string;
  private readonly ioServer: Server;
  private readonly matchState: MatchState;

  // TODO: Extract countdowns to shared.
  // TODO: IDLE to terminate countdown - Time spent waiting until forced room termination.
  // Time (millis) from question loading until first question. 
  private static readonly STARTING_MATCH_COUNTDOWN = 3 * 1000;
  // Time (millis) for players to answer until answer reveal.
  private static readonly SHOWING_QUESTION_COUNTDOWN = 10 * 1000;
  // Time (millis) for server to reveal answers to players.
  private static readonly JUDGING_ANSWER_COUNTDOWN = 5 * 1000;
  // Time (millis) for server to judge players at the end of game.
  private static readonly JUDGING_PLAYERS_COUNTDOWN = 10 * 1000;

  constructor(roomID: string, ioServer: Server) {
    // Could combine ioServer and roomID to the return type of SocketIO.Namespace i.e. io.of(roomID);
    this.roomID = roomID;
    this.ioServer = ioServer;
    this.matchState = new MatchState();
  };

  public readonly onNewPlayer = (socket: Socket, playerID: PlayerID): void => {
    this.matchState.addNewPlayer(playerID);
    // TODO: Emit MatchState schema to room.

    // TODO: Extract function.
    socket.on(SocketEvents.GC_CLIENT_REQUEST_START_MATCH, async (matchSettings: MatchSettings) => {
      console.log(`GameState.GC_START_MATCH called and socket.id = ${socket.id}, matchSettings = ${JSON.stringify(matchSettings)}.`);
      this.ioServer.of(this.roomID).emit(SocketEvents.GC_SERVER_PREPARING_MATCH, {} satisfies GCPreparingMatch_Payload);
      this.matchState.onNewMatch(matchSettings);
      try {
        // TODO: Keep track of when server requests API calls to prevent timeouts.
        // FIXME: Settings and params.
        const response = await axios.get<OTDBResponse>('https://opentdb.com/api.php?amount=10',
          { timeout: 7500 }
        );
        // console.log(`GameState.GC_START_MATCH called and response.data = ${JSON.stringify(response.data)}.`);
        if (response.data.response_code === OTDBResponseCodes.SUCCESS) {
          this.matchState.receiveQuestions(OTDBUtils.standardizeQuestions(response.data.results));
          setInterval(this.showQuestion, GameController.STARTING_MATCH_COUNTDOWN);
        } else {
          // TODO: Handle failures and OTDB bad response codes.
          console.log(`GameState.GC_START_MATCH called and response.data.response_code = ${response.data.response_code}.`);
        }
      } catch (error) {
        console.log(`GameState.GC_START_MATCH called and error = ${error}.`);
      }
    });
  };

  private readonly waitForMatchStart = (): void => {
    this.ioServer.of(this.roomID).emit(
      SocketEvents.GC_SERVER_WAITING_FOR_MATCH_START,
      {} satisfies GCWaitingForMatchStart_Payload
    );
  };

  // TODO: Perhaps do this definitively/statefully.
  private readonly showQuestion = (): void => {
    const round = this.matchState.getRound();
    const questions = this.matchState.getQuestions();
    if (round >= 0 && round < questions.length) {
      // FIXME: When emitting and counting down, 
      // - should send a terminal time for clients to accurately display the countdown timer.
      this.ioServer.of(this.roomID).emit(
        SocketEvents.GC_SERVER_SHOWING_QUESTION,
        {
          question: questions[round],
          terminationTime: Date.now() + GameController.SHOWING_QUESTION_COUNTDOWN,
        } satisfies GCShowingQuestion_Payload
      );
      setInterval(this.judgeAnswer, GameController.SHOWING_QUESTION_COUNTDOWN);
    } else {
      this.judgePlayers();
    }
  };

  private readonly judgeAnswer = (): void => {
    this.ioServer.of(this.roomID).emit(
      SocketEvents.GC_SERVER_JUDGING_ANSWER,
      {
        terminationTime: Date.now() + GameController.JUDGING_ANSWER_COUNTDOWN,
      } satisfies GCJudgingAnswer_Payload
    );
    setInterval(this.showQuestion, GameController.JUDGING_ANSWER_COUNTDOWN);
  };

  private readonly judgePlayers = (): void => {
    this.ioServer.of(this.roomID).emit(
      SocketEvents.GC_SERVER_JUDGING_PLAYERS,
      {
        terminationTime: Date.now() + GameController.JUDGING_PLAYERS_COUNTDOWN,
      } satisfies GCJudgingPlayers_Payload
    );
    setInterval(this.waitForMatchStart, GameController.JUDGING_PLAYERS_COUNTDOWN);
  };

}
