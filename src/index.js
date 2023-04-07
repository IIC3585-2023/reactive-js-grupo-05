import Map from './Map.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const map = new Map();

const setup = () => {
  console.log('test');
  map.draw();
};

setup();
