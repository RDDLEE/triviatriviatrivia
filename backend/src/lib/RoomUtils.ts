export default class RoomUtils {
  public static readonly generateRoomID = (): string => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let roomID = "/";
    for (let i = 0; i < 6; i++) {
      roomID += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return roomID;
  }
}