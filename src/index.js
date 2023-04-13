const { fromEvent, merge, filter, pipe, timer, BehaviorSubject, interval } = rxjs;
const { sample, mapTo, withLatestFrom, map } = rxjs.operators;
import { SIZE, DIRECTIONSP1, DIRECTIONSP2, MOVING_DIRECTION, P1_START, P2_START, PACMAN_I } from './parameters.js';
import { drawTiles, tiles } from './Tiles.js';



const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';
canvas.width = SIZE * (tiles[0].length);
canvas.height = SIZE * (tiles.length);


// --------------------------------------------------------------
// --------------------------------------------------------------

const game = new BehaviorSubject({
  tiles,
  p1: P1_START,
  p2: P2_START,
});

 timer(0, 100).pipe(withLatestFrom(game), map(([_, currentGame])=>currentGame))
 .subscribe((currentGame)=>{
  drawTiles(currentGame, ctx);
 });

interval(150).pipe(withLatestFrom(game), map(([time, currentGame])=>{
  const { p1, p2 } = currentGame;
  if (time % 2 === 0) {
    p1.image = PACMAN_I[p1.direction];
    p2.image = PACMAN_I[p2.direction];
  } else {
    p1.image = PACMAN_I.circle;
    p2.image = PACMAN_I.circle;
  }
  return { ...currentGame, p1, p2 }
})).subscribe((currentGame)=>game.next(currentGame));
 
const keydownP1 = fromEvent(document, 'keydown')
      .pipe(filter(({ key }) => Object.keys(DIRECTIONSP1).includes(key)),
        withLatestFrom(game),
        map(([currentKeydown, currentGame]) => {
        const { p1 } = currentGame;
        return {...currentGame, p1: {...p1, direction: DIRECTIONSP1[currentKeydown.key]}}
         }),
      ).subscribe((currentGame) => {
        drawTiles(currentGame, ctx);
        game.next(currentGame);
      });

const keydownP2 = fromEvent(document, 'keydown')
      .pipe(filter(({ key }) => Object.keys(DIRECTIONSP2).includes(key)),
        withLatestFrom(game),
        map(([currentKeydown, currentGame]) => {
        const { p2 } = currentGame;
        return {...currentGame, p2: {...p2, direction: DIRECTIONSP2[currentKeydown.key]}}
         }),
      ).subscribe((currentGame) => {
        drawTiles(currentGame, ctx);
        game.next(currentGame);
      });
      
