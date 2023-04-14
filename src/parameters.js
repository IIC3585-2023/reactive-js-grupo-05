const SIZE = 50;

const MOVING_DIRECTION = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
};

const DIRECTIONSP1 = {
  w: MOVING_DIRECTION.up,
  s: MOVING_DIRECTION.down,
  a: MOVING_DIRECTION.left,
  d: MOVING_DIRECTION.right,
};

const DIRECTIONSP2 = {
  ArrowUp: MOVING_DIRECTION.up,
  ArrowDown: MOVING_DIRECTION.down,
  ArrowLeft: MOVING_DIRECTION.left,
  ArrowRight: MOVING_DIRECTION.right,
};

const POWERSP1 = {
  c: 'portal1',
  v: 'portal2',
};

const POWERSP2 = {
  o: 'portal1',
  p: 'portal2',
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
  direction: MOVING_DIRECTION.left,
  alive: true,
  image: PACMAN_I.up,
  name: 'P1',
  points: 0,
  portal1: {
    x: 0,
    y: 1,
    image: PORTAL1P1,
    name: 'P1P1',
    exitDirection: MOVING_DIRECTION.right,
  },
  portal2: {
    x: 1,
    y: 0,
    image: PORTAL2P1,
    name: 'P2P1',
    exitDirection: MOVING_DIRECTION.down,
  },
};

const ENEMY1 = new Image();
ENEMY1.src = './src/sprites/enemy-1.png';

const ENEMY2 = new Image();
ENEMY2.src = './src/sprites/enemy-2.png';

const ENEMY3 = new Image();
ENEMY3.src = './src/sprites/enemy-3.png';

const ENEMY4 = new Image();
ENEMY4.src = './src/sprites/enemy-4.png';

const DOT = new Image();
DOT.src = './src/sprites/dot.png';

const P2_START = {
  x: 18,
  y: 17,
  direction: MOVING_DIRECTION.right,
  alive: true,
  image: PACMAN_I.right,
  name: 'P2',
  points: 0,
  portal1: {
    x: 18,
    y: 18,
    image: PORTAL1P2,
    name: 'P1P2',
    exitDirection: MOVING_DIRECTION.up,
  },
  portal2: {
    x: 19,
    y: 17,
    image: PORTAL2P2,
    name: 'P2P2',
    exitDirection: MOVING_DIRECTION.left,
  },
};

const ENEMIES = [
  {
    x: 1,
    y: 10,
    direction: MOVING_DIRECTION.right,
    alive: true,
    image: ENEMY1,
    name: 'E1',
    points: 0,
  },
  {
    x: 5,
    y: 17,
    direction: MOVING_DIRECTION.right,
    alive: true,
    image: ENEMY2,
    name: 'E2',
    points: 0,
  },
  {
    x: 12,
    y: 15,
    direction: MOVING_DIRECTION.right,
    alive: true,
    image: ENEMY3,
    name: 'E3',
    points: 0,
  },
  {
    x: 11,
    y: 9,
    direction: MOVING_DIRECTION.right,
    alive: true,
    image: ENEMY4,
    name: 'E4',
    points: 0,
  },
];

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
  ENEMIES,
  POWERSP1,
  POWERSP2,
  DOT,
};
