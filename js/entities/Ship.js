import { GameObject } from "../engine/GameObject.js";
import {Input} from "../input/Input.js";
import { Particle } from "../effects/Particle.js";
import { Vector2 } from "../math/Vector2.js";
import { Bullet } from "./Bullet.js";
import { EngineParticle } from "./EngineParticle.js";

export class Ship extends GameObject{
  constructor(x,y,game){
    super(x,y);
    this.game=game;
    this.width=50;
    this.height=70;
    this.rotation=-Math.PI/2;
    this.enginePower=0.1;
    this.rotationSpeed=0.12;
    this.maxSpeed=15;
    this.velocity=new Vector2(0,0);
    this.acceleration=0.8;
    this.friction=0.9;
    this.thrusting=false;
    this.fireRate=15;
    this.fireCooldown=0;
    this.muzzleFlash=0;
    this.invisible=false;
    this.invisibleTimer=0;
    this.gameOver=false;
    this.thrustPower=100;
    this.life=true;
    this.respawnTimer=0;
    this.alive=true;
    this.visible=true;
    this.blinkTimer=0;

  }

  update(input){
    if(this.game.gameOver){
      return;
    }
    if(!this.alive){
      this.respawnTimer--;
      if(this.respawnTimer<=0){
        this.respawn();
      }
      return;
    }
    if(this.invisibleTimer>0){
        this.invisibleTimer--;
        this.blinkTimer++;
      }

      let moveX=input.moveX || 0;
      let moveY=input.moveY || 0;

    if(input.keys["KeyA"]||input.keys["ArrowLeft"] || input.touch.left){
      this.rotation-=this.rotationSpeed;
    }

  if(input.keys["KeyD"]||input.keys["ArrowRight"] || input.touch.right){
    this.rotation+=this.rotationSpeed;
  }

  this.acceleration=new Vector2(0,0);
  
if(input.keys["KeyW"]||input.keys["ArrowUp"] || input.touch.up){
  this.acceleration.x=Math.cos(this.rotation)*this.enginePower;
  this.acceleration.y=Math.sin(this.rotation)*this.enginePower;

  if(Math.random()<0.5){
    let particlePosition=new Vector2(
      this.position.x+Math.cos(this.rotation)*25,
      this.position.y+Math.sin(this.rotation)*25
    );
    let flame=new EngineParticle(
      particlePosition.x,
      particlePosition.y,
      this.rotation
    );
    this.game.add(flame);

      let moveX=input.moveX;
      let moveY=input.moveY;
      this.velocity.x+=moveX*this.enginePower;
      this.velocity.y+=moveY*this.enginePower;

    const thrustPower=0.15;
    this.velocity.x+=Math.cos(this.rotation)*thrustPower;
    this.velocity.y+=Math.sin(this.rotation)*thrustPower;

   // this.velocity.x*=this.friction;
    //this.velocity.y*=this.friction;
    this.position.add(this.velocity);
    this.velocity.multiply(0.99);
    
    const maxSpeed=10;
    const speed=Math.sqrt(
      this.velocity.x**2+this.velocity.y**2
    );
    
    if(speed>maxSpeed){
      this.velocity.x=(this.velocity.x/speed)*maxSpeed;
      this.velocity.y=(this.velocity.y/speed)*maxSpeed;
    }

  if(this.muzzleFlash>0){
      this.muzzleFlash--;
    }

  this.thrusting=true;
  this.createEngineParticle();
  }else{
  this.thrusting=false;
}

}  
if(this.fireCooldown>0){
  this.fireCooldown--;
}

  if(input.keys["Space"] || input.touch.fire || input.fire && this.fireCooldown<=0){
   const bullet=new Bullet(
    this.position.x+Math.cos(this.rotation)*30,
    this.position.y+Math.sin(this.rotation)*30,
    this.rotation
  );
  this.game.add(bullet);
  this.fireCooldown=this.fireRate;
  this.game.audio.play("laser");
}



  if(this.velocity.length()>this.maxSpeed){
    this.velocity.normalize();
    this.velocity.multiply(this.maxSpeed);
  }

  if(this.fireCooldown>0){
    this.fireCooldown--;
  }

  this.lives--;
  if(this.lives>0){
    setTimeout(() => {
      this.ship.position.x=this.camera.position.x;
      this.ship.position.y=this.camera.position.y;
      this.ship.velocity.x=0;
      this.ship.velocity.y=0;
      
    }, 1500);
  }

  if(this.invisible){
    this.invisibleTimer--;
    if(this.invisibleTimer<=0){
      this.invisibleTimer=false;
    }
  }

  if(this.invisible && Math.floor(this.invisibleTimer/5)%2===0){
    return;
  }

  if(this.lives<=0){
    this.gameOver=true;
  }

  super.update();

}

respawn(){
  this.position.x=this.game.canvas.width/2;
  this.position.y=this.game.canvas.height/2;
  this.velocity.x=0;
  this.velocity.y=0;
  this.alive=true;
  this.visible=true;
  this.invisibleTimer=180;
}

createEngineParticle(){
  let backward=this.rotation+Math.PI;
  let particleVelocity=new Vector2(
    Math.cos(backward)*3,
    Math.sin(backward)*3
  );

  let particlePosition=new Vector2(
    this.position.x-Math.cos(this.rotation)*25,
    this.position.y-Math.sin(this.rotation)*25
  );

  let particle=new Particle(
    particlePosition.x,
    particlePosition.y,
    particleVelocity,
    "orange"
  );
  this.game.add(particle);
}

die(){
  if(!this.alive) return;
    this.alive=false;
    this.visible=false;
    this.velocity.x=0;
    this.velocity.y=0;
    this.game.loseLife();
    return;
  }


  render(context,camera){
    this.renderWrapEffect(context, camera);
    if(!this.visible) return;
    let blinking=false;
    if(this.invisibleTimer>0){
      blinking=Math.floor(this.blinkTimer/10)%2 === 0;
    }
    context.save();
    if(blinking){context.globalAlpha=0.3;
    }

    const screenPosition=camera.apply(this.position);

    context.translate(
      screenPosition.x,
      screenPosition.y
    );

    context.rotate(this.rotation+Math.PI/2);

    this.renderEngine(context);
    this.renderBody(context);
    this.renderCockpit(context);
    this.renderWings(context);
    this.renderCannons(context);
    this.renderGlow(context);
    this.renderFlames(context);

    context.restore();


    if(this.thrusting){
      this.velocity.x*=0.99;
      this.velocity.y*=0.99;
      this.game.audio.play("thrust");
    }

      const flame=20+Math.sin(performance.now()*0.03)*6;
      context.beginPath();
      context.moveTo(-6,20);
      context.lineTo(0,flame+20);
      context.lineTo(6,20);
      context.closePath();
      context.fillStyle="orange";
      context.fill();
    }

  renderEngine(context){
    context.shadowColor="#00ccff";
    context.shadowBlur=15;
    context.beginPath();
    context.moveTo(-6,16);
    context.lineTo(6,16);
    context.lineTo(4,22);
    context.lineTo(-4,22);
    context.fillStyle="#555";
    context.closePath();
    context.fill();
    context.shadowBlur=0;
  }

  renderBody(context){
    context.beginPath();
    context.moveTo(0,-80);
    context.lineTo(25,25);
    context.lineTo(12,16);
    context.lineTo(0,30);
    context.lineTo(-12,16);
    context.lineTo(-25,25);
    context.closePath();
    const bodyGradient=context.createLinearGradient(-20,-30,20,30);
    bodyGradient.addColorStop(0, "#ffffff");
    bodyGradient.addColorStop(0.3, "#d0d0d0");
    bodyGradient.addColorStop(0.7, "#8c8c8c");
    bodyGradient.addColorStop(1,"#4f4f4f");
    context.fillStyle=bodyGradient;
    context.fill();
  }

  renderCockpit(context){
    context.beginPath();
    context.ellipse(
      0,-10,8,14,0,0,Math.PI*2
    );
    const cockpitGradient=context.createRadialGradient(0,-10,1,0,-10,10);
    cockpitGradient.addColorStop(0, "#dff8ff");
    cockpitGradient.addColorStop(0.4, "#6fd7ff");
    cockpitGradient.addColorStop(1, "#0b6db0");
    context.fillStyle=cockpitGradient;
    context.fill();
  }


  renderWings(context){
    context.beginPath();
    context.moveTo(-20,12);
    context.lineTo(-38,30);
    context.lineTo(-16,20);
    context.closePath();
    context.strokeStyle="#555";
    context.lineWidth=2;
    context.stroke();
    context.fillStyle="#A0A0A0";
    context.fill();
    context.fillStyle="red";
    context.beginPath();
    context.arc(-38,20,4,0,Math.PI*2);
    context.fill();


    context.beginPath();
    context.moveTo(18,12);
    context.lineTo(38,30);
    context.lineTo(16,20);
    context.closePath();
    context.strokeStyle="#555";
    context.lineWidth=2;
    context.stroke();
    context.fillStyle="#A0A0A0";
    context.fill();
    context.fillStyle="cyan";
    context.beginPath();
    context.arc(38,20,4,0,Math.PI*2);
    context.fill();
  }

  renderCannons(context){
    context.fillStyle="#666";
    context.fillRect(-20,-36,6,18);
    context.fillRect(16,-36,6,18);
  }

  renderGlow(context){
    context.shadowBlur=15;
    context.shadowColor="#55aaff";
    context.strokeStyle="#88ddff";
    context.lineWidth=2;
    context.stroke();
    context.shadowBlur=0;
  }

  renderFlames(context){
  if(!this.thrusting) return;

  context.shadowBlur=20;
  context.shadowColor="orange";
  context.beginPath();
  context.moveTo(-4,26);
  context.lineTo(0,Math.random()*18);
  context.lineTo(4,26);
  context.closePath();
  context.fillStyle="orange";
  context.fill();
  context.shadowBlur=0;
  }
}
