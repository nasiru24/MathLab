
import { Vector2 } from "../math/Vector2.js";

export class GameObject{
  constructor(x=0,y=0){
    this.position=new Vector2(x,y);
    this.velocity=new Vector2();
    this.acceleration=new Vector2();
    this.rotation=0;
    this.visible=true;
    this.radius=20;
    this.destroyed=false;
    this.wrapEffect=[];
  }

  update(){
    this.velocity.add(
      this.acceleration
    );

    this.position.add(
      this.velocity
    );
   this.velocity.multiply(0.99);
   for(let i=this.wrapEffect.length-1;i>0;i--){
    let particle=this.wrapEffect[i];
    particle.life--;
    particle.size*=0.95;
    if(particle.life<=0){
      this.wrapEffect.splice(i,1);
    }
   }
  }

  wrapAround(width,height){
    let wrapped=false;
    if(this.position.x<0){
      this.position.x=width;
      wrapped=true;
    }
    if(this.position.x>width){
      this.position.x=0;
      wrapped=true;
    }
    if(this.position.y<0){
      this.position.y=height;
      wrapped=true;
    }
    if(this.position.y>height){
      this.position.y=0;
      wrapped=true;
    }
    if(wrapped){
      this.createWrapEffect();
    }
  }

  createWrapEffect(){
    for(let i=0;i<15;i++){
      this.wrapEffect.push(
        {
        x:this.position.x,
        y:this.position.y,
        life:30,
        size:Math.random()*5+2 ,
        velocity:new Vector2(
          Math.random()-0.5,
          Math.random()-0.5
        )
      });
    }
  }

  renderWrapEffect(context, camera){
    for(let particle of this.wrapEffect){
      const screen=camera.apply(
        new Vector2(particle.x, particle.y)
      );
      context.beginPath();
      context.arc(
        screen.x,
        screen.y,
        particle.size,
        0,
        Math.PI*2
      );
      context.fillStyle="rgba(0,255,255,"+particle.life/30+")";
      context.fill();
    }
  }

  render(context,camera){
    
  }

}