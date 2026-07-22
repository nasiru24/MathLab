export class PulseButton{
  constructor(x,y,radius=45){
    this.x=window.innerWidth-270;
    this.y=window.innerHeight-140;
    this.radius=radius;
    this.pressed=false;
    this.pulse=0;
  }

  update(){
    this.pulse+=0.08;
  }

  render(context){
   // if(!this.visible) return;
   this.radius=this.pressed?55:45;
    context.save();
    context.shadowBlur=this.pressed?40:20;
    context.shadowColor="#00ffff";
    context.globalAlpha=0.25;
    context.beginPath();
    context.arc(
      this.x,this.y,
      this.radius+10,0,
      Math.PI*2
    );
    context.fillStyle=this.pressed?"#00bfff":"rgba(0,255,255,0.25)";
    context.fill();
    context.globalAlpha=1;

    context.beginPath();
    context.arc(
      this.x,this.y,this.radius,0,Math.PI*2
    );
    context.lineWidth=3;
    context.strokeStyle="#00ffff";
    context.stroke();
    context.fillStyle=this.pressed?"#00ffff":"#0066ff";
    context.fill();
    context.shadowBlur=0;

    context.fillStyle="white";
    context.font="bold 24px Arial";
    context.textAlign="center";
    context.textBaseline="middle";
    context.fillText(
      "PULSE",this.x,this.y+5
    );

    context.restore();
  }
}