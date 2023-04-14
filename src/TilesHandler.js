import { MOVING_DIRECTION } from './parameters.js';

const getOppositeDir = (direction) => {
  switch (direction) {
    case MOVING_DIRECTION.up:
      return MOVING_DIRECTION.down;
    case MOVING_DIRECTION.down:
      return MOVING_DIRECTION.up;
    case MOVING_DIRECTION.left:
      return MOVING_DIRECTION.right;
    case MOVING_DIRECTION.right:
      return MOVING_DIRECTION.left;
    default:
      return null;
  }
};

const getPossibleDir = ({ x, y }, tiles) => {
  const possibleDirections = [];
  if (tiles[y][x + 1] !== 1) {
    possibleDirections.push(MOVING_DIRECTION.right);
  }
  if (tiles[y][x - 1] !== 1) {
    possibleDirections.push(MOVING_DIRECTION.left);
  }
  if (tiles[y - 1][x] !== 1) {
    possibleDirections.push(MOVING_DIRECTION.up);
  }
  if (tiles[y + 1][x] !== 1) {
    possibleDirections.push(MOVING_DIRECTION.down);
  }
  return possibleDirections;
};

const didCollideWithEnvironment = ({ x, y, direction }, tiles) => {
  switch (direction) {
    case MOVING_DIRECTION.right:
      return tiles[y][x + 1] !== 0;
    case MOVING_DIRECTION.left:
      return tiles[y][x - 1] !== 0;
    case MOVING_DIRECTION.up:
      return tiles[y - 1][x] !== 0;
    case MOVING_DIRECTION.down:
      return tiles[y + 1][x] !== 0;
    default:
      return false;
  }
};

const didCollideWithDot = ({ x, y, direction }, tiles) => {
  switch (direction) {
    case MOVING_DIRECTION.right:
      return tiles[y][x + 1] === 2;
    case MOVING_DIRECTION.left:
      return tiles[y][x - 1] === 2;
    case MOVING_DIRECTION.up:
      return tiles[y - 1][x] === 2;
    case MOVING_DIRECTION.down:
      return tiles[y + 1][x] === 2;
    default:
      return false;
  }
};

const collideWithPacman = ({ x, y, direction }, tiles, player) => {
  let newX = x;
  let newY = y;
  let newPlayer = player;
  const newTiles = tiles;
  switch (direction) {
    case MOVING_DIRECTION.right:
      newX += 1;
      break;
    case MOVING_DIRECTION.left:
      newX -= 1;
      break;
    case MOVING_DIRECTION.up:
      newY -= 1;
      break;
    case MOVING_DIRECTION.down:
      newY += 1;
      break;
    default:
      break;
  }
  if (tiles[newY][newX] === newPlayer.name) {
    newTiles[player.y][player.x] = 0;
    newPlayer = {
      ...newPlayer,
      alive: false,
      x: -1,
      y: -1,
    };
  }
  return [newTiles, newPlayer];
};

const didCollideWithPortal = ({ x, y, direction }, tiles, portal) => {
  switch (direction) {
    case MOVING_DIRECTION.right:
      return tiles[y][x + 1] === portal.name;
    case MOVING_DIRECTION.left:
      return tiles[y][x - 1] === portal.name;
    case MOVING_DIRECTION.up:
      return tiles[y - 1][x] === portal.name;
    case MOVING_DIRECTION.down:
      return tiles[y + 1][x] === portal.name;
    default:
      return false;
  }
};

const warpPlayerPosition = (player, tiles, portal) => {
  const newTiles = tiles;
  const newPlayer = player;

  newTiles[player.y][player.x] = 0;
  newPlayer.direction = portal.exitDirection;

  switch (portal.exitDirection) {
    case MOVING_DIRECTION.right:
      newPlayer.x = portal.x + 1;
      newPlayer.y = portal.y;
      newPlayer.points += newTiles[portal.y][portal.x + 1] === 2;
      newTiles[portal.y][portal.x + 1] = newPlayer.name;
      return [newTiles, newPlayer];
    case MOVING_DIRECTION.left:
      newPlayer.x = portal.x - 1;
      newPlayer.y = portal.y;
      newPlayer.points += newTiles[portal.y][portal.x - 1] === 2;
      newTiles[portal.y][portal.x - 1] = newPlayer.name;
      return [newTiles, newPlayer];
    case MOVING_DIRECTION.up:
      newPlayer.y = portal.y - 1;
      newPlayer.x = portal.x;
      newPlayer.points += newTiles[portal.y - 1][portal.x] === 2;
      newTiles[portal.y - 1][portal.x] = newPlayer.name;
      return [newTiles, newPlayer];
    case MOVING_DIRECTION.down:
      newPlayer.y = portal.y + 1;
      newPlayer.x = portal.x;
      newPlayer.points += newTiles[portal.y + 1][portal.x] === 2;
      newTiles[portal.y + 1][portal.x] = newPlayer.name;
      return [newTiles, newPlayer];
    default:
      return [newTiles, newPlayer];
  }
};

const updatePlayerPosition = (player, tiles) => {
  const newTiles = tiles;
  const newPlayer = player;
  if (!player.alive) {
    return [newTiles, newPlayer];
  }
  const pointColision = didCollideWithDot(newPlayer, newTiles);
  if (!didCollideWithEnvironment(newPlayer, newTiles) || pointColision) {
    const { x, y, direction } = newPlayer;
    newTiles[y][x] = 0;
    newPlayer.points += pointColision;
    switch (direction) {
      case MOVING_DIRECTION.right:
        newPlayer.x += 1;
        newTiles[y][x + 1] = newPlayer.name;
        return [newTiles, newPlayer];
      case MOVING_DIRECTION.left:
        newPlayer.x -= 1;
        newTiles[y][x - 1] = newPlayer.name;
        return [newTiles, newPlayer];
      case MOVING_DIRECTION.up:
        newPlayer.y -= 1;
        newTiles[y - 1][x] = newPlayer.name;
        return [newTiles, newPlayer];
      case MOVING_DIRECTION.down:
        newPlayer.y += 1;
        newTiles[y + 1][x] = newPlayer.name;
        return [newTiles, newPlayer];
      default:
        return [newTiles, newPlayer];
    }
  }
  if (didCollideWithPortal(player, newTiles, player.portal1)) {
    return warpPlayerPosition(newPlayer, newTiles, player.portal2);
  }
  if (didCollideWithPortal(player, newTiles, player.portal2)) {
    return warpPlayerPosition(newPlayer, newTiles, player.portal1);
  }
  return [newTiles, newPlayer];
};

const updatePlayersPosition = ({ p1, p2, tiles }) => {
  let newTiles = tiles;
  let newPlayer1 = p1;
  let newPlayer2 = p2;
  [newTiles, newPlayer1] = updatePlayerPosition(p1, newTiles);
  [newTiles, newPlayer2] = updatePlayerPosition(p2, newTiles);
  return [newTiles, newPlayer1, newPlayer2];
};

const updateEnemyPosition = (enemy, tiles, p1, p2) => {
  let newTiles = tiles;
  const newEnemy = enemy;
  const pointColision = didCollideWithDot(newEnemy, newTiles);
  if (!didCollideWithEnvironment(newEnemy, newTiles) || pointColision) {
    newEnemy.points += pointColision;
    const { x, y, direction } = newEnemy;
    newTiles[y][x] = 0;
    switch (direction) {
      case MOVING_DIRECTION.right:
        newEnemy.x += 1;
        break;
      case MOVING_DIRECTION.left:
        newEnemy.x -= 1;
        break;
      case MOVING_DIRECTION.up:
        newEnemy.y -= 1;
        break;
      case MOVING_DIRECTION.down:
        newEnemy.y += 1;
        break;
      default:
        break;
    }
    newTiles[newEnemy.y][newEnemy.x] = newEnemy.name;
    const oposite = getOppositeDir(newEnemy.direction);
    const possibleDirections = getPossibleDir(newEnemy, newTiles).filter((dir) => dir !== oposite);
    newEnemy.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
    return [newTiles, newEnemy, p1, p2];
  }
  let newP1;
  let newP2;
  [newTiles, newP1] = collideWithPacman(enemy, newTiles, p1);
  [newTiles, newP2] = collideWithPacman(enemy, newTiles, p2);
  newEnemy.direction = MOVING_DIRECTION[
    Object.keys(MOVING_DIRECTION)[Math.floor(Math.random() * 4)]
  ];
  return [newTiles, newEnemy, newP1, newP2];
};

const updateEnemiesPosition = (game) => {
  const {
    enemies, tiles, p1, p2,
  } = game;
  let [newTiles, newP1, newP2] = [tiles, p1, p2];
  let newEnemy;
  const newEnemies = [];
  for (let i = 0; i < enemies.length; i += 1) {
    [newTiles, newEnemy, newP1, newP2] = updateEnemyPosition(
      enemies[i],
      newTiles,
      newP1,
      newP2,
    );
    newEnemies.push(newEnemy);
  }
  return [newTiles, newEnemies, newP1, newP2];
};

const getWallCoords = (tiles, player) => {
  let wallRow = player.y;
  let wallCol = player.x;

  switch (player.direction) {
    case MOVING_DIRECTION.up:
      for (let i = player.y - 1; i >= 0; i -= 1) {
        if (tiles[i][player.x] === 1) {
          wallRow = i;
          break;
        }
        if (!(tiles[i][player.x] === 0 || tiles[i][player.x] === 2)) {
          return null;
        }
      }
      break;

    case MOVING_DIRECTION.down:
      for (let i = player.y + 1; i < tiles.length; i += 1) {
        if (tiles[i][player.x] === 1) {
          wallRow = i;
          break;
        }
        if (!(tiles[i][player.x] === 0 || tiles[i][player.x] === 2)) {
          return null;
        }
      }
      break;

    case MOVING_DIRECTION.left:
      for (let j = player.x - 1; j >= 0; j -= 1) {
        if (tiles[player.y][j] === 1) {
          wallCol = j;
          break;
        }
        if (!(tiles[player.y][j] === 0 || tiles[player.y][j] === 2)) {
          return null;
        }
      }
      break;

    case MOVING_DIRECTION.right:
      for (let j = player.x + 1; j < tiles[player.y].length; j += 1) {
        if (tiles[player.y][j] === 1) {
          wallCol = j;
          break;
        }
        if (!(tiles[player.y][j] === 0 || tiles[player.y][j] === 2)) {
          return null;
        }
      }
      break;

    default:
      return null;
  }

  return [wallRow, wallCol];
};

const shootPortal = (player, portal, tiles) => {
  const newTiles = tiles;
  const newPortal = portal;

  const newCoords = getWallCoords(tiles, player);
  if (newCoords) {
    const newY = newCoords[0];
    const newX = newCoords[1];

    newTiles[newPortal.y][portal.x] = 1;

    newPortal.x = newX;
    newPortal.y = newY;
    newTiles[newY][newX] = newPortal.name;
    newPortal.exitDirection = getOppositeDir(player.direction);
  }
  return [newTiles, newPortal];
};

export {
  didCollideWithEnvironment,
  updatePlayerPosition,
  updatePlayersPosition,
  updateEnemiesPosition,
  getWallCoords,
  shootPortal,
};
