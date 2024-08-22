import { useCallback, useEffect, useState } from "react";
import { Button, Text, Title, StyleProp, DefaultMantineColor, MantineGradient, Anchor } from "@mantine/core";
import { useLocation } from "wouter";
import { useInterval } from "@mantine/hooks";
import APIUtils from "../../lib/APIUtils";
import slidersIcon from "./../../assets/sliders.svg";
import databaseIcon from "./../../assets/database.svg";
import friendsIcon from "./../../assets/users.svg";
import heartIcon from "./../../assets/heart.svg";
import classes from "./HomePage.module.css";
import StyleUtils from "../../lib/StyleUtils";
import FloaterContainer from "../../components/FloaterContainer/FloaterContainer";
import { motion } from "framer-motion";
import MotionUtils from "../../lib/MotionUtils";

interface FeatureItem {
  icon: string;
  iconAlt: string;
  caption: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: friendsIcon,
    iconAlt: "friends",
    caption: "Play with Friends",
    description: "Play with your friends in real time. Just create a room, and share the link!"
  },
  {
    icon: databaseIcon,
    iconAlt: "database",
    caption: "Over 5,000 Questions",
    description: "Over 5,000 trivia questions spanning a variety of categories."
  },
  {
    icon: slidersIcon,
    iconAlt: "slliders",
    caption: "Customizable Settings",
    description: "Customize your trivia game to specify the number of questions, points, and more!"
  },
];

const DEFAULT_FONT_COLOR = StyleUtils.THEME_CONFIG.textColor;
const HEADER_CONTENT_FONT_COLOR = "white";

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

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, [interval]);

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
      <Title className={classes["trivia-title"] + " z-20"} order={1} c={DEFAULT_FONT_COLOR}>
        {renderTriviaText(0, "violet", "cyan")}
        {renderTriviaText(1, "red", "grape")}
        {renderTriviaText(2, "green", "yellow")}
      </Title>
    );
  };

  const onClick_CreateRoomButton = useCallback(async (): Promise<void> => {
    // FIXME: Use Tanstack Query.
    // NOTE: RoomID is /RoomID (prefixed with /).
    const roomID = await APIUtils.createRoom();
    // FIXME: Create helper in APIUtils.
    setLocation(`/r${roomID}`);
  }, [setLocation]);

  const renderFeature = (item: FeatureItem): JSX.Element => {
    return (
      <motion.div
        key={item.iconAlt}
        className={`
          ${classes["sub-detail-item"]} flex flex-col items-center justify-center flex-wrap gap-0 w-[200px] mx-4`
        }
        variants={MotionUtils.featureContainer_Feature}
      >
        <motion.img
          src={item.icon} alt={item.iconAlt}
          variants={MotionUtils.featureContainer_FeatureIcon}
        />
        <Text c="dimmed" ta="center">
          {item.caption}
        </Text>
        <Text ta="center" c={DEFAULT_FONT_COLOR}>
          {item.description}
        </Text>
      </motion.div>
    );
  };

  const renderFeatures = (): JSX.Element => {
    return (
      <div
        className="flex flex-row justify-center items-baseline flex-wrap gap-0 pt-8 pb-4"
      >
        {features.map((value: FeatureItem) => {
          return renderFeature(value);
        })}
      </div>
    );
  };

  const renderThanks = (): JSX.Element => {
    return (
      <motion.div
        className={"flex flex-col items-center justify-center flex-wrap gap-0 px-8 pb-8"}
        variants={MotionUtils.featureContainer_Feature}
      >
        <div className="mb-4">
          <motion.img
            src={heartIcon} alt="heart"
            variants={MotionUtils.featureContainer_FeatureIcon}
          />
        </div>
        <div>
          <p className="text-center">
            Special thanks to the individuals at Open Trivia Database for providing the trivia questions.
          </p>
          <p className="text-center">
            {/* eslint-disable-next-line quotes */}
            {`Open Trivia DB is created and maintained by the good folks at `}
            <Anchor href="https://www.pixeltailgames.com/" target="_blank" underline="always">
              PIXELTAIL GAMES LLC
            </Anchor>.
          </p>
        </div>
      </motion.div>
    );
  };

  const renderMainTitle = (): JSX.Element => {
    return (
      <div
        className={`${classes["home-page-header-background"]} flex flex-col justify-center items-center flex-wrap gap-0 h-screen`}
      >
        {renderTriviaTitle()}
        <Text c={HEADER_CONTENT_FONT_COLOR} ta="center" pl="xs" pr="xs" className="z-20">
          Play Trivia by yourself or with your friends!
        </Text>
        <div>
          <Button
            onClick={onClick_CreateRoomButton}
            variant="filled"
            mt="md"
            color={StyleUtils.DEFAULT_ACTION_BUTTON_COLOR}
            className="z-20"
          >
            Play Now
          </Button>
        </div>
        <FloaterContainer />
      </div>
    );
  };

  return (
    <div>
      {renderMainTitle()}
      <div
        className="w-full h-10 bg-gradient-to-r from-floater-blue via-floater-red to-floater-yellow"
      />
      <motion.div
        className="overflow-x-hidden overflow-y-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={MotionUtils.featureContainer}
      >
        {renderFeatures()}
        {renderThanks()}
      </motion.div>
    </div >
  );
}
