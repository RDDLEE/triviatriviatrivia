import { Flex, Loader, Text } from "@mantine/core";

export default function WaitingForMatchStart() {
  return (
    <Flex
      mih={100}
      gap="xs"
      justify="center"
      align="center"
      direction="column"
      wrap="wrap"
    >
      <Loader color="blue" size="xl" type="bars" />
      <Text>
        Starting Game...
      </Text>
    </Flex>
  );
}