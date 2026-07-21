import {Camera} from "./Camera.js";
import { Collision } from "./Collision.js";
import {Bullet} from "../entities/Bullet.js";
import { Asteroid } from "../entities/Asteroid.js";
import { Explosion } from "../entities/Explosion.js";
import { Ship } from "../entities/Ship.js";
import { AudioManager } from "./AudioManager.js";
import { Menu } from "../states/Menu.js";
import { Playing } from "../states/Playing.js";
import { Input } from "../input/Input.js";
import { AsteroidField } from "../world/AsteroidField.js";
import { Universe } from "../world/Universe.js";
import { GameOver } from "../states/GameOver.js";
import { TouchControls } from "../input/TouchControls.js";
import { Joystick } from "../input/Joystick.js";
import { InputManager } from "../input/InputManager.js";
import { FireButton } from "../input/FireButton.js";

export class Game{
  constructor(canvas){
    this.canvas=canvas;
    this.mouse={
      x:0,
      y:0
    }

    canvas.addEventListener("mousemove",(e)=>{
      const rect=canvas.getBoundingClientRect();
      this.mouse.x=e.clientX-rect.left;
      this.mouse.y=e.clientY-rect.top;
    });
    canvas.addEventListener("click",()=>{
      this.clicked=true;
    });
    canvas.addEventListener("touchstart",(e)=>{
      const rect=canvas.getBoundingClientRect();
      this.mouse.x=e.tuches[0].clientX-rect.left;
      this.mouse.y=e.touches[0].clientY-rect.top;
      this.mouse.clicked=true;
    });

    this.context=canvas.getContext("2d");
    this.objects=[];
    this.camera=new Camera(canvas.width,canvas.height);
    this.running=false;
    this.universe=null;
    this.score=0;
    this.wave=1;
    this.waveStarting=false;
    this.waveMessage="";
    this.waveMessageTimer=0;
    this.lives=3;
    this.pendingObjects=[];
    this.gameOver=false;
    this.waitingForRestart=false;
    this.worldWidth=5000;
    this.worldHeight=5000;
    this.light={
      x:-1,
      y:-1
    };
    const length=Math.hypot(this.light.x, this.light.y);
    this.light.x/=length;
    this.light.y/=length;
    this.audio=new AudioManager();
    this.audio.load("laser","assets/audio/laser.mp3");
    this.audio.load("explosion","assets/audio/explosion.mp3");
    this.audio.load("thrust","assets/audio/thrust.mp3");
    this.universe=new Universe(this);
    this.asteroidField=new AsteroidField(this);
    this.state="Menu";
    this.menu=new Menu(this);
    this.gameOverScreen=new GameOver(this);
    this.playing=new Playing(this);
    this.asteroidSpawnTimer=0;
    this.input=new Input();
    this.joystick=new Joystick();
    this.fireButton=new FireButton();
    this.touchControls=new TouchControls(this.input);
    this.inputManager=new InputManager(this.input,this.joystick,this.fireButton);
  }

  addScore(points){
    this.score+=points;
  }
  startGame(){
    this.score=0;
    this.gameOver=false;
    this.state="Playing";
    this.audio.playMusic("music");
  }

  add(object){
    this.objects.push(object);
  }

  start(){
    this.running=true;
    this.loop();
  }

  loop(){
    if(!this.running)
      return;
    this.update();
    this.render(this.context);
    requestAnimationFrame(
      ()=>this.loop()
    );
  }

  update(deltaTime){
    if(this.state==="Menu"){
      this.menu.update();
        return;
      }
      if(this.state === "GameOver"){
        this.gameOverScreen.update();
        return;
      }

    if(this.lives<=0){
      this.state="GameOver";
    }
    
    this.camera.update();
    if(this.universe){
      this.universe.update();
    }
    if(this.asteroidField){
      this.asteroidField.update();
    }

    for(let i=this.objects.length-1;i>=0;i--){
      let object=this.objects[i];
      object.update(this.input);

      if(object.destroyed || object.life<=0){
        this.objects.splice(i,1);
      }
      if(object instanceof Asteroid){
        this.asteroidField.removeDestroyed();
      }
    }
    this.inputManager.update();
    this.joystick.update();

    if(this.waveMessageTimer>0){
      this.waveMessageTimer--;
    }

    this.checkCollisions();

    for(const object of this.pendingObjects){
      this.add(object);
    }
    this.ship.update(this.input);
    this.pendingObjects=[];
    this.asteroidSpawnTimer--;
    if(this.asteroidSpawnTimer<=0){
      this.spawnAsteroidsAroundPlayer()
      this.asteroidSpawnTimer=180;
    }
  
  }

   spawnAsteroidsAroundPlayer(){
    const player=this.ship;
    if(!player) return;
    const distance=1000;
    for(let i=0;i<10;i++){
      const angle=Math.random()*Math.PI*2;
      const x=player.position.x+Math.cos(angle)*distance;
      const y=player.position.y+Math.sin(angle)*distance;
      const size=20+Math.random()*60;
      const asteroid=new Asteroid(x,y, size);
      this.add(asteroid);
    }
  }
      
    checkCollisions(){
      for(let i=0;i<this.objects.length;i++){
        for(let j=i+1;j<this.objects.length;j++){
          const a=this.objects[i];
          const b=this.objects[j];

          if(a.destroyed || b.destroyed)
            continue;
          if(!a.visible || !b.visible)
            continue;
          if(!Collision.check(a,b))
            continue;

          let bullet=null;
          let asteroid=null;
          if(a instanceof Bullet && b instanceof Asteroid){
            bullet=a;
            asteroid=b;
          }
          else if(a instanceof Asteroid && b instanceof Bullet){
            bullet=b;
            asteroid=a;
          }

          if(bullet && asteroid && Collision.check(bullet,asteroid)){
            if(asteroid.size>1){
              for(let i=0;i<2;i++){
                let child=new Asteroid(
                  asteroid.position.x+Math.random()*20-10,
                  asteroid.position.y+Math.random()*20-10,
                  asteroid.size/2
                );
              this.pendingObjects.push(child);
              }
            }
            new Explosion(
              asteroid.position.x,
              asteroid.position.y,
              this
            );
            bullet.destroyed=true;
            this.addScore(asteroid.scoreValue);
            asteroid.takeDamage();
            this.audio.play("explosion");
          }

          if(!this.waveStarting && this.getAsteroidCount() === 0){
            this.startNextWave();
          }

          if(
            a instanceof Ship &&
            b instanceof Asteroid &&
            Collision.check(a,b) && 
            a.invisibleTimer<=0
            
          ){
            if(a.alive){
            a.die();
            this.audio.play("explosion");
            }
            continue;
          }

          if(
            a instanceof Asteroid &&
            b instanceof Ship &&
            Collision.check(a,b) && 
            a.invisibleTimer<=0
            
          ){
            if(b.alive){
            b.die();
            this.audio.play("explosion");
          }
          continue;
          }
      }
      }
      this.objects=this.objects.filter(object=>{
        if(object.destroyed){
          return false;
        }
        if(object.life!==undefined && object.life<=0){
          return false;
          }
          return true;
        
      });    
  }

  loseLife(){
    if(this.gameOver) return;
    this.lives--;
    if(this.lives<=0){
      this.lives=0;
      this.gameOver=true;
      this.state="GameOver";
      return;
    }
      this.ship.respawn();
  }

  restart(){
    this.state="Playing";
    this.gameOver=false;
    this.lives=3;
    this.score=0;
    this.objects=[];
    const ship=new Ship(
    this.canvas.width/2,
    this.canvas.height/2,
    this
);
   this.ship=ship;
   this.add(ship);

   this.camera.follow(ship);
   this.asteroidField=new AsteroidField(this);

  }

  split(){
        if(this.size>20){
           return[
            new Asteroid(
              this.position.x,
              this.position.y,
              this.size/2
             ),
            new Asteroid(
              this.position.x,
              this.position.y,
              this.size/2
            )
           ];
        }
         return[];
      }

  getAsteroidCount(){
            return this.objects.filter(
              object=>object instanceof Asteroid
            ).length;
          }

  startNextWave(){
   this.waveStarting=true;
   this.wave++;
   setTimeout(()=>{
   this.spawnWave();
   this.waveStarting=false;
   },1500);
   this.waveMessage=`WAVE ${this.wave}`;
   this.waveMessageTimer=120;
  }

  spawnWave(){
  const spawn=this.getSpawnPosition();
   const asteroid=new Asteroid(
   spawn.x,
   spawn.y
   );
   this.add(asteroid);
   }

  getSpawnPosition(){
  const margin=300;
  const side=Math.floor(Math.random()*4);
  const camera=this.camera.position;
  switch(side){
  case 0:
  return{
  x:camera.x+(Math.random()-0.5)*1200,
  y:camera.y-margin
  };
  case 1:
  return{
  x:camera.x+800+margin,
  y:camera.y+(Math.random()-0.5)*800
  };
  case 2:
  return{
  x:camera.x+(Math.random()-0.5)*1200,
  y:camera.y+600+margin
  };
  default:
  return{
  x:camera.x-margin,
  y:camera.y+(Math.random()-0.5)*800
  };
  }
  }

  renderBackground(context){
    const gradient=context.createRadialGradient(
      this.canvas.width/2,
      this.canvas.height/2,
      100,
      this.canvas.width/2,
      this.canvas.height/2,
      this.canvas.width

    );
    gradient.addColorStop(0,"#102040");
    gradient.addColorStop(0.5,"#08111f");
    gradient.addColorStop(1,"#000000");
    context.fillStyle=gradient;
    context.fillRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  drawUI(context){
    context.save();
    context.fillStyle="white";
    context.font="28px Arial";
    context.textAlign="center";
    context.fillText(
      `SCORE: ${this.score}`,80,40
    );
    context.restore();
  }

  render(context,camera){
    this.context.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    if(this.state === "Menu"){
    this.menu.render(context);
    return;
    }
    if(this.state === "GameOver"){
      this.gameOverScreen.render(context);
      return;
    }
  this.renderBackground(context);
  this.universe.render(this.context,this.camera);
  this.joystick.render(this.context);

    for(const object of this.objects){
      if(object.visible){
      object.render(
        this.context,
        this.camera
      );
    }
  }
  this.fireButton.render(this.context);

  if(this.waveMessageTimer>0){
    context.save();
    context.font="48px Arial";
    context.textAlign="center";
    context.fillStyle="white";
    context.fillText(
      this.waveMessage,
      this.canvas.width/2,
      context.height/2
    );
  }

  this.drawUI(context);

  if(this.gameOver){
    context.save();
    context.fillStyle="rgba(0,0,0,0.65)";
    context.fillRect(
      0,0,this.canvas.width,
      this.canvas.height
    );

  context.font="30px Arial";
    context.fillText(
      "SCORE:"+this.score,
      this.canvas.width/2,
      this.canvas.height/2+10
    );
  }

  context.save();
  context.fillStyle="red";
  context.textAlign="center";
  context.font="28px Arial";
  context.fillText(
    `LIVES: ${this.lives}`,
    75,
    85
  );

  context.restore();
  }
}