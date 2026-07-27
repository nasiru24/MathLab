export class MenuParticle{
  constructor(x,y){
    this.reset();
  }

  reset(x,y){
    this.x=x;
    this.y=y;
    this.size=Math.random()*4+2;
    this.speed=Math.random()*2+1;
    this.life=1;
    this.fade=0.02;
  }

  update(){
    this.x+=this.speed;
    this.size*=0.98;
    this.life-=this.fade;
  }

  render(context){
    if(this.life<=0) return;
    context.save();
    context.globalAlpha=this.life;
    context.fillStyle="#66ddff";
    context.shadowColor="#00ffff";
    context.shadowBlur=12;

    context.beginPath();
    context.arc(
      this.x,this.y,
      this.size,0,
      Math.PI*2
    );
    context.fill();

    context.restore();
  }
}