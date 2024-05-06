import axios from "axios";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import { GCJudgingAnswer_Payload, GCJudgingPlayers_Payload, GCPreparingMatch_Payload, GCShowingQuestion_Payload, GCWaitingForMatchStart_Payload, MatchSettings, PlayerID, SocketEvents } from "trivia-shared";
import OTDBUtils, { OTDBResponse, OTDBResponseCodes } from "./lib/OTDBUtils";
import MatchState from "./match-state";

dotenv.config();

export default class GameController {
  private readonly roomID: string;
  private readonly ioServer: Server;
  private readonly matchState: MatchState;

  // TODO: Extract countdowns to shared.
  private static readonly COUNTDOWN_MULTIPLIER = Number(process.env["COUNTDOWN_MULTIPLIER"]);
  // TODO: IDLE to terminate countdown - Time spent waiting until forced room termination.
  // Time (millis) from question loading until first question. 
  private static readonly STARTING_MATCH_COUNTDOWN = 3 * 1000 * GameController.COUNTDOWN_MULTIPLIER;
  // Time (millis) for players to answer until answer reveal.
  private static readonly SHOWING_QUESTION_COUNTDOWN = 10 * 1000 * GameController.COUNTDOWN_MULTIPLIER;
  // Time (millis) for server to reveal answers to players.
  private static readonly JUDGING_ANSWER_COUNTDOWN = 5 * 1000 * GameController.COUNTDOWN_MULTIPLIER;
  // Time (millis) for server to judge players at the end of game.
  private static readonly JUDGING_PLAYERS_COUNTDOWN = 10 * 1000 * GameController.COUNTDOWN_MULTIPLIER;

  constructor(roomID: string, ioServer: Server) {
    // Could combine ioServer and roomID to the return type of SocketIO.Namespace i.e. io.of(roomID);
    this.roomID = roomID;
    this.ioServer = ioServer;
    this.matchState = new MatchState();
    console.log(`Multiplier = ${GameController.COUNTDOWN_MULTIPLIER}. 3 * 1000 * GameController.COUNTDOWN_MULTIPLIER = ${3 * 1000 * GameController.COUNTDOWN_MULTIPLIER}. GameController.STARTING_MATCH_COUNTDOWN = ${GameController.STARTING_MATCH_COUNTDOWN}.`);
  };

  public readonly onNewPlayer = (socket: Socket, playerID: PlayerID): void => {
    this.matchState.addNewPlayer(playerID);
    // TODO: Emit MatchState schema to room.

    // TODO: Extract function.
    socket.on(SocketEvents.GC_CLIENT_REQUEST_START_MATCH, async (matchSettings: MatchSettings) => {
      console.log(`GameController.GC_START_MATCH called and socket.id = ${socket.id}, matchSettings = ${JSON.stringify(matchSettings)}.`);
      this.ioServer.of(this.roomID).emit(SocketEvents.GC_SERVER_PREPARING_MATCH, {} satisfies GCPreparingMatch_Payload);
      this.matchState.onNewMatch(matchSettings);
      try {
        // TODO: Keep track of when server requests API calls to prevent timeouts.
        // FIXME: Settings and params.
        const response = await axios.get<OTDBResponse>('https://opentdb.com/api.php?amount=10',
          { timeout: 7500 }
        );
        // console.log(`GameController.GC_START_MATCH called and response.data = ${JSON.stringify(response.data)}.`);
        if (response.data.response_code === OTDBResponseCodes.SUCCESS) {
          this.matchState.receiveQuestions(OTDBUtils.standardizeQuestions(response.data.results));
          setTimeout(this.showQuestion, GameController.STARTING_MATCH_COUNTDOWN);
        } else {
          // TODO: Handle failures and OTDB bad response codes.
          console.log(`GameController.GC_START_MATCH called and response.data.response_code = ${response.data.response_code}.`);
        }
      } catch (error) {
        console.log(`GameController.GC_START_MATCH called and error = ${error}.`);
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
    console.log("GameController.showQuestion called.");
    const round = this.matchState.getRound();
    const questions = this.matchState.getQuestions();
    if (round >= 0 && round < questions.length) {
      // FIXME: When emitting and counting down, 
      // - should send a terminal time for clients to accurately display the countdown timer.
      console.log("GameController.showQuestion called and emitting.");
      this.ioServer.of(this.roomID).emit(
        SocketEvents.GC_SERVER_SHOWING_QUESTION,
        {
          question: questions[round],
          terminationTime: Date.now() + GameController.SHOWING_QUESTION_COUNTDOWN,
        } satisfies GCShowingQuestion_Payload
      );
      setTimeout(this.judgeAnswer, GameController.SHOWING_QUESTION_COUNTDOWN);
    } else {
      this.judgePlayers();
    }
  };

  private readonly judgeAnswer = (): void => {
    console.log("GameController.judgeAnswer called.");
    this.ioServer.of(this.roomID).emit(
      SocketEvents.GC_SERVER_JUDGING_ANSWER,
      {
        terminationTime: Date.now() + GameController.JUDGING_ANSWER_COUNTDOWN,
      } satisfies GCJudgingAnswer_Payload
    );
    setTimeout(this.showQuestion, GameController.JUDGING_ANSWER_COUNTDOWN);
    this.matchState.incrementRound();
  };

  private readonly judgePlayers = (): void => {
    console.log("GameController.judgePlayers called.");
    this.ioServer.of(this.roomID).emit(
      SocketEvents.GC_SERVER_JUDGING_PLAYERS,
      {
        terminationTime: Date.now() + GameController.JUDGING_PLAYERS_COUNTDOWN,
      } satisfies GCJudgingPlayers_Payload
    );
    setTimeout(this.waitForMatchStart, GameController.JUDGING_PLAYERS_COUNTDOWN);
  };

}
