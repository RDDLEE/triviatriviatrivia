import { useCallback } from "react";
import { Box, Button, Text, Flex, Title } from "@mantine/core";
import { useLocation } from "wouter";
import APIUtils from "../../lib/APIUtils";
import React from "react";

export default function HomePage() {

  const [_, setLocation] = useLocation();

  const onClick_CreateRoomButton = useCallback(async (): Promise<void> => {
    // FIXME: Use Tanstack Query.
    const roomID = await APIUtils.createRoom();
    setLocation(roomID);
  }, [setLocation]);

  const renderSubdetails = (): JSX.Element => {
    return (
      <Flex
        gap={0}
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
        mt="md"
      >
        I am details
      </Flex>
    );
  };

  return (
    <React.Fragment>
      <Flex
        gap={0}
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
        // TODO: Extract to css.
        pt="10em"
        bg="blue"
        pb="10em"
      >
        <Title order={1}>
          TriviaTriviaTrivia
        </Title>
        <Text>
          Play Trivia by yourself or with your friends!
        </Text>
        <Box>
          <Button
            onClick={onClick_CreateRoomButton}
            variant="filled"
            color="green"
            mt="md"
          >
            Create Room
          </Button>
        </Box>
      </Flex>
      {renderSubdetails()}
    </React.Fragment >
  );
}
