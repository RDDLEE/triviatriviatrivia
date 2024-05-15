import { useCallback, useContext, useEffect } from "react";
import { Flex, Title, Text } from "@mantine/core";
import { AnswerID, Client_StandardAnswerCoice, GCAttemptSubmitAnswer_Payload, SocketEvents } from "trivia-shared";
import { MatchStateContext } from "../MatchStateProvider/MatchStateProvider";
import AnswerChoice from "../AnswerChoice/AnswerChoice";
import MatchStageProgress from "../MatchStageProgress/MatchStageProgress";
import { useWindowEvent } from "@mantine/hooks";
import MatchStateUtils from "../../lib/MatchStateUtils";
import { SocketContext } from "../../pages/RoomPage/RoomPage";

export default function QuestionContainer() {
  const matchStateContext = useContext(MatchStateContext);
  const socket = useContext(SocketContext);

  const attemptSubmitAnswer = useCallback((answerID: AnswerID): void => {
    if (!matchStateContext) {
      return;
    }
    const clientPlayerID = matchStateContext.clientPlayerID;
    const clientAnswerState = MatchStateUtils.getPlayerAnswerStateByPlayerID(matchStateContext, clientPlayerID);
    if (!clientAnswerState) {
      return;
    }
    if (!clientAnswerState.canAnswer) {
      return;
    }
    socket?.emit(
      SocketEvents.GC_CLIENT_ATTEMPT_SUBMIT_ANSWER,
      {
        selectedAnswerID: answerID,
      } satisfies GCAttemptSubmitAnswer_Payload
    );
  }, [matchStateContext, socket]);

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    const code = event.code;
    if (!event.code.startsWith("Digit")) {
      return;
    }
    const digit = parseInt(code.charAt(5), 10);
    if (isNaN(digit)) {
      return;
    }
    if (digit === 0) {
      return;
    }
    // NOTE: Input answers will be 1-indexed.
    // - Need to convert to AnswerID.
    const selectedAnswerID = digit - 1;
    if (!matchStateContext) {
      return;
    }
    const question = matchStateContext.question;
    if (!question) {
      return;
    }
    if (selectedAnswerID >= question.choices.length) {
      // selectedAnswerID has to be an available answerChoice.
      return;
    }
    attemptSubmitAnswer(selectedAnswerID);
  }, [attemptSubmitAnswer, matchStateContext]);

  const WINDOW_EVENT_KEYDOWN = "keydown";

  useWindowEvent(WINDOW_EVENT_KEYDOWN, onKeyDown);

  useEffect(() => {
    window.addEventListener(WINDOW_EVENT_KEYDOWN, onKeyDown);
    return () => {
      return window.removeEventListener(WINDOW_EVENT_KEYDOWN, onKeyDown);
    };
  }, [onKeyDown]);


  const renderAnswerChoices = (choices: Client_StandardAnswerCoice[]): JSX.Element => {
    const choicesJSX: JSX.Element[] = [];
    for (const choice of choices) {
      choicesJSX.push((
        <AnswerChoice key={choice.answerID} answerChoice={choice} onClick_AnswerChoice={attemptSubmitAnswer} />
      ));
    }
    return (
      <Flex
        gap="xs"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
        w="100%"
      >
        {choicesJSX}
      </Flex>
    );
  };

  const renderQuestion = (): JSX.Element | null => {
    if (!matchStateContext) {
      return null;
    }
    const question = matchStateContext.question;
    if (!question) {
      return null;
    }
    return (
      <Flex
        gap="xs"
        justify="flex-start"
        align="flex-start"
        direction="column"
        wrap="wrap"
      >
        <Flex
          gap={0}
          justify="flex-end"
          align="flex-start"
          direction="row"
          wrap="wrap"
          w="100%"
        >
          <Text size="xs" c="dimmed">
            {`Round ${matchStateContext.round + 1} of ${matchStateContext.totalQuestionCount}`}
          </Text>
        </Flex>
        <Title order={5}>
          {question.prompt}
        </Title>
        <MatchStageProgress />
        {renderAnswerChoices(question.choices)}
      </Flex>
    );
  };

  return renderQuestion();
}
