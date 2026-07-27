import { MenuParticle } from "./MenuParticle.js";

export class MenuShip{
  constructor(game){
    this.game=game;
    this.x=game.canvas.width/2;
    this.y=game.canvas.height*0.48;
    this.baseY=this.y;
    this.angle=0;
    this.float=0;
    this.speed=0.02;
    this.scale=1;
    this.engineTime=0;
    this.flameHeight=18;
    this.particles=[];
    this.resize();
  }

    resize(){
      this.x=this.game.canvas.width/2;
      this.baseY=this.game.canvas.height*0.48;
      if(window.innerwidth<600){
        this.scale=0.7;
      }else{this.scale=1;}
    }

  update(){
    this.float+=this.speed;
    this.y=this.baseY+Math.sin(this.float)*15;
    this.angle=Math.sin(this.float)*0.15;
    this.engineTime+=0.2;
    this.flameHeight=18+Math.sin(this.engineTime)*8;
    if(Math.random()<0.4){
      this.particles.push(
        new MenuParticle(
          this.x,this.y+22
        )
      );
      for(const particle of this.particles){
        particle.update();
      }
      this.particles=this.particles.filter(
        particle=>particle.life>0
      );
    }
  }

  render(context){
    context.scale(this.scale,this.scale);
    context.save();
    context.translate(this.x,this.y);
    context.rotate(this.angle);
    for(const particle of this.particles){
      particle.render(context);
    }

    context.shadowColor="brown";
    context.shadowBlur=15;
    const bodyGradient=context.createLinearGradient(-20,0,20,0);
    bodyGradient.addColorStop(0, "#ffffff");
    bodyGradient.addColorStop(0.45, "#d8d8d8");
    bodyGradient.addColorStop(0.7, "#808080");
    bodyGradient.addColorStop(1,"#4f4f4f");
    context.fillStyle=bodyGradient;
    context.beginPath();

    context.moveTo(0,-40);
    context.lineTo(22,30);
    context.lineTo(0,14);
    context.lineTo(-22,30);
    context.closePath();
    context.fill();

    context.shadowColor="00ccff";
    context.shadowBlur=15;
    context.fillStyle="#33ccff";
    context.beginPath();
    context.moveTo(-8,20);
    context.lineTo(0,20+this.flameHeight);
    context.lineTo(8,20);
    context.closePath();
    context.fill();
  
    context.shadowColor="orange";
    context.fillStyle="white";
    context.beginPath();
    context.moveTo(-4,20);
    context.lineTo(0,20+this.flameHeight*0.6);
    context.lineTo(4,20);
    context.closePath();
    context.fill();


    context.restore();
  }
}