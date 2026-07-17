import { Vector2 } from "../math/Vector2.js";
export class Nebula{
  constructor(x,y,radius,color,depth,size){
    this.position=new Vector2(x,y);
    this.radius=radius;
    this.size=size;
    this.color=color;
    this.gradient=null;
    this.depth=depth;
    this.opacity=0.15;
    this.pulse=Math.random()*Math.PI*2;
  }

  createGradient(context){
    this.gradient=context.createRadialGradient(
      0,0,0,0,0,this.radius
    );
    this.gradient.addColorStop(0,"rgba(120,80,255,0.3)");
    this.gradient.addColorStop(1,"transparent");
  }

  update(){
    this.pulse+=0.005;
    this.opacity=0.12+Math.sin(this.pulse)*0.03;
  }

  render(context,camera){
    const screen=camera.apply(
      this.position,
      this.depth
    );
    context.save();
    if(!this.gradient){
      this.createGradient(context);
    }

    context.fillStyle=this.gradient;
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