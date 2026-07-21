export class Joystick{
  constructor(){
    this.baseX=window.innerWidth*0.18;
    this.baseY=window.innerHeight*0.82;
    this.knobX=this.baseX;
    this.knobY=this.baseY;
    this.radius=Math.min(window.innerWidth,window.innerHeight)*0.08;
    this.knobRadius=this.radius*0.45;
    this.active=false;
    this.moveX=0;
    this.moveY=0;
    this.setupControls();
    this.targetX=this.baseX;
    this.targetY=this.baseY;
    this.smoothness=0.25;
    window.addEventListener("resize",()=>{
      this.resize();
    });
  }

  setupControls(){
    window.addEventListener(
      "touchstart",(event)=>{
        const touch=event.touches[0];
        const distance=Math.hypot(touch.clientX-this.baseX,
          touch.clientY-this.baseY
        );
        if(distance<this.radius*2){
          this.active=true;
        }
      }
    );

    window.addEventListener("touchmove",(event)=>{
      console.log("Joystick",this.moveX,this.moveY);
      if(!this.active) return;
      const touch=event.touches[0];
      let dx=touch.clientX-this.baseX;
      let dy=touch.clientY-this.baseY;
      let distance=Math.hypot(dx,dy);

      if(distance>this.radius){
        dx=(dx/distance)*this.radius;
        dy=(dy/distance)*this.radius;
      }
      this.targetX=this.baseX+dx;
      this.targetY=this.baseY+dy;
      this.moveX=dx/this.radius;
      this.moveY=dy/this.radius;
      const deadZone=0.15;
      if(Math.abs(this.moveX)<deadZone){
        this.moveX=0;
      }
      if(Math.abs(this.moveY)<deadZone){
        this.moveY=0;
      }
    });

    window.addEventListener("touchend",()=>{
      this.active=false;
      this.targetX=this.baseX;
      this.targetY=this.baseY;
      this.moveX=0;
      this.moveY=0;
    });
  }

  resize(){
    this.baseX=window.innerWidth*0.18;
    this.baseY=window.innerHeight*0.82;
    this.radius=Math.min(window.innerWidth,window.innerHeight)*0.08;
    this.knobRadius=this.radius*0.45;
    this.targetX=this.baseX;
    this.targetY=this.baseY;
    this.knobX=this.baseX;
    this.knobY=this.baseY;
  }

  update(){
    this.knobX+=(this.targetX-this.knobX)*this.smoothness;
    this.knobY+=(this.targetY-this.knobY)*this.smoothness;
  }

  render(context){
    /*if(input.mode!=="joystick"){
      return;
    }*/
    context.save();
    context.beginPath();
    context.arc(
      this.baseX,this.baseY,
      this.radius,0,
      Math.PI*2
    );
    context.fillStyle="rgba(255,255,255,0.2)";
    context.fill();

    context.beginPath();
    context.arc(
      this.knobX,this.knobY,
      this.knobRadius,0,
      Math.PI*2
    );
    context.fillStyle="cyan";
    context.fill();
    context.restore();
  }
}