import { Vector2 } from "../math/Vector2";

export class FloatText{
  constructor(x,y,text){
    this.position=new Vector2(x,y);
    this.text=text;
    this.life=60;
  }

  update(){
    this.position.y-=0.5;
    this.life--;
  }

  render(){
    context.globalAlphal=this.life/60;
    context.fillStyle="#ffff00";
    context.font="20px Arial";
    context.fillText();

    context.destroyed=true;
  }
}