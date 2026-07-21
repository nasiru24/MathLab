export class FireButton{
  constructor(){
    this.radius=45;
    this.x=window.innerWidth*0.85;
    this.y=window.innerHeight*0.82;
    this.pressed=false;
    this.setupControls();
  }

  setupControls(){
    window.addEventListener("touchstart",(event)=>{
      for(const touch of event.touches){
        const distance=Math.hypot(
          touch.clientX-this.x,touch.clientY-this.y
        );
        if(distance<this.radius){
          console.log("Fire pressed");
          this.pressed=true;
        }
      }
    });
    window.addEventListener("touchend",()=>{
      this.pressed=false;
    });
  }

  render(context){
    context.save();
    context.globalAlpha=0.35;
    context.beginPath();
    context.arc(
      this.x,this.y,
      this.radius,0,
      Math.PI*2
    );
    context.fillStyle="red";
    context.fill();

    context.globalAlpha=1;
    context.fillStyle="white";
    context.font="28px Arial";
    context.textAlign="center";
    context.textBaseline="middle";
    context.fillText(
      "",this.x,this.y
    );
    context.restore();
  }
}