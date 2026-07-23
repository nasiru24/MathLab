export class MenuStar{
  constructor(game,width,height){
    this.game=game;
    //this.canvas=this.game.canvas;
    this.width=this.game.canvas.width;
    this.height=this.game.canvas.height;
    this.radius=Math.random()*2+1;
    this.speed=Math.random()*0.4+0.2;
    this.alpha=Math.random()*0.5+0.5;
    this.reset();
  }

  reset(){
    this.x=Math.random()*this.width;
    this.y=Math.random()*this.height;
    this.radius=Math.random()*2+1;
    this.speed=Math.random()*0.4+0.2;
    this.alpha=Math.random()*0.5+0.5;
    this.fadeSpeed=Math.random()*0.02;
  }

  update(){
    this.y+=this.speed;
    this.alpha+=this.fadeSpeed;
    if(this.alpha>=1 || this.alpha<=0.2){
      this.fadeSpeed*=-1;

    }
    if(this.y>this.height+5){
      this.y=-5;
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