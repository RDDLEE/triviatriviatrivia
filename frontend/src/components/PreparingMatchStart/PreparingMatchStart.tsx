import { Flex, Loader } from "@mantine/core";

export default function WaitingForMatchStart() {
  return (
    <Flex
      mih={100}
      gap="xs"
      justify="center"
      align="center"
      direction="row"
      wrap="wrap"
    >
      <Loader color="blue" size="xl" type="bars" />
    </Flex>
  );
}