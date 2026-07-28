export class TouchSteering{
  constructor(indicator){
    this.indicator=indicator;
    this.active=false;
    this.startX=0;
    this.startY=0;
    this.x=0;
    this.y=0;
    this.directionX=0;
    this.directionY=0;
    this.startTouchX=0;
    this.startTouchY=0;
    this.touchID=null;
    this.setupControls();
  }

  setupControls(){
    window.addEventListener(
      "touchstart",(event)=>{
        const touch=event.changedTouches[0];
        this.touchID=touch.identifier;
        this.active=true;
        this.startX=touch.clientX;
        this.startY=touch.clientY;
        this.startTouchX=touch.clientX;
        this.startTouchY=touch.clientY;
        this.indicator.show(
          touch.clientX,touch.clientY
        );
      }
    );

    window.addEventListener(
      "touchmove",(event)=>{
        if(!this.active) return;
        const touch=null;
        for(const t of event.changedTouches){
          if(t.identifier===this.touchID){
            touch=t;
            break;
          }
        }
        if(!touch) return;
        this.x=touch.clientX-this.startX;
        this.y=touch.clientY-this.startY;
        const distance=Math.hypot(this.x,this.y);
        if(distance>0){
          this.directionX=this.x/distance;
          this.directionY=this.y/distance;
        }
      }
    );
    window.addEventListener(
      "touchend",()=>{
        this.active=false;
        this.x=0;
        this.y=0;
        this.directionX=0;
        this.directionY=0;
      }
    );
  }
}