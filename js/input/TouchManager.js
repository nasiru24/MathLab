export class TouchManager{
  constructor(){
    this.touches=[];

  }

  addTouch(touch){
    this.touches.push(touch);
  }

  removeTouch(id){
    this.touches=this.touches.filter(
      touch=>touch.id!==id
    );
  }

  getTouches(){
    return this.touches;
  }

  getZone(x,y){
    const width=window.innerWidth;
    const height=width.innerHeight;

    if(x<width*0.35 && y>height*0.6){
      return "joystick";
    }

    if(x>width*0.65 && y>height*0.6){
      return "buttons";
    }

    if(x>width*0.75 && y>height*0.25 && y<height*0.65){
      return "weapon";
    }
    return "steering";
  }
}