import { MOVING_DIRECTION } from './parameters.js';

const didCollideWithEnvironment = ({ x, y, direction }, tiles) => {
  // console.log(tiles, y, x);
  switch (direction) {
    case MOVING_DIRECTION.right:
      return tiles[y][x + 1] != 0;
    case MOVING_DIRECTION.left:
      return tiles[y][x - 1] != 0;
    case MOVING_DIRECTION.up:
      return tiles[y - 1][x] != 0;
    case MOVING_DIRECTION.down:
      return tiles[y + 1][x] != 0;
    default:
      return false;
  }
};

const updatePlayerPosition = (player, tiles) => {
  // console.log(tiles);
  if (!didCollideWithEnvironment(player, tiles)) {
    const newTiles = tiles;
    const { x, y, direction } = player;
    console.log(x, y, direction);
    newTiles[y][x] = 0;
    switch (direction) {
      case MOVING_DIRECTION.right:
        player.x += 1;
        newTiles[y][x + 1] = player.name;
        return newTiles;
      case MOVING_DIRECTION.left:
        player.x -= 1;
        newTiles[y][x - 1] = player.name;
        return newTiles;
      case MOVING_DIRECTION.up:
        player.y -= 1;
        newTiles[y - 1][x] = player.name;
        return newTiles;
      case MOVING_DIRECTION.down:
        player.y += 1;
        newTiles[y + 1][x] = player.name;
        return newTiles;
      default:
        return newTiles;
    }
  }
  return tiles;
};

const updatePlayersPosition = ({ p1, p2, tiles }) => {
  // console.log(p1, p2, tiles);
  let newTiles = tiles;
  newTiles = updatePlayerPosition(p1, newTiles);
  // console.log(newTiles);
  return updatePlayerPosition(p2, newTiles);
};

export {
  didCollideWithEnvironment,
  updatePlayerPosition,
  updatePlayersPosition,
};
