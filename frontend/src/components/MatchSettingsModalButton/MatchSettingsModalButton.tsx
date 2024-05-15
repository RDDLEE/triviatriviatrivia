import { useContext } from "react";
import { Button } from "@mantine/core";
import { MatchSettingsModalContext } from "../../pages/RoomPage/RoomPage";
import settingsIcon from "./../../assets/settings.svg";
import StyleUtils from "../../lib/StyleUtils";

export interface MatchSettingsModalButton_Props {
  buttonText?: string;
  variant?: "filled";
  withIcon?: boolean;
}

export default function MatchSettingsModalButton(props: MatchSettingsModalButton_Props) {
  const settingsModalContext = useContext(MatchSettingsModalContext);

  const getButtonText = (): string => {
    const buttonText = props.buttonText;
    if (buttonText === undefined) {
      return "Match Settings";
    }
    return buttonText;
  };

  const getButtonVariant = (): string => {
    const buttonVariant = props.variant;
    if (buttonVariant === undefined) {
      return "light";
    }
    return buttonVariant;
  };

  const renderSettingsIcon = (): JSX.Element | null => {
    if (props.withIcon === undefined) {
      return null;
    }
    if (props.withIcon === false) {
      return null;
    }
    return (
      <img src={settingsIcon} alt="settings" />
    );
  };

  return (
    <Button
      variant={getButtonVariant()}
      size="xs"
      onClick={settingsModalContext?.open}
      fullWidth={true}
      mb="md"
      leftSection={renderSettingsIcon()}
      color={StyleUtils.DEFAULT_ACTION_BUTTON_COLOR}
    >
      {getButtonText()}
    </Button>
  );
}