import { Code } from "@mantine/core";
import StyleUtils from "../../lib/StyleUtils";

export interface ScoreDisplay_Props {
  score: number
}

export default function ScoreDisplay(props: ScoreDisplay_Props) {
  return (
    <Code fz="md" color="dark.4" c={StyleUtils.getColorOfScore(props.score)}>
      {props.score}
    </Code>
  );
}
