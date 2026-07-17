export class TouchControls{
  constructor(){
    this.left=false;
    this.right=false;
    this.up=false;
    this.fire=false;

    window.addEventListener(
      "touchstart",(e)=>{
        let x=e.touches[0].clientX;
        let y=e.touches[0].clientY;

        if(x<innerWidth/2){
          this.up=true;
        }
        else{this.fire=true;}
      }
    );

    window.addEventListener(
      "touchend",()=>{
        this.up=false;
        this.fire=false;
      }
    );
  }
}