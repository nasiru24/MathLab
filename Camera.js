import { Vector2 } from "../math/Vector2.js";
export class Camera{
  constructor(width,height){
    this.position=new Vector2(0,0);
    this.width=width;
    this.height=height;
    this.target=null;
    this.smoothness=0.08;
    this.shakeStrength=0;
    this.shakeDuration=0;
    this.offset=new Vector2(0,0);
    this.deadZone=100;
  }

  follow(object){
    this.target=object;
  }

  update(){
    if(this.target){
      let lookAheadX=this.target.velocity.x*30;
      let lookAheadY=this.target.velocity.y*30;

      let targetX=this.target.position.x+lookAheadX-this.width/2;
      let targetY=this.target.position.y+lookAheadY-this.height/2;

      this.position.x+=(targetX-this.position.x)*this.smoothness;
      this.position.y+=(targetY-this.position.y)*this.smoothness;
    }

    if(this.shakeDuration>0){
      this.offset.x=(Math.random()-0.5)*this.shakeStrength;
      this.offset.y=(Math.random()-0.5)*this.shakeStrength;
      this.shakeDuration--;
    }else{
      this.offset.x=0;
      this.offset.y=0;
    }
  }
  
  apply(position, depth=1){
    return {
      x:position.x-this.position.x*depth,
      y:position.y-this.position.y*depth
    };
  }

  shake(power,frames){
    this.shakeStrength=power;
    this.shakeDuration=frames;
  }
}