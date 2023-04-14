import { WALL_I, SIZE, PACMAN_I, ENEMIES, DOT } from './parameters.js';

const drawTileCharacter = (ctx, player) => {
  ctx.drawImage(player.image, player.x * SIZE, player.y * SIZE, SIZE, SIZE);
};

const drawTileWall = (ctx, column, row) => {
  ctx.drawImage(WALL_I, column * SIZE, row * SIZE, SIZE, SIZE);
};

const drawPortal = (ctx, column, row, sprite) => {
  ctx.drawImage(sprite, column * SIZE, row * SIZE, SIZE, SIZE);
};

const drawTileEmpty = (ctx, column, row) => {
  ctx.fillRect(column * SIZE, row * SIZE, SIZE, SIZE);
};

const drawDot = (ctx, columnIndex, rowIndex) => {
  ctx.drawImage(DOT, columnIndex * SIZE, rowIndex * SIZE, SIZE, SIZE);
};

const drawTile = (tile, ctx, columnIndex, rowIndex, p1, p2) => {
  switch (tile) {
    case 0:
      drawTileEmpty(ctx, columnIndex, rowIndex);
      break;
    case 1:
      drawTileWall(ctx, columnIndex, rowIndex);
      break;
    case 'P1':
      drawTileCharacter(ctx, p1);
      break;
    case 'P1P1':
      drawPortal(ctx, columnIndex, rowIndex, p1.portal1.image);
      break;
    case 'P2P1':
      drawPortal(ctx, columnIndex, rowIndex, p1.portal2.image);
      break;
    case 'P1P2':
      drawPortal(ctx, columnIndex, rowIndex, p2.portal1.image);
      break;
    case 'P2P2':
      drawPortal(ctx, columnIndex, rowIndex, p2.portal2.image);
      break;
    case 'P2':
      drawTileCharacter(ctx, p2);
      break;
    case 'E1':
      drawTileCharacter(ctx, ENEMIES[0]);
      break;
    case 'E2':
      drawTileCharacter(ctx, ENEMIES[1]);
      break;
    case 'E3':
      drawTileCharacter(ctx, ENEMIES[2]);
      break;
    case 'E4':
      drawTileCharacter(ctx, ENEMIES[3]);
      break;
    case 2:
      drawDot(ctx, columnIndex, rowIndex);
      break;
    default:
      drawTileEmpty(ctx, columnIndex, rowIndex);
      break;
  }
};

const drawTiles = ({ tiles, p1, p2 }, ctx) => tiles.forEach((row, rowIndex) => row.forEach((tile, columnIndex) => drawTile(tile, ctx, columnIndex, rowIndex, p1, p2)));

const staticEffect = (ctx, screenWidth, screenHeight) => {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  for (let y = 0; y < screenHeight; y += 2) {
    ctx.fillRect(0, y, screenWidth, 1);
  }

  const imageData = ctx.getImageData(0, 0, screenWidth, screenHeight);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];

    imageData.data[i + 2] = b * 0.8; // Darken the blue channel

    // Add some random noise to each color channel
    const noise = Math.random() * 20 - 10;
    imageData.data[i] += noise;
    imageData.data[i + 1] += noise;
    imageData.data[i + 2] += noise;
  }

  ctx.putImageData(imageData, 0, 0);
};

const tiles = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1],
  [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 1, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1],
  [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 1, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export { drawTiles, tiles, staticEffect };
