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

export class Game{
  constructor(canvas){
    this.canvas=canvas;
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
    //this.ship=new Ship(this.canvas.width/2, this.canvas.height/2, this);
    //this.add(this.ship);
    this.universe=new Universe(this);
    this.asteroidField=new AsteroidField(this);
    this.input= Input;
    this.state="Menu";
    this.menu=new Menu(this);
    this.playing=new Playing(this);
    this.asteroidSpawnTimer=0;
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
    if(this.gameOver && this.input.keys["Enter"]){
      console.log("Restart");
      this.restart();
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
      object.update();

      if(object.destroyed || object.life<=0){
        this.objects.splice(i,1);
      }
      if(object instanceof Asteroid){
        this.asteroidField.removeDestroyed();
      }
    }
    if(this.waveMessageTimer>0){
      this.waveMessageTimer--;
    }


    this.checkCollisions();

    for(const object of this.pendingObjects){
      this.add(object);
    }

    this.pendingObjects=[];

    //this.spawnAsteroidsAroundPlayer();
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

   /*spawnAsteroidsAroundPlayer(){
      let nearby=0;
      for(const object of this.objects){
        if(object instanceof Asteroid){
          const dx=object.position.x-this.ship.position.x;
          const dy=object.position.y-this.ship.position.y;
          const distance=Math.hypot(dx,dy);
          if(distance<1500){
            nearby++;
          }
        }
      }
    }*/
      
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
      return;
    }
      this.ship.respawn();
  }

  restart(){
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
  this.renderBackground(context);
  this.universe.render(this.context,this.camera);

    for(const object of this.objects){
      if(object.visible){
      object.render(
        this.context,
        this.camera
      );
    }
  }

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
    context.restore();
  }
  context.save();
  context.fillStyle="red";
  context.font="28px Arial";
  context.fillText(
    `LIVES: ${this.lives}`,
    20,
    80
  );

  context.save();
  context.fillStyle="orange";
  context.font="28px Arial";
  context.fillText(
    "SCORE:"+this.score,
    20,
    40
  );
  if(this.gameOver){
    context.save();
    context.fillStyle="rgba(0,0,0,0.65)";
    context.fillRect(
      0,0,this.canvas.width,
      this.canvas.height
    );
    context.fillStyle="#ffffff";
    context.font="70px Arial";
    context.textAlign="center";
    context.fillText(
      "GAME OVER",
      this.canvas.width/2,
      this.canvas.height/2-50
    );
    context.font="30px Arial";
    context.fillText(
      "SCORE:"+this.score,
      this.canvas.width/2,
      this.canvas.height/2+10
    );
    context.font="25px Arial";
    context.fillText(
      "PRESS ENTER TO RESTART",
      this.canvas.width/2,
      this.canvas.height/2+70
    );
    context.restore();
  }

  context.restore();
  }
}