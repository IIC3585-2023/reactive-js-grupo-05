const SIZE = 64;

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
  }

const DIRECTIONSP2 = {
    w: MOVING_DIRECTION.up,
    s: MOVING_DIRECTION.down,
    a: MOVING_DIRECTION.left,
    d: MOVING_DIRECTION.right,
  }



const WALL_I = new Image();
WALL_I.src = '../sprites/wall.png'

const PACMAN_UP = new Image();
PACMAN_UP.src = '../sprites/pacman-up.png';
const PACMAN_DOWN = new Image();
PACMAN_DOWN.src = '../sprites/pacman-down.png';
const PACMAN_LEFT = new Image();
PACMAN_LEFT.src = '../sprites/pacman-left.png';
const PACMAN_RIGHT = new Image();
PACMAN_RIGHT.src = '../sprites/pacman-right.png';
const PACMAN_CIRCLE = new Image();
PACMAN_CIRCLE.src = '../sprites/pacman-circle.png';

const PACMAN_I = {
  up: PACMAN_UP,
  down: PACMAN_DOWN,
  left: PACMAN_LEFT,
  right: PACMAN_RIGHT,
  circle: PACMAN_CIRCLE,
};

const P1_START = {
  x: 1,
  y: 1,
  direction: MOVING_DIRECTION.right,
  alive: true,
  image: PACMAN_I.up
};

const P2_START = {
  x: 13,
  y: 11,
  direction: MOVING_DIRECTION.right,
  alive: true,
  image: PACMAN_I.up
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
};