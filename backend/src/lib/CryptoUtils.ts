import crypto from "crypto";
import { PlayerID } from "trivia-shared";

export default class CryptoUtils {
  public static readonly hash = (message: string): string => {
    const generatedHash = crypto.createHash("sha256").update(message).digest("hex");
    return generatedHash;
  };

  public static readonly generatePlayerID = (socketID: string, joinTime: number): PlayerID => {
    // FIXME: Can just use playerID join count.
    const playerID = CryptoUtils.hash(socketID).concat(joinTime.toString());
    return playerID;
  };
}
