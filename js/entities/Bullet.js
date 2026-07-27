import { GameObject } from "../engine/GameObject.js";
export class Bullet extends GameObject{
  constructor(x,y,rotation){
    super(x,y);
    this.radius=5;
    this.speed=70;
    this.life=120;
    this.damage=10;
    this.glow=18;
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
    if(this.life<=0){
      this.destroy=true;
    }
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
    context.shadowBlur=this.glow;
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
    const gradient=context.createRadialGradient(0,0,1,0,0,this.radius);
    gradient.addColorStop(0,"white");
    gradient.addColorStop(0.35,"#9fffff");
    gradient.addColorStop(1,"#00bfff");
    context.fillStyle=gradient;
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
    context.globalAlpha=0.35;
    context.strokeStyle="#66ffff";
    context.lineWidth=2;
    context.beginPath();
    context.moveTo(
      -Math.cos(this.rotation)*16,
      -Math.sin(this.rotation)*16

    );
    context.lineTo(0,0);
    context.stroke();

    context.restore();
  }
}