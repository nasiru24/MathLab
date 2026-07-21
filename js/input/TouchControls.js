export class TouchControls{
  constructor(input){
    this.input=input;
    this.buttons=[];
    this.createButton("","up",80,window.innerHeight-180);
    this.createButton("","left",20,window.innerHeight-100);
    this.createButton("","right",140,window.innerHeight-100);
    this.createButton("","fire",window.innerWidth-120,window.innerHeight-120);
  }
  createButton(text,type,x,y){
    if(this.input.controlMode!=="buttons"){
      return;
    }
    let button=document.createElement("button");
    button.innerHTML=text;
    button.style.position="fixed";
    button.style.left=x+"px";
    button.style.top=y+"px";
    button.style.width="70px";
    button.style.height="70px";
    button.style.fontSize="30px";
    button.style.opacity="0.6";
    button.style.borderRadius="50%";

    button.addEventListener(
      "touchstart",()=>{
        this.input.touch[type]=true;
      }
    );

    button.addEventListener(
      "touchend",()=>{
        this.input.touch[type]=false;
      }
    );

    document.body.appendChild(button);
  }
}