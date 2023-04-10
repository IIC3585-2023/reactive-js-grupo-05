import Map from './Map.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const map = new Map(10);

const setup = () => {
  map.draw(ctx);
};

setInterval(setup, 200);

