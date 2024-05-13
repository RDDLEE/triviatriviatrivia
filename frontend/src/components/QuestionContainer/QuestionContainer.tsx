import React, { useContext } from "react";
import { Flex, Title } from "@mantine/core";
import { Client_StandardAnswerCoice } from "trivia-shared";
import { MatchStateContext } from "../MatchStateProvider/MatchStateProvider";
import AnswerChoice from "../AnswerChoice/AnswerChoice";
import MatchStageProgress from "../MatchStageProgress/MatchStageProgress";

export default function QuestionContainer() {
  const matchStateContext = useContext(MatchStateContext);

  const renderAnswerChoices = (choices: Client_StandardAnswerCoice[]): JSX.Element => {
    const choicesJSX: JSX.Element[] = [];
    for (const choice of choices) {
      choicesJSX.push((
        <AnswerChoice key={choice.answerID} answerChoice={choice} />
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
      <React.Fragment>
        <Title order={5}>
          {question.prompt}
        </Title>
        <MatchStageProgress />
        {renderAnswerChoices(question.choices)}
      </React.Fragment >
    );
  };

  return (
    <Flex
      gap="xs"
      justify="flex-start"
      align="flex-start"
      direction="column"
      wrap="wrap"
    >
      {renderQuestion()}
    </Flex>
  );
}
