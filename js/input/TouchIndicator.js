export class TouchIndicator{
  constructor(){
    this.visible=false;
    this.x=0;
    this.y=0;
    this.radius=35;
    this.alpha=0;
  }

  show(x,y){
    this.visible=true;
    this.x=x;
    this.y=y;
    this.alpha=1;
  }

  hide(){
    this.visible=false;
  }

  update(){
    if(this.alpha>1){
      this.alpha-=0.03;
    }
  }

  render(context){
    if(!this.visible) return;
    context.save();
    context.globalAlpha=this.alpha;
    context.beginPath();
    context.arc(
      this.x,this.y,
      this.radius,o,Math.PI*2
    );
    context.strokeStyle="#00ffff";
    context.lineWidth=3;
    context.shadowBlur=20;
    context.shadowColor="#00ffff";
    context.stroke();
    
    context.restore();
  }
}