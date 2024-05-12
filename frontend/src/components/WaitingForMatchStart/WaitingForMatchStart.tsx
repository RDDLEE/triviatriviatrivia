import useMatchSettingsForm from "../MatchSettingsForm/useMatchSettingsForm";

export default function WaitingForMatchStart() {
  const matchSettingsForm = useMatchSettingsForm();

  return matchSettingsForm.renderForm();
}