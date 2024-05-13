import { useCallback, useEffect, useState } from "react";
import { Box, Button, Text, Flex, Title, StyleProp, DefaultMantineColor, MantineGradient, Anchor } from "@mantine/core";
import { useLocation } from "wouter";
import APIUtils from "../../lib/APIUtils";
import slidersLogo from "./../../assets/sliders.svg";
import databaseLogo from "./../../assets/database.svg";
import friendsLogo from "./../../assets/users.svg";
import classes from "./HomePage.module.css";
import { useInterval } from "@mantine/hooks";
import StyleUtils from "../../lib/StyleUtils";

interface featureItem {
  icon: string;
  iconAlt: string;
  caption: string;
  description: string;
}

export default function HomePage() {
  const [_, setLocation] = useLocation();

  const [triviaIndex, setTriviaIndex] = useState<number>(0);
  const interval = useInterval(() => {
    setTriviaIndex((prevIndex) => {
      if (prevIndex === 2) {
        return 0;
      }
      return prevIndex + 1;
    });
  }, 1500);

  const DEFAULT_FONT_COLOR = StyleUtils.THEME_CONFIG.textColor;
  const HEADER_CONTENT_FONT_COLOR = "white";

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, [interval]);

  const features: featureItem[] = [
    {
      icon: friendsLogo,
      iconAlt: "friends",
      caption: "Play with Friends",
      description: "Play with your friends in real time. Just create a room, and share the link!"
    },
    {
      icon: databaseLogo,
      iconAlt: "database",
      caption: "Over 5,000 Questions",
      description: "Over 5,000 trivia questions spanning a variety of categories."
    },
    {
      icon: slidersLogo,
      iconAlt: "slliders",
      caption: "Customizable Settings",
      description: "Customize your trivia game to specify the number of questions, points, and more!"
    },
  ];

  const renderTriviaText = (index: number, color1: string, color2: string): JSX.Element => {
    let iColor: StyleProp<DefaultMantineColor> | undefined = HEADER_CONTENT_FONT_COLOR;
    let gradient: MantineGradient | undefined = undefined;
    let variant = "text";
    if (triviaIndex === index) {
      iColor = undefined;
      variant = "gradient";
      gradient = { deg: 90, from: color1, to: color2 };
    }
    return (
      <Text
        key={index}
        component="span"
        fz="inherit"
        fw="inherit"
        gradient={gradient}
        variant={variant}
        c={iColor}
      >
        Trivia
      </Text>
    );
  };

  const renderTriviaTitle = (): JSX.Element => {
    return (
      <Title order={1} c={DEFAULT_FONT_COLOR}>
        {renderTriviaText(0, "violet", "cyan")}
        {renderTriviaText(1, "red", "grape")}
        {renderTriviaText(2, "green", "yellow")}
      </Title>
    );
  };

  const onClick_CreateRoomButton = useCallback(async (): Promise<void> => {
    // FIXME: Use Tanstack Query.
    const roomID = await APIUtils.createRoom();
    setLocation(roomID);
  }, [setLocation]);

  const renderFeature = (item: featureItem): JSX.Element => {
    return (
      <Flex
        key={item.iconAlt}
        className={classes["sub-detail-item"]}
        gap={0}
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
        w="200px"
        ml="md"
        mr="md"
      >
        <img src={item.icon} alt={item.iconAlt} />
        <Text c="dimmed" ta="center">
          {item.caption}
        </Text>
        <Text ta="center" c={DEFAULT_FONT_COLOR}>
          {item.description}
        </Text>
      </Flex>
    );
  };

  const renderFeatures = (): JSX.Element => {
    return (
      <Flex
        gap={0}
        justify="center"
        align="baseline"
        direction="row"
        wrap="wrap"
        pt="xl"
        pb="xl"
      >
        {features.map((value: featureItem) => {
          return renderFeature(value);
        })}
      </Flex>
    );
  };

  const renderThanks = (): JSX.Element => {
    return (
      <Flex
        gap={0}
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
        pt="xl"
        pb="xl"
      >
        <Text>
          Special thanks to the individuals at Open Trivia Database for providing the trivia questions.
        </Text>
        <Text>
          {/* eslint-disable-next-line quotes */}
          {`Open Trivia DB is created and maintained by the good folks at `}
          <Anchor href="https://www.pixeltailgames.com/" target="_blank" underline="always">
            PIXELTAIL GAMES LLC
          </Anchor>.
        </Text>
      </Flex>
    );
  };

  return (
    <Box>
      <Flex
        className={classes["home-page-header-background"]}
        gap={0}
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
        h="100vh"
      >
        {renderTriviaTitle()}
        <Text c={HEADER_CONTENT_FONT_COLOR}>
          Play Trivia by yourself or with your friends!
        </Text>
        <Box>
          <Button
            onClick={onClick_CreateRoomButton}
            variant="filled"
            mt="md"
            color={StyleUtils.DEFAULT_ACTION_BUTTON_COLOR}
          >
            Play Now
          </Button>
        </Box>
      </Flex>
      {renderFeatures()}
      {renderThanks()}
    </Box>
  );
}
