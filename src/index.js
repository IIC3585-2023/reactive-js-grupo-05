import {
  SIZE,
  DIRECTIONSP1,
  DIRECTIONSP2,
  // MOVING_DIRECTION,
  P1_START,
  P2_START,
  PACMAN_I,
} from './parameters.js';
import { drawTiles, tiles, staticEffect } from './TilesRender.js';
import { updatePlayersPosition } from './TilesHandler.js';

const {
  fromEvent, merge, filter, pipe, timer, BehaviorSubject, interval,
} = rxjs;
const {
  sample, mapTo, withLatestFrom, map,
} = rxjs.operators;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';

// ctx.imageSmoothingEnabled = false;
//
// canvas.width = SIZE * tiles[0].length;
// canvas.height = SIZE * tiles.length;

const resizeCanvas = () => {
  const NUM_COLS = tiles[0].length;
  const NUM_ROWS = tiles.length;
  const aspectRatio = NUM_COLS / NUM_ROWS;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const screenAspectRatio = width / height;


  let scale;

  if (screenAspectRatio > aspectRatio) {
    scale = height / (SIZE * NUM_ROWS);
  } else {
    scale = width / (SIZE * NUM_COLS);
  }

  canvas.width = SIZE * NUM_COLS * scale;
  canvas.height = SIZE * NUM_ROWS * scale;

  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;

  ctx.scale(scale, scale);
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --------------------------------------------------------------
// --------------------------------------------------------------

tiles[P1_START.y][P1_START.x] = P1_START.name;
tiles[P2_START.y][P2_START.x] = P2_START.name;

const game = new BehaviorSubject({
  tiles,
  p1: P1_START,
  p2: P2_START,
});

timer(0, 500)
  .pipe(
    withLatestFrom(game),
    map(([_, currentGame]) => ({
      ...currentGame,
      tiles: updatePlayersPosition(currentGame),
    })),
  )
  .subscribe((currentGame) => {
    // console.log(updatePlayersPosition(currentGame));
    game.next(currentGame);
    // drawTiles(currentGame, ctx);
  });

interval(300)
  .pipe(
    withLatestFrom(game),
    map(([time, currentGame]) => {
      const { p1, p2 } = currentGame;
      if (time % 2 === 0) {
        p1.image = PACMAN_I[p1.direction];
        p2.image = PACMAN_I[p2.direction];
      } else {
        p1.image = PACMAN_I.circle;
        p2.image = PACMAN_I.circle;
      }
      return { ...currentGame, p1, p2 };
    }),
  )
  .subscribe((currentGame) => {
    // drawTiles(currentGame, ctx);
    game.next(currentGame);
  });

const keydownP1 = fromEvent(document, 'keydown')
  .pipe(
    filter(({ key }) => Object.keys(DIRECTIONSP1).includes(key)),
    withLatestFrom(game),
    map(([currentKeydown, currentGame]) => {
      const { p1 } = currentGame;
      return {
        ...currentGame,
        p1: { ...p1, direction: DIRECTIONSP1[currentKeydown.key] },
      };
    }),
  )
  .subscribe((currentGame) => {
    game.next(currentGame);
  });

const keydownP2 = fromEvent(document, 'keydown')
  .pipe(
    filter(({ key }) => Object.keys(DIRECTIONSP2).includes(key)),
    withLatestFrom(game),
    map(([currentKeydown, currentGame]) => {
      const { p2 } = currentGame;
      return {
        ...currentGame,
        p2: { ...p2, direction: DIRECTIONSP2[currentKeydown.key] },
      };
    }),
  )
  .subscribe((currentGame) => {
    // drawTiles(currentGame, ctx);
    game.next(currentGame);
  });

game.subscribe((currentGame) => {
  drawTiles(currentGame, ctx);
  staticEffect(ctx, canvas.width, canvas.height);
});
