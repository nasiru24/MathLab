export class InputManager{
  constructor(input,joystick,fireButton,pulseButton){
    this.input=input;
    this.joystick=joystick;
    this.fireButton=fireButton;
    this.pulseButton=pulseButton;
  }

  update(){
    this.input.moveX=0;
    this.input.moveY=0;
    if(this.input.controlMode==="joystick"){
      this.input.moveX=this.joystick.moveX;
      this.input.moveY=this.joystick.moveY;
    }
    else if(this.input.controlMode==="buttons"){
      this.input.moveX=this.input.touchRight-this.input.touchLeft;
      this.input.moveY=this.input.touchDown-this.input.touchUp;
    }
    this.input.fire=this.fireButton.pressed;
    this.input.pulse=this.pulseButton.pressed;
  }
}