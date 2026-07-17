import { Particle } from "../effects/Particle.js";
import { Vector2 } from "../math/Vector2.js";

export class RockFragment extends Particle{
  constructor(x,y){
    super(x,y);
    this.velocity=new Vector2(
      Math.random()*4-2,
      Math.random()*4-2
    );
    this.acceleration=new Vector2(0,0);
    this.radius=2+Math.random()*4;
    this.life=40+Math.random()*20;
    this.color="#888888";
    this.rotation=Math.random()*Math.PI*2;
    this.rotationSpeed=(Math.random()-0.5)*0.4;
  }

  update(){
    super.update();
    this.life--;
    if(this.life<=0){
      this.destroyed=true;
    }
    this.rotation+=this.rotationSpeed;
    
  }

  render(context,camera){
    const p=camera.apply(this.position);
    context.save();
    context.translate(p.x,p.y);
    context.rotate(this.rotation);
    context.fillStyle=this.color;
    context.fillRect(
      -this.radius,
      -this.radius,
      this.radius*2,
      this.radius*2
    );

    context.restore();
  }
}