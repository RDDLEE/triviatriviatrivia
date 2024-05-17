import axios from "axios";
import { Server, Socket } from "socket.io";
import {
  GCAnswerSubmitted_Payload, GCAttemptSubmitAnswer_Payload, GCJudgingAnswers_Payload, GCJudgingPlayers_Payload,
  GCPreparingMatch_Payload, GCReceiveMatchStage_Payload, GCReceivePlayerID_Payload, GCReqestStartMatch_Payload,
  GCShowingQuestion_Payload, OTDB_CATEGORY_ANY_ID, PlayerID, ProviderSettings, SocketEvents
} from "trivia-shared";
import OTDBUtils, { OTDBResponse, OTDBResponseCodes } from "./lib/OTDBUtils";
import MatchState from "./match-state";
import GameRoom from "./game-room";
import EnvUtils from "./lib/EnvUtils";
import MatchStateUtils from "./lib/MatchStateUtils";

export default class GameController {
  private readonly gameRoom: GameRoom;
  private readonly roomID: string;
  private readonly ioServer: Server;
  private readonly matchState: MatchState;
  private stageTimer: NodeJS.Timeout | undefined = undefined;

  // TODO: Extract countdowns to shared.
  private static readonly COUNTDOWN_MULTIPLIER = EnvUtils.getCountdownMultiplier();
  // TODO: IDLE to terminate countdown - Time spent waiting until forced room termination.
  // Time (millis) after question loading until first question. Not particularly necessary.
  private static readonly STARTING_MATCH_COUNTDOWN = 1 * 1000 * GameController.COUNTDOWN_MULTIPLIER;
  // Time (millis) for players to answer until answer reveal.
  private static readonly SHOWING_QUESTION_COUNTDOWN = 15 * 1000 * GameController.COUNTDOWN_MULTIPLIER;
  // Time (millis) for server to reveal answers to players.
  private static readonly JUDGING_ANSWERS_COUNTDOWN = 5 * 1000 * GameController.COUNTDOWN_MULTIPLIER;
  // Time (millis) for server to wait for a new match before self-termination.
  private static readonly IDLE_TERMINATION_COUNTDOWN = 180 * 1000 * GameController.COUNTDOWN_MULTIPLIER;

  constructor(gameRoom: GameRoom, roomID: string, ioServer: Server) {
    this.gameRoom = gameRoom;
    // Could combine ioServer and roomID to the return type of SocketIO.Namespace i.e. io.of(roomID);
    this.roomID = roomID;
    this.ioServer = ioServer;
    this.matchState = new MatchState();
    this.startNewTimer(this.terminateGameRoom, GameController.IDLE_TERMINATION_COUNTDOWN);
  }

  public readonly onNewPlayer = (socket: Socket, playerID: PlayerID): void => {
    this.matchState.addNewPlayer(playerID);
    socket.emit(SocketEvents.GC_SERVER_RECEIVE_PLAYER_ID, { playerID: playerID } satisfies GCReceivePlayerID_Payload);
    this.broadcastMatchState();

    // TODO: Extract function.
    socket.on(SocketEvents.GC_CLIENT_REQUEST_START_MATCH, async (payload: GCReqestStartMatch_Payload): Promise<void> => {
      this.ioServer.of(this.roomID).emit(SocketEvents.GC_SERVER_STAGE_PREPARING_MATCH, {
        matchStageTimeFrame: MatchStateUtils.getMatchStageTimeFrameIdentity(),
      } satisfies GCPreparingMatch_Payload);
      this.matchState.onNewMatch(payload.matchSettings);
      this.broadcastMatchState();
      // TODO: Implement question provider router.
      const wasSuccessful = await this.fetchOpenTDBQuestions(payload.matchSettings.providerSettings);
      if (wasSuccessful) {
        this.startNewTimer(this.showQuestion, GameController.STARTING_MATCH_COUNTDOWN);
      } else {
        // TODO: Notify client of failure.
        // TODO: Keep track of client/s fetch requests to prevent timeouts/abuse.
      }
    });

    // TODO: Extract function.
    socket.on(SocketEvents.GC_CLIENT_ATTEMPT_SUBMIT_ANSWER, (payload: GCAttemptSubmitAnswer_Payload): void => {
      const playerID = this.gameRoom.getPlayerIDBySocketID(socket.id);
      if (playerID === null) {
        return;
      }
      const wasSuccessful = this.matchState.attemptSubmitAnswer(playerID, payload.selectedAnswerID);
      if (wasSuccessful) {
        const clientAnswerState = this.matchState.getClientAnswerStateByPlayerID(playerID);
        if (!clientAnswerState) {
          return;
        }
        this.ioServer.of(this.roomID).emit(
          SocketEvents.GC_SERVER_ANSWER_SUBMITTED, {
            answerState: clientAnswerState,
          } satisfies GCAnswerSubmitted_Payload
        );
      }
    });
  };

  public readonly onRemovePlayer = (playerID: PlayerID): void => {
    this.matchState.removePlayer(playerID);
    this.broadcastMatchState();
  };

  // TODO: Perhaps do this definitively/statefully.
  private readonly showQuestion = (): void => {
    const question = this.matchState.getCurrentQuestion();
    if (question) {
      const timeFrame = {
        terminationTime: Date.now() + GameController.SHOWING_QUESTION_COUNTDOWN,
        countdownTime: GameController.SHOWING_QUESTION_COUNTDOWN,
      };
      this.matchState.onShowQuestion(timeFrame);
      this.ioServer.of(this.roomID).emit(
        SocketEvents.GC_SERVER_STAGE_SHOWING_QUESTION,
        {
          round: this.matchState.getRound(),
          totalQuestionCount: this.matchState.getQuestionCount(),
          question: question,
          playerAnswerStates: this.matchState.makeClientPlayerAnswerStates(),
          matchStageTimeFrame: timeFrame,
        } satisfies GCShowingQuestion_Payload
      );
      this.startNewTimer(this.judgeAnswers, GameController.SHOWING_QUESTION_COUNTDOWN);
    } else {
      this.judgePlayers();
    }
  };

  private readonly judgeAnswers = (): void => {
    const timeFrame = {
      terminationTime: Date.now() + GameController.JUDGING_ANSWERS_COUNTDOWN,
      countdownTime: GameController.JUDGING_ANSWERS_COUNTDOWN,
    };
    const judgments = this.matchState.onJudgeAnswers(timeFrame);
    if (!judgments) {
      return;
    }
    const clientJudgments = this.matchState.makeClientPlayerAnswerJudgments(judgments);
    const currQuestion = this.matchState.getCurrentQuestion();
    if (!currQuestion) {
      return;
    }
    this.ioServer.of(this.roomID).emit(
      SocketEvents.GC_SERVER_STAGE_JUDGING_ANSWERS,
      {
        playersStats: this.matchState.makeClientPlayersStats(),
        judgmentResults: {
          correctAnswerID: currQuestion.correctAnswerID,
          judgments: clientJudgments,
        },
        matchStageTimeFrame: timeFrame,
      } satisfies GCJudgingAnswers_Payload
    );
    this.startNewTimer(this.showQuestion, GameController.JUDGING_ANSWERS_COUNTDOWN);
    this.matchState.incrementRound();
  };

  private readonly judgePlayers = (): void => {
    const timeFrame =  {
      terminationTime: Date.now() + GameController.IDLE_TERMINATION_COUNTDOWN,
      countdownTime: GameController.IDLE_TERMINATION_COUNTDOWN,
    };
    const judgments = this.matchState.onJudgePlayers(timeFrame);
    this.ioServer.of(this.roomID).emit(
      SocketEvents.GC_SERVER_STAGE_JUDGING_PLAYERS,
      {
        matchStageTimeFrame: timeFrame,
        playerJudgments: judgments,
      } satisfies GCJudgingPlayers_Payload
    );
    // FIXME: Idle on JudgePlayers screen until countdown.
    this.startNewTimer(this.terminateGameRoom, GameController.IDLE_TERMINATION_COUNTDOWN);
  };

  private readonly terminateGameRoom = (): void => {
    this.gameRoom.terminateGameRoom();
  };

  private readonly broadcastMatchState = (): void => {
    this.ioServer.of(this.roomID).emit(SocketEvents.GC_SERVER_RECEIVE_MATCH_STATE, {
      matchState: this.matchState.getClientMatchState(this.gameRoom),
    } satisfies GCReceiveMatchStage_Payload);
  };

  private readonly fetchOpenTDBQuestions = async (providerSettings?: ProviderSettings | undefined): Promise<boolean> => {
    let category = providerSettings?.category;
    if (category === undefined || category === OTDB_CATEGORY_ANY_ID) {
      category = "any";
    }
    try {
      // TODO: Keep track of when server requests API calls to prevent timeouts.
      // TODO: Settings and params.
      const response = await axios.get<OTDBResponse>(
        `https://opentdb.com/api.php?amount=10&category=${category}`,
        { timeout: 7500 }
      );
      // console.log(`GameController.fetchOpenTDBQuestions called and response.data = ${JSON.stringify(response.data)}.`);
      if (response.data.response_code === OTDBResponseCodes.SUCCESS) {
        this.matchState.receiveQuestions(OTDBUtils.standardizeQuestions(response.data.results));
        return true;
      } else {
        // FIXME: Handle failures and OTDB bad response codes.
        console.log(`GameController.fetchOpenTDBQuestions called and response.data.response_code = ${response.data.response_code}.`);
        return false;
      }
    } catch (error) {
      // FIXME: Handle failures and OTDB bad response codes.
      console.log(`GameController.fetchOpenTDBQuestions called and error = ${error}.`);
      return false;
    }
  };

  private readonly startNewTimer = (callback: () => void, ms?: number): void => {
    clearTimeout(this.stageTimer);
    this.stageTimer = setTimeout(callback, ms);
  };
}
