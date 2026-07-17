import { GameObject } from "../engine/GameObject.js";
import { Vector2 } from "../math/Vector2.js";

export class EngineParticle extends GameObject{
  constructor(x,y,rotation){
    super(x,y);
    let spread=(Math.random()-0.5)*0.5;
    let angle=rotation+Math.PI+spread;
    let speed=Math.random()*5+2;
    this.velocity=new Vector2(
      Math.cos(angle)*speed,
      Math.sin(angle)*speed
    );
    this.life=15+Math.random()*15;
    this.alpha=1;
    this.radius=Math.random()*5+2;
  }

  update(){
    this.position.add(this.velocity);
    this.velocity.multiply(0.95);
    this.life--;
    this.alpha=this.life/20;
    if(this.life<=0){
      this.destroyed=true;
    }
  }

  render(context,camera){
    let screen=camera.apply(this.position);
    context.save();
    context.globalAlpha=this.life/30;
    context.fillStyle="orange";

    context.beginPath();

    context.arc(
      this.position.x-camera.x,
      this.position.y-camera.y,
      this.radius,
      0,
      Math.PI*2
    );
    context.fill();
    context.globalAlpha=1;

    context.restore();
  }
}