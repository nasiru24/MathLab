export class MenuStar{
  constructor(game){
    this.game=game;
    this.width=game.canvas.width;
    this.height=game.canvas.height;
    this.radius=Math.random()*3+1;
    const colors=[
      "yellow","#ff4d","#ff9999","#ff0000","#ECECEC","180,100,255"
    ];
    this.color=colors[Math.floor(Math.random()*colors.length)];
    this.layer=Math.random();
    this.speed=0.2+this.layer*1.5;
    this.alpha=Math.random()*0.5+0.5;
    this.twinkleSpeed=Math.random()*0.03+0.01;
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
    this.alpha+=Math.sin(Date.now()*this.twinkleSpeed)*0.01;
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
    let glow=this.radius*4;
    context.globalAlpha=this.alpha;
    context.shadowColor=`rgb(${this.color})`;
    context.shadowBlur=glow;
    context.fillStyle=this.color;
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