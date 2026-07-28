export class WeaponButton{
  constructor(ship){
    this.ship=ship;
    let bottomOffset=40;
    if(window.innerWidth<600){
      bottomOffset=100;
    }
    const scale=Math.min(window.innerWidth/400,1.4);
    this.radius=20*scale;

    this.currentWeapon="SINGLE";

    this.weaponButtonX=0;
    this.weaponButtonY=0;
    this.resize();

    this.pressed=false;
    this.setupControls();
    window.addEventListener("resize",()=>{
    });
  }

  setupControls(){
    window.addEventListener("touchstart",(event)=>{
      for(const touch of event.touches){
        let rect=document.querySelector("canvas").getBoundingClientRect();
        let distance=Math.hypot((touch.clientX-rect.left)-this.weaponButtonX,
        (touch.clientY-rect.top)-this.weaponButtonY);
        if(distance<this.radius){
          this.pressed=true;
          input.touch.weaponSwitch=true;
        }
      }
    });
    window.addEventListener("touchend",()=>{
      this.pressed=false;
    });
    window.addEventListener("mousedown",(event)=>{
      let rect=document.querySelector("canvas").getBoundingClientRect();
        let distance=Math.hypot((event.clientX-rect.left)-this.weaponButtonX,
        (event.clientY-rect.top)-this.weaponButtonY);
        if(distance<this.radius){
          this.pressed=true;
        }
      }
    );
    window.addEventListener("mouseup",()=>{
      this.pressed=false;
    });
  }

  resize(){
    let bottomOffset=40;
    if(window.innerWidth<600){
      bottomOffset=100;
    }
    const scale=Math.min(window.innerWidth/400,1.4);
    this.radius=40*scale;
    this.weaponButtonX=window.innerWidth-this.radius-25;
    this.weaponButtonY=window.innerHeight/2;
  }

  render(context,x,y,radius){
   this.radius=this.pressed?50:45;
    context.save();
    context.shadowBlur=this.pressed?40:20;
    context.shadowColor="#00ffff";
    context.globalAlpha=0.25;
    context.beginPath();
    context.arc(
      this.weaponButtonX,this.weaponButtonY,
      this.radius+10,0,
      Math.PI*2
    );
    context.fillStyle=this.pressed?"#00bfff":"rgba(0,255,255,0.25)";
    context.fill();
    context.globalAlpha=1;

    context.shadowBlur=this.pressed?40:20;
    context.shadowColor="#c084ff";
    context.beginPath();
    for(let i=0;i<6;i++){
      const angle=Math.PI/3*i-Math.PI/6;
      const px=x+radius*Math.cos(angle);
      const py=y+radius*Math.sin(angle);
      if(i===0){
        context.moveTo(px,py);
      }else{context.lineTo(px,py);}
    }

    context.lineWidth=3;
    context.strokeStyle="#c084ff";
    context.stroke();
    context.fillStyle=this.pressed?"#d8b4fe":"#24163d";
    context.fill();
    context.shadowBlur=0;
    context.fillStyle="white";
    context.font="bold 16px Arial";
    context.textAlign="center";
    context.textBaseline="middle";

    const text=this.ship.currentWeapon==="SINGLE"
    ?"SINGLE":"TWIN";
    context.fillText(text,this.weaponButtonX,
      this.weaponButtonY-5);
      context.fillText("Q",this.weaponButtonX,this.weaponButtonY+15);

    context.restore();
  }
}