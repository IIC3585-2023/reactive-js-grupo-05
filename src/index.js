import {
  SIZE,
  DIRECTIONSP1,
  DIRECTIONSP2,
  POWERSP1,
  POWERSP2,
  P1_START,
  P2_START,
  PACMAN_I,
  ENEMIES,
} from './parameters.js';
import {
  drawTiles, tiles, staticEffect, TOTAL_POINTS,
} from './TilesRender.js';
import {
  updatePlayersPosition,
  updateEnemiesPosition,
  shootPortal,
} from './TilesHandler.js';

const {
  fromEvent, filter, timer, BehaviorSubject, interval,
} = rxjs;
const {
  withLatestFrom, map, takeUntil, skipUntil,
} = rxjs.operators;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const drawText = (text, yPos, size) => {
  const centerX = canvas.width / 2;
  const centerY = yPos || canvas.height / 2;
  const fontSize = size || '150';
  ctx.font = `${fontSize}px 'Courier New'`;
  ctx.textAlign = 'center';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 5;
  ctx.strokeText(text, centerX, centerY);
  ctx.fillText(text, centerX, centerY);
};

const drawStart = () => {
  const centerY = canvas.height / 10;
  drawText('START');
  drawText('P1: WASD      P2: ↑←↓→  ', centerY * 6, 50);
  drawText('Portal: CV    Portal: OP', centerY * 7, 50);
};

const drawScores = ({ points: p1Scores }, { points: p2Scores }) => {
  const centerY = canvas.height / 6;
  drawText('GAME OVER', centerY * 2);
  if (p1Scores === p2Scores) {
    drawText('DRAW', centerY * 3, 100);
  } else {
    const winner = p1Scores > p2Scores ? 'P1' : 'P2';
    drawText(`${winner} WINS`, centerY * 3, 100);
  }
  drawText(`P1: ${p1Scores}`, centerY * 4, 100);
  drawText(`P2: ${p2Scores}`, centerY * 5, 100);
};

const clearCanvas = () => {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
};

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
window.addEventListener('load', () => {
  resizeCanvas();
  drawStart();
  // ctx.fillStyle = 'black';
});

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
  started: false,
  over: false,
});

const checkGameOver = (currentGame) => {
  const { p1, p2, enemies } = currentGame;
  if (!p1.alive && !p2.alive) {
    return true;
  }
  const totalPoints = p1.points
    + p2.points
    + enemies.reduce((total, { points }) => total + points, 0);
  return totalPoints === TOTAL_POINTS;
};

// GAME TICKS
timer(0, 500)
  .pipe(
    skipUntil(game.pipe(filter((currentGame) => currentGame.started))),
    takeUntil(game.pipe(filter((currentGame) => currentGame.over))),
    withLatestFrom(game),
    map(([, currentGame]) => {
      if (checkGameOver(currentGame)) {
        return { ...currentGame, over: true };
      }
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
  });

// ANIMATION TICKS
interval(100)
  .pipe(
    skipUntil(game.pipe(filter((currentGame) => currentGame.started))),
    takeUntil(game.pipe(filter((currentGame) => currentGame.over))),
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

fromEvent(document, 'keydown')
  .pipe(
    takeUntil(game.pipe(filter((currentGame) => currentGame.over))),
    skipUntil(game.pipe(filter((currentGame) => currentGame.started))),
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

fromEvent(document, 'keydown')
  .pipe(
    takeUntil(game.pipe(filter((currentGame) => currentGame.over))),
    skipUntil(game.pipe(filter((currentGame) => currentGame.started))),
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
      }
      if (POWERSP1[currentKeydown.key] === 'portal2') {
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

fromEvent(document, 'keydown')
  .pipe(
    takeUntil(game.pipe(filter((currentGame) => currentGame.over))),
    skipUntil(game.pipe(filter((currentGame) => currentGame.started))),
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
      }
      if (POWERSP2[currentKeydown.key] === 'portal2') {
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

fromEvent(document, 'keydown')
  .pipe(
    takeUntil(game.pipe(filter((currentGame) => currentGame.over))),
    skipUntil(game.pipe(filter((currentGame) => currentGame.started))),
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

// GAME
game.subscribe((currentGame) => {
  drawTiles(currentGame, ctx);
  staticEffect(ctx, canvas.width, canvas.height);
});

// START EVENT
fromEvent(canvas, 'click')
  .pipe(
    takeUntil(game.pipe(filter((currentGame) => currentGame.started))),
    withLatestFrom(game),
    map(([, currentGame]) => ({
      ...currentGame,
      started: true,
    })),
  )
  .subscribe((newGame) => {
    game.next(newGame);
    clearCanvas();
  });

// GAME OVER EVENT

game
  .pipe(filter((currentGame) => currentGame.over))
  .subscribe((currentGame) => {
    clearCanvas();
    drawScores(currentGame.p1, currentGame.p2);
    staticEffect(ctx, canvas.width, canvas.height);
  });
