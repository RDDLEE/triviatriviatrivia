import { FaRegCircle } from "react-icons/fa6";
import { FaRegSquare } from "react-icons/fa6";
import { LuDiamond } from "react-icons/lu";
import { IconType } from "react-icons";

import classes from "./Floater.module.css";
import StyleUtils from "../../../lib/StyleUtils";

const floaterIcons: IconType[] = [FaRegCircle, FaRegSquare, LuDiamond];

interface Floater_Props {
  x: number
  size: number;
  duration: number;
  initialDelay: number;
}

export default function Floater(props: Floater_Props) {
  const generateRandomColor = (): string => {
    const colors = [
      StyleUtils.FLOATER_COLOR_BLUE, StyleUtils.FLOATER_COLOR_RED, StyleUtils.FLOATER_COLOR_YELLOW
    ];
    const randIndx = Math.floor(Math.random() * colors.length);
    const color = colors[randIndx];
    if (color === undefined) {
      return "#3E3E3E";
    }
    return color;
  };

  const renderNote = (): JSX.Element | null => {
    const randIdx = Math.floor(Math.random() * floaterIcons.length);
    const icon = floaterIcons[randIdx];
    if (icon === undefined) {
      return null;
    }
    return icon({
      size: `${props.size}em`,
      // TODO: Randomize colors.
      color: generateRandomColor(),
    });
  };

  return (
    <div
      className={`${classes["note"]} pointer-events-none absolute bottom-0 z-10`}
      style={{
        left: `${props.x}vw`,
        animationDuration: `${props.duration}s`,
        animationDelay: `${props.initialDelay}s`,
      }}
    >
      {renderNote()}
    </div>
  );
}
