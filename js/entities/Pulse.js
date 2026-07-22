import { GameObject } from "../engine/GameObject.js";
import { Vector2 } from "../math/Vector2.js";

export class Pulse extends GameObject{
  constructor(x,y){
    super(x,y);
    this.radius=20;
    this.maxRadius=350;
    this.speed=12;
    this.life=1;
    this.damageRadius=150;
    this.force=5;
    this.hitObjects=new Set();
  }

  update(){
    this.radius+=this.speed;
    this.life-=0.02;
    if(this.radius>this.maxRadius){
      this.destroyed=true;
    }
    if(this.life<=0){
      this.destroyed=true;
    }
  }

  render(context,camera){
    const screen=camera.apply(this.position);
    
    context.save();
    context.beginPath();
    context.arc(
      screen.x,screen.y,
      this.radius,0,
      Math.PI*2
    );
    context.strokeStyle=`rgba(0,200,255,${this.life})`;
    context.lineWidth=8;
    context.shadowBlur="#00ffff";
    context.stroke();
    
    context.beginPath();
    context.arc(
      screen.x,screen.y,
      this.radius*0.5,0,
      Math.PI*2
    );
    context.strokeStyle=`rgba(255,255,255,${this.life*0.5})`;
    context.lineWidth=3;
    context.stroke();

    context.restore();
  }
}