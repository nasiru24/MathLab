export class PulseButton{
  constructor(x,y,radius){
    console.log("pulseButton constructor");
    const bottom=window.innerHeight-80;
    this.x=window.innerWidth-170;
    this.y=bottom;
    this.radius=window.innerWidth<600?35:45;
    this.pressed=false;
    this.pulse=0;
    this.setupControls();

  }

  setupControls(){
    console.log("PULSE PRESSED");
    window.addEventListener("touchstart",(event)=>{
      for(const touch of event.touches){
        let distance=Math.hypot(touch.clientX-this.x,touch.clientY-this.y);
        if(distance<this.radius){
          console.log("INSIDE PULSE BUTTON");
          this.pressed=true;
        }
      }
    });

    window.addEventListener("touchend",()=>{
      this.pressed=false;
    });
  }
  

  update(){
    this.pulse+=0.08;
  }

  render(context){
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
    context.font="bold 22px Arial";
    context.textAlign="center";
    context.textBaseline="middle";
    context.fillText(
      "PULSE",this.x,this.y+5
    );

    context.restore();
  }
}