export class Menu{
  constructor(game){
    this.game=game;
    this.canvas=game.canvas;
    this.mouse={
      x:0,
      y:0
    }
    this.startButton={
      x:0, 
      y:0,
      width:250,
      height:80
    };
    this.touchStart=false;
    this.clicked=false;
    this.canvas.addEventListener(
      "touchstart",(event)=>{
          this.clicked=true;
        });
    this.canvas.addEventListener("click",(event)=>{
      this.clicked=true;
    });
    game.canvas.addEventListener("mousemove",(e)=>{
      const rect=game.canvas.getBoundingClientRect();
      this.mouse.x=e.clientX-rect.left;
      this.mouse.y=e.clientY-rect.top;
    });
  }

  
  update(){

    let button=this.startButton;
    if(this.clicked && this.mouse.x>button.x && this.mouse.x<button.x + button.width &&
      this.mouse.y>button.y && this.mouse.y<button.y +button.height
    ){
      this.game.startGame();
      this.clicked=false;
    }

    if(this.game.input.keys["Enter"] || this.game.input.keys["NumpadEnter"] || this.clicked){
      this.game.startGame();
      this.clicked=false;
  }
  }


  checkButton(x,y){
    return(
      x>this.startButton.x && x<this.startButton.x + this.startButton.width && 
      y>this.startButton.y && y<this.startButton.y + this.startButton.height
    );
  }

  render(context,camera){
    const width=context.canvas.width;
    const height=context.canvas.height;
    const centerX=width/2;
    const centerY=height/2;

    context.save();
    const t=Date.now()*0.15;
    context.strokeStyle="white";
    context.lineWidth=2;
    context.beginPath();
    context.moveTo(
      t%context.canvas.width, 60
    );
    context.lineTo(
      t%context.canvas.width-80,120
    );
    context.stroke();

    const gradient=context.createLinearGradient(
      0,0,0,height
    );
    gradient.addColorStop(0,"#020024");
    gradient.addColorStop(0.5,"#090979");
    gradient.addColorStop(1,"#000000");
    context.fillStyle=gradient;
    context.fillRect(0,0,
    width,height
    );
    const titleSize=Math.min(width*0.12,60);
    const float=Math.sin(Date.now()*0.003)*8;

    context.shadowColor="#00ffff";
    context.shadowBlur=20;
    context.fillStyle="#ffffff";
    context.font=`bold ${titleSize}px Arial`;
    context.textAlign="center";
    context.fillText(
      "MATHLAB SPACE", centerX,centerY-190+float
    );

    context.font="22px Arial";
    context.fillStyle="#bbbbbb";
    context.fillText(
      "Explore . Survive . Conquer",
      context.canvas.width/2, context.canvas.height*0.34
    );

    this.startButton.width=Math.min(width*0.65,300);
    this.startButton.height=70;
    this.startButton.x=centerX-this.startButton.width/2;
    this.startButton.y=centerY+20;
    let pulse=Math.sin(Date.now()/300)*8;

    context.shadowColor="#00ffff";
    context.shadowBlur=2+pulse;
    context.fillStyle="#112244";
    context.font="32px Arial";
    context.beginPath();
    context.roundRect(
      this.startButton.x,this.startButton.y,
      this.startButton.width,this.startButton.height,20
    );
    context.fill();
    context.textAlign="center";
    context.strokeStyle="#00ffff";
    context.lineWidth=3;
    context.stroke();

    context.fillStyle="white";
    context.font=`bold ${Math.min(width*0.07,32)}px Arial`;
    context.textAlign="center";

    context.fillText(
      "START GAME",
      centerX,this.startButton.y+45
    );

    context.font="20px Arial";
    context.fillText(
      "Have You Ever Travel Through Space ? Try Me!",
      context.canvas.width/2,
      context.canvas.height/2+130
    );

    context.font="20px Arial";
    context.fillStyle="#aaaaaa";
    context.fillText(
      "Press ENTER or TAP button",
      centerX, this.startButton.y+150
    );

    context.shadowBlur=0;
    context.font="18px Arial";
    context.fillStyle="#888";
    context.fillText(
      "Version 1.0",
      centerX,height-25
    );

    context.fillText(
      "Created By Nasir",
      centerX,
      height-50
    );

    context.restore();

  }

  }