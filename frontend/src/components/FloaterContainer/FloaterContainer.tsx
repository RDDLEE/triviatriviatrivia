import Floater from "./Floater/Floater";

const NUM_FLOATERS = 35;

const MIN_SIZE = 5;
const MAX_SIZE = 10;

const MIN_DURATION = 8;
const MAX_DURATION = 40;

const MAX_DELAY = 20;

const generateDuration = (size: number): number => {
  return MIN_DURATION + (size / MAX_SIZE) * (MAX_DURATION - MIN_DURATION);
};

const generateDelay = (): number => {
  return Math.random() * MAX_DELAY;
};

const generateX = (num: number): number => {
  return num * (90 / NUM_FLOATERS);
};

const generateSize = (): number => {
  return Math.max(MIN_SIZE, Math.random() * MAX_SIZE);
};

const generateFloaters = (): JSX.Element[] => {
  const floaters = [];
  for (let i = 0; i < NUM_FLOATERS; i++) {
    const size = generateSize();
    floaters.push((
      <Floater
        key={i} x={generateX(i)}
        size={size} duration={generateDuration(size)}
        initialDelay={generateDelay()}
      />
    ));
  }
  return floaters;
};

const floaters = generateFloaters();

export default function FloaterContainer() {
  return (
    <div id="floater-container" className="absolute top-0 right-0 left-0 bottom-0 overflow-x-hidden">
      {floaters}
    </div>
  );
}
