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
          <Link to={import.meta.env.VITE_BASE_CLIENT_URL} asChild>
            <Anchor underline="never" c="green" size="lg">
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
