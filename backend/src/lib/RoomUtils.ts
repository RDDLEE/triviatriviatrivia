export default class RoomUtils {
  public static readonly makeAlphaNumIdentifier = (): string => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 6; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
  };

  public static readonly generateRoomID = (): string => {
    const roomID = "/" + RoomUtils.makeAlphaNumIdentifier();
    return roomID;
  };

  public static readonly generatePlayerID = (): string => {
    const playerID = RoomUtils.makeAlphaNumIdentifier();
    return playerID;
  };

  // FIXME: Make friendly display name.
  public static readonly generatePlayerName = (): string => {
    const name = RoomUtils.makeAlphaNumIdentifier();
    return name;
  };

}
