import { Anchor, AppShell, Flex } from "@mantine/core";
import { Link } from "wouter";

export default function TriviaShell({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Flex
          gap="xs"
          justify="flex-start"
          align="center"
          direction="row"
          wrap="wrap"
          h="100%"
          pl="md"
        >
          <Link to="/" asChild>
            <Anchor underline="never" c="white" size="lg" fw={700}>
              TriviaTriviaTrivia
            </Anchor>
          </Link>
        </Flex>
      </AppShell.Header>
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
