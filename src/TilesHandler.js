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

const CollideWithPacman = ({ x, y, direction }, tiles, p1, p2) => {
  let newX = x;
  let newY = y;
  let newP1 = p1;
  let newP2 = p2;
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
  if (tiles[newY][newX] === p1.name) {
    newP1 = { ...newP1, alive: false };
    console.log("Colision pacman-1 fantasma");
  } else if (tiles[newY][newX] === p2.name) {
    newP2 = { ...newP2, alive: false };
    console.log("Colision pacman-2 fantasma");
  }
  return [newP1, newP2];
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
  if (p1.alive) {
    [newTiles, newPlayer1] = updatePlayerPosition(p1, newTiles);
  } else {
    newTiles[p1.y][p1.x] = 0;
    newPlayer1.x = -1;
    newPlayer1.y = -1;
  }
  if (p2.alive) {
    [newTiles, newPlayer2] = updatePlayerPosition(p2, newTiles);
  } else {
    newTiles[p2.y][p2.x] = 0;
    newPlayer2.x = -1;
    newPlayer2.y = -1;
  }
  return [newTiles, newPlayer1, newPlayer2];
};

const updateEnemyPosition = (enemy, tiles, p1, p2) => {
  const newTiles = tiles;
  const newEnemy = enemy;
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
  const [newP1, newP2] = CollideWithPacman(enemy, tiles, p1, p2);
  newEnemy.direction = MOVING_DIRECTION[
    Object.keys(MOVING_DIRECTION)[Math.floor(Math.random() * 4)]
  ];
  return [newTiles, newEnemy, newP1, newP2];

};

const updateEnemiesPosition = (game) => {
  const { enemies, tiles, p1, p2 } = game;
  let [newTiles, newP1, newP2] = [tiles, p1, p2];
  let newEnemy;
  const newEnemies = [];
  for (let i = 0; i < enemies.length; i += 1) {
    [newTiles, newEnemy, newP1, newP2] = updateEnemyPosition(enemies[i], newTiles, newP1, newP2);
    newEnemies.push(newEnemy);
  }
  return [newTiles, newEnemies, newP1, newP2];
};

export {
  didCollideWithEnvironment,
  updatePlayerPosition,
  updatePlayersPosition,
  updateEnemiesPosition,
};
