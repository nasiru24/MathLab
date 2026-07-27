export class ShootingStar{
  constructor(game){
    this.game=game;
    this.width=window.innerWidth;
    this.height=window.innerHeight;
    this.timer=Math.random()*200;
    this.active=false;
    this.reset();
    this.delay=Math.random()*500;
  }

  reset(){
    this.x=Math.random()*this.width;
    this.y=Math.random()*this.height;
    this.speed=Math.random()*8+5;
    this.length=Math.random()*80+40;
  }

  update(){
    if(!this.active){
      this.timer--;
      if(this.timer<=0){
        this.active=true;
        this.reset();
      }
      return;
      if(this.delay>0){
      this.delay--;
      return;
    }
    }
    this.x+=this.speed;
    this.y+=this.speed;
    if(this.y>this.game.canvas.height){
      this.active=false;
      this.timer=Math.random()*200;
    }
    
  }

  render(context){
    if(!Number.isFinite(this.x) || !Number.isFinite(this.y)){
      return;
    }
    context.save();
    let gradient=context.createLinearGradient(
      this.x,this.y,
      this.x-this.length,
      this.y-this.length
    );
    gradient.addColorStop(
      0,"yellow"
    );
    gradient.addColorStop(
      1,"transparent"
    );
    context.strokeStyle=gradient;
    context.lineWidth=2;
    context.beginPath();
    context.moveTo(this.x,this.y);
    context.lineTo(this.x-this.length,
      this.y-this.length
    );
    context.stroke();

    context.restore();
  }

}