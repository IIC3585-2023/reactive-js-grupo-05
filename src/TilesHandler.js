import { MOVING_DIRECTION } from './parameters.js';

const didCollideWithEnvironment = ({ x, y, direction }, tiles) => {
  // console.log(tiles, y, x);
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

const collideWithPacman = ({ x, y, direction }, tiles, player) => {
  let newX = x;
  let newY = y;
  let newPlayer = player;
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
    newPlayer = {
      ...newPlayer,
      alive: false,
      x: -1,
      y: -1,
    };
    // console.log('Colision pacman fantasma', player.name);
  }
  return newPlayer;
};

const didCollideWithPortal = ({ x, y, direction }, tiles, portal) => {
  // console.log(portal2.name, tiles[y - 1][x]);
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
      newTiles[portal.y][portal.x + 1] = newPlayer.name;
      return [newTiles, newPlayer];
    case MOVING_DIRECTION.left:
      newPlayer.x = portal.x - 1;
      newPlayer.y = portal.y;
      newTiles[portal.y][portal.x - 1] = newPlayer.name;
      return [newTiles, newPlayer];
    case MOVING_DIRECTION.up:
      newPlayer.y = portal.y - 1;
      newPlayer.x = portal.x;
      newTiles[portal.y - 1][portal.x] = newPlayer.name;
      return [newTiles, newPlayer];
    case MOVING_DIRECTION.down:
      newPlayer.y = portal.y + 1;
      newPlayer.x = portal.x;
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
  if (!didCollideWithEnvironment(newPlayer, newTiles)) {
    const { x, y, direction } = newPlayer;
    newTiles[y][x] = 0;
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
  const newTiles = tiles;
  const newEnemy = enemy;
  // console.log(enemy, p1, p2);
  if (!didCollideWithEnvironment(newEnemy, newTiles)) {
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
    return [newTiles, newEnemy, p1, p2];
  }
  const newP1 = collideWithPacman(enemy, tiles, p1);
  const newP2 = collideWithPacman(enemy, tiles, p2);
  // console.log('test', newP2);

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
//
// const getWallCoords = (maze, player) => {
//   let wallRow;
//   let wallCol;
//
//   switch (player.direction) {
//     case 'up':
//       wallRow = player.y;
//       for (let i = player.y - 1; i >= 0; i -= 1) {
//         if (maze[i][player.x] === 1) {
//           wallRow = i;
//           break;
//         }
//       }
//       wallCol = player.x;
//       break;
//
//     case 'down':
//       wallRow = player.y;
//       for (let i = player.y + 1; i < maze.length; i += 1) {
//         if (maze[i][player.x] === 1) {
//           wallRow = i;
//           break;
//         }
//       }
//       wallCol = player.x;
//       break;
//
//     case 'left':
//       wallCol = player.x;
//       for (let j = player.x - 1; j >= 0; j -= 1) {
//         if (maze[player.y][j] === 1) {
//           wallCol = j;
//           break;
//         }
//       }
//       wallRow = player.y;
//       break;
//
//     case 'right':
//       wallCol = player.x;
//       for (let j = player.x + 1; j < maze[player.y].length; j += 1) {
//         if (maze[player.y][j] === 1) {
//           wallCol = j;
//           break;
//         }
//       }
//       wallRow = player.y;
//       break;
//
//     default:
//       return null;
//   }
//
//   return [wallRow, wallCol];
// };

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
        if (tiles[i][player.x] !== 0) {
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
        if (tiles[i][player.x] !== 0) {
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
        if (tiles[player.y][j] !== 0) {
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
        if (tiles[player.y][j] !== 0) {
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
    // console.log(newPortal, newTiles[newPortal.y][newPortal.x]);
    console.log(newCoords, newX, newY, newTiles);

    newTiles[newPortal.y][portal.x] = 1;

    newPortal.x = newX;
    newPortal.y = newY;
    newTiles[newY][newX] = newPortal.name;

    switch (player.direction) {
      case MOVING_DIRECTION.up:
        newPortal.exitDirection = MOVING_DIRECTION.down;
        break;

      case MOVING_DIRECTION.down:
        newPortal.exitDirection = MOVING_DIRECTION.up;
        break;

      case MOVING_DIRECTION.left:
        newPortal.exitDirection = MOVING_DIRECTION.right;
        break;

      case MOVING_DIRECTION.right:
        newPortal.exitDirection = MOVING_DIRECTION.left;
        break;

      default:
        break;
    }
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
