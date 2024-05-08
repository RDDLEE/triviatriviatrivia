import axios from "axios";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import {
  GCAnswerSubmitted_Payload, GCAttemptSubmitAnswer_Payload, GCJudgingAnswers_Payload, GCJudgingPlayers_Payload,
  GCPreparingMatch_Payload, GCReceiveMatchStage_Payload, GCReceivePlayerID_Payload, GCReqestStartMatch_Payload,
  GCShowingQuestion_Payload, GCWaitingForMatchStart_Payload, MatchSettings, PlayerID, SocketEvents
} from "trivia-shared";
import OTDBUtils, { OTDBResponse, OTDBResponseCodes } from "./lib/OTDBUtils";
import MatchState from "./match-state";
import GameRoom from "./game-room";

dotenv.config();

export default class GameController {
  private readonly gameRoom: GameRoom;
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
  private static readonly JUDGING_ANSWERS_COUNTDOWN = 5 * 1000 * GameController.COUNTDOWN_MULTIPLIER;
  // Time (millis) for server to judge players at the end of game.
  private static readonly JUDGING_PLAYERS_COUNTDOWN = 10 * 1000 * GameController.COUNTDOWN_MULTIPLIER;

  constructor(gameRoom: GameRoom, roomID: string, ioServer: Server) {
    this.gameRoom = gameRoom;
    // Could combine ioServer and roomID to the return type of SocketIO.Namespace i.e. io.of(roomID);
    this.roomID = roomID;
    this.ioServer = ioServer;
    this.matchState = new MatchState();
  };

  public readonly onNewPlayer = (socket: Socket, playerID: PlayerID): void => {
    this.matchState.addNewPlayer(playerID);
    socket.emit(SocketEvents.GC_SERVER_RECEIVE_PLAYER_ID, { playerID: playerID } satisfies GCReceivePlayerID_Payload);
    this.ioServer.of(this.roomID).emit(SocketEvents.GC_SERVER_RECEIVE_MATCH_STATE, {
      matchState: this.matchState.getClientMatchState(this.gameRoom),
    } satisfies GCReceiveMatchStage_Payload);

    // TODO: Extract function.
    socket.on(SocketEvents.GC_CLIENT_REQUEST_START_MATCH, async (payload: GCReqestStartMatch_Payload) => {
      this.ioServer.of(this.roomID).emit(SocketEvents.GC_SERVER_STAGE_PREPARING_MATCH, {} satisfies GCPreparingMatch_Payload);
      this.matchState.onNewMatch(payload.matchSettings);
      // TODO: Implement question provider router.
      this.fetchOpenTDBQuestions();
    });

    // TODO: Extract function.
    socket.on(SocketEvents.GC_CLIENT_ATTEMPT_SUBMIT_ANSWER, (payload: GCAttemptSubmitAnswer_Payload) => {
      // console.log(`GameController.GC_CLIENT_ATTEMPT_SUBMIT_ANSWER called. payload = ${JSON.stringify(payload)}.`);
      const playerID = this.gameRoom.getPlayerIDBySocketID(socket.id);
      const wasSuccessful = this.matchState.attemptSubmitAnswer(playerID, payload.selectedAnswerID);
      if (wasSuccessful) {
        this.ioServer.of(this.roomID).emit(
          SocketEvents.GC_SERVER_ANSWER_SUBMITTED, {
            answerState: this.matchState.getClientAnswerStateByPlayerID(playerID),
          } satisfies GCAnswerSubmitted_Payload
        );
      }
    });
  };

  private readonly waitForMatchStart = (): void => {
    this.matchState.onWaitForMatchStart();
    this.ioServer.of(this.roomID).emit(
      SocketEvents.GC_SERVER_STAGE_WAITING_FOR_MATCH_START,
      {} satisfies GCWaitingForMatchStart_Payload
    );
  };

  // TODO: Perhaps do this definitively/statefully.
  private readonly showQuestion = (): void => {
    const question = this.matchState.getCurrentQuestion();
    if (question) {
      this.matchState.onShowQuestion();
      this.ioServer.of(this.roomID).emit(
        SocketEvents.GC_SERVER_STAGE_SHOWING_QUESTION,
        {
          question: question,
          terminationTime: Date.now() + GameController.SHOWING_QUESTION_COUNTDOWN,
          playerAnswerStates: this.matchState.makeClientPlayerAnswerStates(),
        } satisfies GCShowingQuestion_Payload
      );
      setTimeout(this.judgeAnswers, GameController.SHOWING_QUESTION_COUNTDOWN);
    } else {
      this.judgePlayers();
    }
  };

  private readonly judgeAnswers = (): void => {
    const judgments = this.matchState.onJudgeAnswers();
    this.ioServer.of(this.roomID).emit(
      SocketEvents.GC_SERVER_STAGE_JUDGING_ANSWERS,
      {
        terminationTime: Date.now() + GameController.JUDGING_ANSWERS_COUNTDOWN,
        playersStats: this.matchState.makeClientPlayersStats(),
        judgmentResults: {
          correctAnswerID: this.matchState.getCurrentQuestion().correctAnswerID,
          judgments: this.matchState.makeClientPlayerAnswerJudgments(judgments),
        },
        playerAnswerStates: this.matchState.makeClientPlayerAnswerStates(),
      } satisfies GCJudgingAnswers_Payload
    );
    setTimeout(this.showQuestion, GameController.JUDGING_ANSWERS_COUNTDOWN);
    this.matchState.incrementRound();
  };

  private readonly judgePlayers = (): void => {
    const judgments = this.matchState.onJudgePlayers();
    this.ioServer.of(this.roomID).emit(
      SocketEvents.GC_SERVER_STAGE_JUDGING_PLAYERS,
      {
        terminationTime: Date.now() + GameController.JUDGING_PLAYERS_COUNTDOWN,
        playerJudgments: judgments,
      } satisfies GCJudgingPlayers_Payload
    );
    setTimeout(this.waitForMatchStart, GameController.JUDGING_PLAYERS_COUNTDOWN);
  };

  private readonly fetchOpenTDBQuestions = async (): Promise<void> => {
    try {
      // TODO: Keep track of when server requests API calls to prevent timeouts.
      // TODO: Settings and params.
      const response = await axios.get<OTDBResponse>(
        "https://opentdb.com/api.php?amount=10",
        { timeout: 7500 }
      );
      // console.log(`GameController.fetchOpenTDBQuestions called and response.data = ${JSON.stringify(response.data)}.`);
      if (response.data.response_code === OTDBResponseCodes.SUCCESS) {
        this.matchState.receiveQuestions(OTDBUtils.standardizeQuestions(response.data.results));
        setTimeout(this.showQuestion, GameController.STARTING_MATCH_COUNTDOWN);
      } else {
        // FIXME: Handle failures and OTDB bad response codes.
        console.log(`GameController.fetchOpenTDBQuestions called and response.data.response_code = ${response.data.response_code}.`);
      }
    } catch (error) {
      // FIXME: Handle failures and OTDB bad response codes.
      console.log(`GameController.fetchOpenTDBQuestions called and error = ${error}.`);
    }
  };
}
