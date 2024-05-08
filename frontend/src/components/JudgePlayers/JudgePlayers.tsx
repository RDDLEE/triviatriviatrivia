import React, { useCallback, useContext, useEffect, useState } from "react";
import { Client_PlayerJudgment, GCJudgingPlayers_Payload, MatchStateStages, SocketEvents } from "trivia-shared";
import { MatchStateContext } from "../MatchStateProvider/MatchStateProvider";
import { SocketContext } from "../../pages/RoomPage/RoomPage";
import MatchStateUtils from "../../lib/MatchStateUtils";

export default function JudgePlayers() {
  const matchStateContext = useContext(MatchStateContext);
  const socket = useContext(SocketContext);

  const [playerJudgments, setPlayerJudgments] = useState<Client_PlayerJudgment[]>([]);

  const onGCStageJudgingPlayers = useCallback((payload: GCJudgingPlayers_Payload): void => {
    matchStateContext?.setMatchStage(MatchStateStages.JUDING_PLAYERS);
    setPlayerJudgments(payload.playerJudgments);
  }, [matchStateContext]);

  useEffect(() => {
    socket?.on(SocketEvents.GC_SERVER_STAGE_JUDGING_PLAYERS, onGCStageJudgingPlayers);
    return () => {
      socket?.off(SocketEvents.GC_SERVER_STAGE_JUDGING_PLAYERS, onGCStageJudgingPlayers);
    };
  }, [onGCStageJudgingPlayers, socket]);

  const renderPlayerJudgments = (): JSX.Element | null => {
    const judgmentsJSX: JSX.Element[] = [];
    if (!matchStateContext) {
      return null;
    }
    for (const judgment of playerJudgments) {
      const vanity = MatchStateUtils.getPlayerVanityByPlayerID(matchStateContext, judgment.playerID);
      if (!vanity) {
        continue;
      }
      const displayName = vanity.displayName;
      const finalScore = judgment.finalPlayerStats.score;
      const rank = judgment.rank;
      judgmentsJSX.push((
        <div>
          <p>{rank} | {displayName}: {finalScore}</p>
        </div>
      ));
    }
    return (
      <div>
        {judgmentsJSX}
      </div>
    );
  };

  return (
    <React.Fragment>
      <div>
        <p>Results: </p>
        {renderPlayerJudgments()}
      </div>

    </React.Fragment>
  );
}