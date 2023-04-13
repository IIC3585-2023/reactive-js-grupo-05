const SIZE = 50;

const MOVING_DIRECTION = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
};

const DIRECTIONSP1 = {
  ArrowUp: MOVING_DIRECTION.up,
  ArrowDown: MOVING_DIRECTION.down,
  ArrowLeft: MOVING_DIRECTION.left,
  ArrowRight: MOVING_DIRECTION.right,
};

const DIRECTIONSP2 = {
  w: MOVING_DIRECTION.up,
  s: MOVING_DIRECTION.down,
  a: MOVING_DIRECTION.left,
  d: MOVING_DIRECTION.right,
};

const WALL_I = new Image();
WALL_I.src = './src/sprites/wall.png';

const PACMAN_UP = new Image();
PACMAN_UP.src = './src/sprites/pacman-up.png';
const PACMAN_DOWN = new Image();
PACMAN_DOWN.src = './src/sprites/pacman-down.png';
const PACMAN_LEFT = new Image();
PACMAN_LEFT.src = './src/sprites/pacman-left.png';
const PACMAN_RIGHT = new Image();
PACMAN_RIGHT.src = './src/sprites/pacman-right.png';
const PACMAN_CIRCLE = new Image();
PACMAN_CIRCLE.src = './src/sprites/pacman-circle.png';

const PACMAN_I = {
  up: PACMAN_UP,
  down: PACMAN_DOWN,
  left: PACMAN_LEFT,
  right: PACMAN_RIGHT,
  circle: PACMAN_CIRCLE,
};

const PORTAL1P1 = new Image();
PORTAL1P1.src = './src/sprites/portal-p1-blue.png';

const PORTAL2P1 = new Image();
PORTAL2P1.src = './src/sprites/portal-p1-orange.png';

const PORTAL1P2 = new Image();
PORTAL1P2.src = './src/sprites/portal-p2-blue.png';
const PORTAL2P2 = new Image();
PORTAL2P2.src = './src/sprites/portal-p2-orange.png';

const P1_START = {
  x: 1,
  y: 1,
  direction: MOVING_DIRECTION.right,
  alive: true,
  image: PACMAN_I.up,
  name: 'P1',
  portal1: {
    x: 0,
    y: 4,
    image: PORTAL1P1,
    name: 'P1P1',
    exitDirection: MOVING_DIRECTION.right,
  },
  portal2: {
    x: 4,
    y: 0,
    image: PORTAL2P1,
    name: 'P2P1',
    exitDirection: MOVING_DIRECTION.down,
  },
};

const P2_START = {
  x: 11,
  y: 9,
  direction: MOVING_DIRECTION.right,
  alive: true,
  image: PACMAN_I.up,
  name: 'P2',
  portal1: {
    x: 0,
    y: 6,
    image: PORTAL1P2,
    name: 'P1P2',
    exitDirection: MOVING_DIRECTION.right,
  },
  portal2: {
    x: 6,
    y: 0,
    image: PORTAL2P2,
    name: 'P2P2',
    exitDirection: MOVING_DIRECTION.down,
  },
};

export {
  SIZE,
  MOVING_DIRECTION,
  DIRECTIONSP1,
  DIRECTIONSP2,
  WALL_I,
  PACMAN_I,
  P1_START,
  P2_START,
  PORTAL1P1,
  PORTAL1P2,
  PORTAL2P1,
  PORTAL2P2,
};
