import {
  SIZE,
  DIRECTIONSP1,
  DIRECTIONSP2,
  POWERSP1,
  POWERSP2,
  // MOVING_DIRECTION,
  P1_START,
  P2_START,
  PACMAN_I,
  ENEMIES,
} from './parameters.js';
import { drawTiles, tiles, staticEffect } from './TilesRender.js';
import {
  updatePlayersPosition,
  updateEnemiesPosition,
  getWallCoords,
  shootPortal,
} from './TilesHandler.js';

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

for (let i = 0; i < ENEMIES.length; i += 1) {
  tiles[ENEMIES[i].y][ENEMIES[i].x] = ENEMIES[i].name;
}

tiles[P1_START.portal1.y][P1_START.portal1.x] = 'P1P1';
tiles[P1_START.portal2.y][P1_START.portal2.x] = 'P2P1';

tiles[P2_START.portal1.y][P2_START.portal1.x] = 'P1P2';
tiles[P2_START.portal2.y][P2_START.portal2.x] = 'P2P2';

const game = new BehaviorSubject({
  tiles,
  p1: P1_START,
  p2: P2_START,
  enemies: ENEMIES,
});

timer(0, 500)
  .pipe(
    withLatestFrom(game),
    map(([_, currentGame]) => {
      let [newTiles, newPlayer1, newPlayer2] = updatePlayersPosition(currentGame);
      let newEnemies = [];
      [newTiles, newEnemies, newPlayer1, newPlayer2] = updateEnemiesPosition({
        ...currentGame,
        tiles: newTiles,
        p1: newPlayer1,
        p2: newPlayer2,
      });
      return {
        ...currentGame,
        tiles: newTiles,
        p1: newPlayer1,
        p2: newPlayer2,
        enemies: newEnemies,
      };
    }),
  )
  .subscribe((currentGame) => {
    game.next(currentGame);
    // drawTiles(currentGame, ctx);
  });

interval(100)
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

const powersP1 = fromEvent(document, 'keydown')
  .pipe(
    filter(({ key }) => Object.keys(POWERSP1).includes(key)),
    withLatestFrom(game),
    map(([currentKeydown, currentGame]) => {
      const { p1, tiles } = currentGame;
      let newTiles;
      let newPortal;
      if (POWERSP1[currentKeydown.key] === 'portal1') {
        [newTiles, newPortal] = shootPortal(p1, p1.portal1, tiles);
        return {
          ...currentGame,
          p1: { ...p1, portal1: newPortal },
          tiles: newTiles,
        };
      } if (POWERSP1[currentKeydown.key] === 'portal2') {
        [newTiles, newPortal] = shootPortal(p1, p1.portal2, tiles);
        return {
          ...currentGame,
          p1: { ...p1, portal2: newPortal },
          tiles: newTiles,
        };
      }
      return currentGame;
    }),
  )
  .subscribe((currentGame) => {
    game.next(currentGame);
  });


const powersP2 = fromEvent(document, 'keydown')
  .pipe(
    filter(({ key }) => Object.keys(POWERSP2).includes(key)),
    withLatestFrom(game),
    map(([currentKeydown, currentGame]) => {
      const { p2, tiles } = currentGame;
      let newTiles;
      let newPortal;
      if (POWERSP2[currentKeydown.key] === 'portal1') {
        [newTiles, newPortal] = shootPortal(p2, p2.portal1, tiles);
        return {
          ...currentGame,
          p2: { ...p2, portal1: newPortal },
          tiles: newTiles,
        };
      } if (POWERSP2[currentKeydown.key] === 'portal2') {
        [newTiles, newPortal] = shootPortal(p2, p2.portal2, tiles);
        return {
          ...currentGame,
          p2: { ...p2, portal2: newPortal },
          tiles: newTiles,
        };
      }
      return currentGame;
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
    game.next(currentGame);
  });

game.subscribe((currentGame) => {
  drawTiles(currentGame, ctx);
  staticEffect(ctx, canvas.width, canvas.height);
});
