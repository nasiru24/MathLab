export class MenuStar{
  constructor(width,height){
    this.width=width;
    this.height=height;
    this.reset();
  }

  reset(){
    this.x=Math.random()*this.width;
    this.y=Math.random()*this.height;
    this.radius=Math.random()*2+1;
    this.speed=Math.random()*0.5+0.2;
    this.alpha=Math.random();
    this.fadeSpeed=Math.random()*0.02;
  }

  update(){
    this.y+=this.speed;
    this.alpha+=this.fadeSpeed;
    if(this.alpha>=1 || this.alpha<=0.2){
      this.fadeSpeed*=-1;

    }
    if(this.y>this.height){
      this.y=0;
      this.x=Math.random()*this.width;
    }
  }

  render(context){
    context.save();
    context.globalAlpha=this.alpha;
    context.fillStyle="white";
    context.beginPath();
    context.arc(
      this.x,this.y,
      this.radius,0,
      Math.PI*2
    );
    context.fill();
    context.restore();
  }
}