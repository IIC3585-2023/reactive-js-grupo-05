const { fromEvent, merge, filter, pipe, timer } = rxjs;
const { sample, mapTo } = rxjs.operators;
import MovingDirection from './MovingDirection.js';
import Map from './Map.js';
import Player from './Player.js';

const SIZE = 32;
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = SIZE * 13; // size of canvas
canvas.height = SIZE * 11;
const map = new Map(SIZE, ctx);

const directions1 = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
};
const directions2 = {
  up: 'w',
  down: 's',
  left: 'a',
  right: 'd',
};
const p1 = new Player(1, ctx, SIZE, SIZE, SIZE, directions1);
const p2 = new Player(2, ctx, SIZE, SIZE * 11, SIZE * 9, directions2);

const setup = () => {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  map.draw(ctx);
};

// setInterval(setup, 20);
timer(0, 13).subscribe(setup);
