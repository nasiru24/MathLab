import { GameObject } from "../engine/GameObject.js";
import { Vector2 } from "../math/Vector2.js";
import { RockFragment } from "./RockFragment.js";

export class ExplosionParticle extends GameObject{
  constructor(x,y){
    super(x,y);
    const angle=Math.random()*Math.PI*2;
    const speed=Math.random()*6+2;
    this.velocity=new Vector2(
      Math.cos(angle)*speed,
      Math.sin(angle)*speed
    );
    this.radius=Math.random()*3+2;
    this.alpha=1;
    this.life=40;
  }

  update(){
    this.position.add(this.velocity);
    this.velocity.multiply(0.96);
    this.life--;
    if(this.life<=0){
      this.destroyed=true;
    }
  }

  render(context,camera){
    const screen=camera.apply(this.position);
    context.save();
    context.globalAlpha=this.life/40;
    context.fillStyle="#ffaa00";

    context.beginPath();

    context.arc(
      screen.x,
      screen.y,
      this.radius,
      0,
      Math.PI*2
    );
    
    context.fill();

    context.restore();
  }
}