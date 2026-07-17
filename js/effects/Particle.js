import { GameObject } from "../engine/GameObject.js";

export class Particle extends GameObject{
  constructor(x,y,velocity,color="orange"){
    super(x,y);
    this.velocity=velocity;
    this.radius=3;
    this.life=40;
    this.maxLife=40;
    this.color=color;
  }

  update(){
    this.life--;
    if(this.life<=0){
      this.destroyed=true;
    }
    super.update();
  }

  render(context,camera){
    const screen=camera.apply(this.position);
    context.save();
    context.beginPath();
    context.arc(
      screen.x,
      screen.y,
      this.radius,
      0,
      Math.PI*2
    );

    context.fillStyle=this.color;
    context.globalAlpha=this.life/this.maxLife;
    context.fill();

    context.restore();
  }
}