import axios from "axios";
import { Server, Socket } from "socket.io";
import { MatchSettings, MatchStateStates, PlayerID, SocketEvents } from "trivia-shared";
import OTDBUtils, { OTDBResponse, OTDBResponseCodes } from "./lib/OTDBUtils";
import GameRoom from "./game-room";
import MatchState from "./match-state";

export default class GameController {
  private readonly roomID: string;
  private readonly ioServer: Server;
  private readonly matchState: MatchState;

  constructor(roomID: string, ioServer: Server) {
    // Could combine ioServer and roomID to the return type of SocketIO.Namespace i.e. io.of(roomID);
    this.roomID = roomID;
    this.ioServer = ioServer;
    this.matchState = new MatchState();
  };

  public readonly onNewPlayer = (socket: Socket, playerID: PlayerID): void => {
    this.matchState.addNewPlayer(playerID);
    // TODO: Emit MatchState schema to room.

    socket.on(SocketEvents.GC_START_MATCH, async (matchSettings: MatchSettings) => {
      console.log(`GameState.GC_START_MATCH called and socket.id = ${socket.id}, matchSettings = ${JSON.stringify(matchSettings)}.`);
      this.matchState.onNewMatch(matchSettings);
      this.updateMatchStateState(MatchStateStates.LOADING_QUESTIONS);
      try {
        // FIXME: Settings and params.
        const response = await axios.get<OTDBResponse>('https://opentdb.com/api.php?amount=10',
          { timeout: 7500 }
        );
        // console.log(`GameState.GC_START_MATCH called and response.data = ${JSON.stringify(response.data)}.`);
        if (response.data.response_code === OTDBResponseCodes.SUCCESS) {
          this.matchState.receiveQuestions(OTDBUtils.standardizeQuestions(response.data.results));
          this.updateMatchStateState(MatchStateStates.PREPARING_MATCH_START);
          
          // TODO: Emit question on timer.
        } else {
          // TODO: Handle failures and OTDB bad response codes.
          console.log(`GameState.GC_START_MATCH called and response.data.response_code = ${response.data.response_code}.`);
        }
      } catch (error) {
        console.log(`GameState.GC_START_MATCH called and error = ${error}.`);
      }
    });
  };

  private readonly updateMatchStateState = (newState: MatchStateStates): void => {
    this.matchState.updateMatchStateState(newState);
    this.ioServer.of(this.roomID).emit(SocketEvents.GC_UPDATE_STATE, this.matchState.getMatchStateState());  
  };

}
