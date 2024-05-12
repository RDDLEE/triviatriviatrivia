import { useCallback, useContext } from "react";
import { Modal } from "@mantine/core";
import useMatchSettingsForm from "../MatchSettingsForm/useMatchSettingsForm";
import { MatchSettingsModalContext } from "../../pages/RoomPage/RoomPage";

export default function MatchSettingsModal() {
  const settingsModalContext = useContext(MatchSettingsModalContext);

  const matchSettingsForm = useMatchSettingsForm();

  const isModalOpen = useCallback((): boolean => {
    if (settingsModalContext === null) {
      return false;
    }
    return settingsModalContext.isOpen;
  }, [settingsModalContext]);

  const getModalOnClose = useCallback((): () => void => {
    if (settingsModalContext === null) {
      return () => {};
    }
    return settingsModalContext.close;
  }, [settingsModalContext]);

  return (
    <Modal opened={isModalOpen()} onClose={getModalOnClose()} title="Match Settings" size="md">
      {matchSettingsForm.renderForm()}
    </Modal>
  );
}