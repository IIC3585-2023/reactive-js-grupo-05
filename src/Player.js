import MovingDirection from './MovingDirection.js';

const { fromEvent, timer } = rxjs;
const { filter } = rxjs.operators;

export default class Player {
  constructor(id, ctx, size, startX, startY, keys) {
    this.id = id;
    this.x = startX;
    this.y = startY;
    this.sprite = new Image();
    this.sprite.src = 'sprites/down.png';
    this.direction = MovingDirection.down;
    this.size = size;
    this.ctx = ctx;
    this.keys = keys;
    this.toggleCont = 0;
    this.sprite.onload = () => {
      this.ctx.drawImage(this.sprite, this.x, this.y, this.size, this.size);
    };
    this.suscribe();
  }

  suscribe() {
    const { toggleSprite, draw, changeDirection, move } = this;
    this.toggleSpriteSubscription = timer(0, 13).subscribe(toggleSprite.bind(this));
    this.drawSubscription = timer(0, 13).subscribe(draw.bind(this));
    fromEvent(document, 'keydown')
      .pipe(filter((event) => Object.values(this.keys).includes(event.key)))
      .subscribe((event) => {
        changeDirection.bind(this)(event.key); move.bind(this)();
      });
  }

  draw() {
    this.ctx.drawImage(this.sprite, this.x, this.y, this.size, this.size);
  }

  toggleSprite() {
    if (this.toggleCont < 7) {
      this.sprite.src = `sprites/${MovingDirection[this.direction]}.png`;
      this.toggleCont += 1;
    } else {
      this.sprite.src = 'sprites/circle.png';
      this.toggleCont = 0;
    }
  }

  changeDirection(key) {
    switch (key) {
      case this.keys.up:
        this.direction = MovingDirection.up;
        this.sprite.src = 'sprites/up.png';
        break;
      case this.keys.down:
        this.direction = MovingDirection.down;
        this.sprite.src = 'sprites/down.png';
        break;
      case this.keys.left:
        this.direction = MovingDirection.left;
        this.sprite.src = 'sprites/left.png';
        break;
      case this.keys.right:
        this.direction = MovingDirection.right;
        this.sprite.src = 'sprites/right.png';
        break;
      default:
        break;
    }
  }

  move() {
    switch (this.direction) {
      case MovingDirection.up:
        this.y -= this.size;
        break;
      case MovingDirection.down:
        this.y += this.size;
        break;
      case MovingDirection.left:
        this.x -= this.size;
        break;
      case MovingDirection.right:
        this.x += this.size;
        break;
      default:
        break;
  }
};

}
