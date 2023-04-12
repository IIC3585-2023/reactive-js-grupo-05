import MovingDirection from './MovingDirection.js';

export default class Map {
  constructor(tileSize, ctx) {
    this.wall = new Image();
    this.wall.src = 'src/wall.png';
    this.tileSize = tileSize;
    // this.tiles = this.generatePacmanMap(15, 12);
    this.wall.onload = () => {
      this.draw(ctx);
    };
  }

  tiles = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 7, 0, 0, 4, 0, 0, 0, 0, 0, 0, 7, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 6, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 7, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  draw(ctx) {
    for (let row = 0; row < this.tiles.length; row += 1) {
      for (let column = 0; column < this.tiles[row].length; column += 1) {
        const tile = this.tiles[row][column];
        if (tile === 1) {
          this.drawWall(ctx, column, row, this.tileSize);
          // console.log('drawn', this.tileSize);
        }
      }
    }
  }

  drawWall(ctx, column, row, size) {
    ctx.drawImage(
      this.wall,
      column * this.tileSize,
      row * this.tileSize,
      size,
      size,
    );
    // console.log('called', this.tileSize);
  }

  // generatePacmanMap(n, m) {
  //   // quizas hacer una funcion?
  //   const maze = [
  //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  //     [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  //     [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  //     [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  //     [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  //     [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  //     [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1],
  //     [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  //     [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  //     [0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
  //     [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  //   ];
  //   return maze;
  // }

  // falta testeo, esta simplificada
  didCollideWithEnvironment(x, y, direction) {
    const { tileSize } = this;
    const column = Math.floor(x / tileSize);
    const row = Math.floor(y / tileSize);

    switch (direction) {
      case MovingDirection.right:
        return this.tiles[row][column + 1] === 1;
      case MovingDirection.left:
        return this.tiles[row][column - 1] === 1;
      case MovingDirection.up:
        return this.tiles[row - 1][column] === 1;
      case MovingDirection.down:
        return this.tiles[row + 1][column] === 1;
      default:
        return false;
    }
  }
}
