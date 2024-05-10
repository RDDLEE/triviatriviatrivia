import { Server } from "socket.io";
import { RoomID } from "trivia-shared";
import GameRoom from "./game-room";
import RoomUtils from "./lib/RoomUtils";

export default class RoomManager {
  private static readonly gameRooms: Map<RoomID, GameRoom> = new Map();

  public static readonly createRoom = (io: Server): RoomID => {
    const roomID = RoomUtils.generateRoomID();
    RoomManager.gameRooms.set(roomID, new GameRoom(roomID, io));
    return roomID;
  };

  public static readonly deleteRoom = (roomID: RoomID): boolean => {
    return RoomManager.gameRooms.delete(roomID);
  };

}