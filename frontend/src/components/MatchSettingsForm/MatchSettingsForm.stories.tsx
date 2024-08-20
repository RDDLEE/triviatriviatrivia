import type { Meta, StoryObj } from "@storybook/react";
import { MATCH_SETTINGS_POINTS_ON_CORRECT_DEFAULT, MATCH_SETTINGS_POINTS_ON_INCORRECT_DEFAULT, MATCH_SETTINGS_POINTS_ON_NO_ANSWER_DEFAULT, OTDB_CATEGORY_ANY_ID, QuestionProvider } from "trivia-shared";
import MatchSettingsForm from "./MatchSettingsForm";

const meta = {
  title: "Trivia/MatchSettingsForm",
  component: MatchSettingsForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof MatchSettingsForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    questionProvider: QuestionProvider.OPENTDB,
    category: OTDB_CATEGORY_ANY_ID,
    pointsOnCorrect: MATCH_SETTINGS_POINTS_ON_CORRECT_DEFAULT,
    pointsOnIncorrect: MATCH_SETTINGS_POINTS_ON_INCORRECT_DEFAULT,
    pointsOnNoAnswer: MATCH_SETTINGS_POINTS_ON_NO_ANSWER_DEFAULT,
    setCategory: () => { },
    setPointsOnCorrect: () => { },
    setPointsOnIncorrect: () => { },
    setPointsOnNoAnswer: () => { },
  },
};