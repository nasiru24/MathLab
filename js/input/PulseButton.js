export class PulseButton{
  constructor(x,y,radius){
    let bottomOffset=40;
    if(window.innerWidth<700){
      bottomOffset=95;
    }
    const scale=Math.min(window.innerWidth/400,1.4);
    this.radius=40*scale;
    const spacing=this.radius*2+20;
    const margin=window.innerWidth<700?25:40;
    const bottom=window.innerHeight-this.radius-40;
    this.x=window.innerWidth-this.radius-margin-spacing;
    this.y=window.innerHeight-this.radius-bottomOffset;
    this.pressed=false;
    this.pulse=0;
    this.resize();
    this.setupControls();
  }

  resize(){
    let bottomOffset=40;
    if(window.innerWidth<700){
      bottomOffset=95;
    }
    const scale=Math.min(window.innerWidth/400,1.4);
    this.radius=40*scale;
    const bottom=window.innerHeight-this.radius-40;
    const margin=window.innerWidth<700?25:40;
    const spacing=this.radius*2+20;
    this.x=window.innerWidth-this.radius-margin-spacing;
    this.y=window.innerHeight-this.radius-bottomOffset;
  }


  setupControls(){
    console.log("PULSE PRESSED");
    window.addEventListener("touchstart",(event)=>{
      for(const touch of event.touches){
        let distance=Math.hypot(touch.clientX-this.x,touch.clientY-this.y);
        if(distance<this.radius){
          this.pressed=true;
        }
      }
    });
    window.addEventListener("touchend",()=>{
      this.pressed=false;
    });
    window.addEventListener("mousedown",(event)=>{
      console.log("Mouse Down");
        let distance=Math.hypot(event.clientX-this.x,event.clientY-this.y);
        if(distance<this.radius){
          console.log("Pulse Mouse");
          this.pressed=true;
        }
      }
    );
    window.addEventListener("mouseup",()=>{
      console.log("Mouse up");
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