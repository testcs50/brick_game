const o = [
  [1, 4], [1, 5], [2, 4], [2, 5],
];

const j = [
  [0, 5], [1, 5], [2, 5], [2, 4],
];

const l = [
  [0, 4], [1, 4], [2, 4], [2, 5],
];

const i = [
  [2, 3], [2, 4], [2, 5], [2, 6],
];

const t = [
  [0, 5], [1, 5], [2, 5], [1, 4],
];

const s = [
  [0, 4], [1, 4], [1, 5], [2, 5],
];

const z = [
  [0, 5], [1, 5], [1, 4], [2, 4],
];

export const blocks = [
  o, j, l, i, t, s, z,
];

export const onOffKey = "onoff";
export const sPKey = "sp";
export const soundKey = "sound";
export const resetKey = "reset";
export const rightKey = "right";
export const upKey = "up";
export const leftKey = "left";
export const downKey = "down";
export const rotateKey = "rotate";

export const keys = [onOffKey, sPKey, soundKey, resetKey, rightKey, upKey, leftKey, downKey, rotateKey];

export const bigGrid = new Array(24).fill(new Array(10).fill(0));

export const defaultStore = { getReady: 3,
  onOff: true,
  pause: false,
  grid: bigGrid,
  block: null,
  blockIndex: null,
  nextBlockIndex: null,
  level: 1,
  count: 0,
  score: 0,
  highScore: 0,
  gameOver: false };
