import React, { useContext } from "react";
import { MatchStateContext } from "../MatchStateProvider/MatchStateProvider";
import AnswerChoice from "../AnswerChoice/AnswerChoice";
import { Flex, Title } from "@mantine/core";

export default function QuestionContainer() {
  const matchStateContext = useContext(MatchStateContext);

  const renderQuestion = (): JSX.Element | null => {
    if (!matchStateContext) {
      return null;
    }
    const question = matchStateContext.question;
    if (!question) {
      return null;
    }
    const choices: JSX.Element[] = [];
    for (const choice of question.choices) {
      choices.push((
        <AnswerChoice answerChoice={choice} />
      ));
    }
    return (
      <React.Fragment>
        <Title order={5}>
          {question.prompt}
        </Title>
        <Flex
          gap="xs"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
          w="100%"
        >
          {choices}
        </Flex>
      </React.Fragment>
    );
  };

  return (
    <Flex
      gap="md"
      justify="flex-start"
      align="flex-start"
      direction="column"
      wrap="wrap"
    >
      {renderQuestion()}
    </Flex>
  );
}
