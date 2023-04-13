import { WALL_I, SIZE, PACMAN_I } from './parameters.js';

const drawTilePacman = (ctx, column, row, player) => {
  ctx.drawImage(
    player.image,
    column * SIZE,
    row * SIZE,
    SIZE,
    SIZE,
  );
}

const drawTileWall = (ctx, column, row) => {
  ctx.drawImage(
    WALL_I,
    column * SIZE,
    row * SIZE,
    SIZE,
    SIZE,
  );
}

const drawTileEmpty = (ctx, column, row) => {
  ctx.fillRect(
    column * SIZE,
    row * SIZE,
    SIZE,
    SIZE,
  );
}

const drawTile = (tile, ctx, columnIndex, rowIndex, p1, p2) => {
  switch (tile) {
    case 0:
      drawTileEmpty(ctx, columnIndex, rowIndex);
      break;
    case 1:
      drawTileWall(ctx, columnIndex, rowIndex);
      break;
    case 'P1':
      drawTilePacman(ctx, columnIndex, rowIndex, p1);
      break;
    case 'P2':
        drawTilePacman(ctx, columnIndex, rowIndex, p2);
        break;
    default:
      drawTileEmpty(ctx, columnIndex, rowIndex);
      break;
  }
};

const drawTiles = ({ tiles, p1, p2 }, ctx) => tiles.forEach((row, rowIndex) => row.forEach(
  (tile, columnIndex)=>drawTile(tile, ctx, columnIndex, rowIndex, p1, p2)
));

const didCollideWithEnvironment = ({ x, y, direction }, tiles) => {
  switch (direction) {
    case MovingDirection.right:
      return tiles[y][x + 1] === 1;
    case MovingDirection.left:
      return tiles[y][x - 1] === 1;
    case MovingDirection.up:
      return tiles[y - 1][x] === 1;
    case MovingDirection.down:
      return tiles[y + 1][x] === 1;
    default:
      return false;
  }
}

const tiles = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 'P1', 0, 0, 4, 0, 0, 0, 0, 0, 0, 7, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 6, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 7, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'P2', 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export {
  drawTiles,
  didCollideWithEnvironment,
  tiles,
}
