import { GameObject } from "../engine/GameObject.js";
import { Vector2 } from "../math/Vector2.js";
export class Star extends GameObject{
  constructor(x,y,size=2,depth=1,ship,colors=["#FFFFFF","#FFE9A3","#A8D8FF","#FFD6F5","#FFF4CC"]){
    super(x,y);
    this.ship=ship;
    this.depth=depth;
    this.size=size;
    this.radius=size;
    this.color=colors[Math.floor(Math.random()*colors.length)];
    this.speed=this.depth*8+1;
    this.opacity=this.depth;
    this.horizontalSpeed=(Math.random()-0.5)*this.depth;
    this.brightness=Math.random();
    this.twinkle=0.01+Math.random()*0.02;
    this.twinkleSpeed=Math.random()*0.05+0.01;
    this.twinkleOffset=Math.random()*Math.PI*2;
    this.position=new Vector2(x,y);
    this.type=Math.random();
  }

  update(){
  }

 /* drawStar(context){
    let spikes=5;
    let outerRadius=this.size;
    let innerRadius=this.size*0.45;
    let rotation=Math.PI/2*3;
    context.beginPath();
    for(let i=0;i<spikes;i++){
      let x=Math.cos(rotation)*outerRadius;
      let y=Math.sin(rotation)*outerRadius;
      context.lineTo(x,y);
      rotation+=Math.PI/spikes;
      x=Math.cos(rotation)*innerRadius;
      y=Math.sin(rotation)*innerRadius;
      context.lineTo(x,y);
      rotation+=Math.PI/spikes;

    }
    context.closePath();
  }*/

  render(context,camera){
      const screenPosition=camera.apply(this.position, this.depth);
      context.save();
      context.translate(
        screenPosition.x,
        screenPosition.y
      );
      this.brightness+=Math.sin(performance.now()*this.twinkleSpeed+this.twinkleOffset)*this.twinkle;
      this.brightness=Math.max(0.3,Math.min(1,this.brightness));
      context.beginPath();
      let glow=context.createRadialGradient(
        0,
        0,
        0,
        0,
        0,
        Math.max(1, this.size*4)
      );

       glow.addColorStop(
        0,
        this.color
      );
      glow.addColorStop(
        1,
        "transparent"
      );

      context.shadowBlur=10;
      context.shadowColor=this.color;
      context.fillStyle=glow;
      context.globalAlpha=this.brightness*this.opacity;
      context.beginPath();
      context.arc(
        0,
        0,
        this.size*4,
        0,
        Math.PI*2
      );
      context.fill();
      context.globalAlpha=this.opacity;
      context.fillStyle=this.color;
      context.shadowBlur=0;
      
      if(this.type<0.2){
        context.beginPath();
        context.arc(
          0,
          0,
          this.size,
          0,
          Math.PI*2
        );
        context.fill();
      }else{
      context.rotate(Math.PI/4);
       context.beginPath();
      context.moveTo(0,-this.size*2);
      context.lineTo(this.size*0.5,0);
      context.lineTo(0, this.size*2);
      context.lineTo(-this.size*0.5,0);
      context.closePath();
      context.fill();
      }
      
    context.globalAlpha=1;

    context.restore();
  }
}