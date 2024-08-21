import { Server } from "socket.io";
import { RoomID } from "trivia-shared";
import GameRoom from "./game-room";
import RoomUtils from "./lib/RoomUtils";

export default class RoomManager {
  private static readonly gameRooms: Map<RoomID, GameRoom> = new Map();

  // FIXME: Use AppUtils.ioServer.
  public static readonly createRoom = (io: Server | null): RoomID => {
    if (io === null) {
      throw new Error("Unable to create room. Invalid IO server.");
    }
    const roomID = RoomUtils.generateRoomID();
    RoomManager.gameRooms.set(roomID, new GameRoom(roomID, io));
    return roomID;
  };

  public static readonly checkIfRoomExistsByRoomID = (roomID: RoomID): boolean => {
    const room = this.gameRooms.get(roomID);
    if (room === undefined) {
      return false;
    }
    return true;
  };

  public static readonly deleteRoom = (roomID: RoomID): boolean => {
    return RoomManager.gameRooms.delete(roomID);
  };

}