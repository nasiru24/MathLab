import {Game} from "./engine/Game.js";
import {Star} from "./entities/Star.js";
import {Ship} from "./entities/Ship.js";
import { Universe } from "./world/Universe.js";
import { Asteroid } from "./entities/Asteroid.js";
import { AsteroidField } from "./world/AsteroidField.js";

const canvas=document.getElementById("gameCanvas");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
window.addEventListener("resize",()=>{
  canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
});

const game=new  Game(canvas);

const ship=new Ship(
  canvas.width/2,
  canvas.height/2,
  game
);
game.ship=ship;
game.add(ship);

game.camera.follow(ship);

const stars=[];
function randomStarColor(){
  const colors=[
    "white","white","white","lightblue","pink","yellow","orange","lightgreen"
  ];
  return colors[Math.floor(Math.random()*colors.length)];
}

for(let i=0;i<100;i++){
const star=new Star(
  Math.random()*canvas.width,
  Math.random()*canvas.height,
  Math.random()*3+1,
  randomStarColor(),
);
stars.push(star);
game.add(star);
}

const universe=new Universe(game);
game.universe=universe;
universe.generate();

const asteroidField=new AsteroidField(game);
asteroidField.generate();

const asteroid=new Asteroid(
  600,400,50
);
game.add(asteroid);

game.start();


