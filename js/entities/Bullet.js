import { GameObject } from "../engine/GameObject.js";
export class Bullet extends GameObject{
  constructor(x,y,rotation){
    super(x,y);
    this.radius=4;
    this.speed=70;
    this.life=120;
    this.velocity={
      x:Math.cos(rotation)*this.speed,
      y:Math.sin(rotation)*this.speed
    };
    this.trail=[];
  }

  update(){
    this.position.x+=this.velocity.x;
    this.position.y+=this.velocity.y;
    this.life--;
    this.trail.push({
      x:this.position.x,
      y:this.position.y
    });
    if(this.trail.length>8){
      this.trail.shift();
    }
  }

  render(context,camera){
    const screen=camera.apply(this.position);
    context.save();
    context.shadowBlur=15;
    context.shadowColor="#00ffff";
    for(let i=0;i<this.trail.length;i++){
      const point=camera.apply(this.trail[i]);
    context.beginPath();
    context.globalAlpha=i/this.trail.length;

    context.arc(
      point.x,
      point.y,
      2,
      0,
      Math.PI*2
    );
    context.fillStyle="#00ffff";
    context.fill();
    context.globalAlpha=1;
  }

    context.beginPath();

    context.arc(
      screen.x,
      screen.y,
      this.radius,
      0,
      Math.PI*2
    );

    context.fillStyle="#00ffff";
    context.fill();

    context.restore();
  }
}