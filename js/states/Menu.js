import { MenuStar } from "./MenuStar.js";
import { ShootingStar } from "./ShootingStar.js";
import { MenuShip } from "../entities/MenuShip.js";

export class Menu{
  constructor(game){
    this.game=game;
    this.canvas=game.canvas;
    this.stars=[];
    for(let i=0;i<120;i++){
      this.stars.push(new MenuStar(this.game));
    }
    this.shootingStar=[];
    for(let i=0;i<3;i++){
      this.shootingStar.push(
        new ShootingStar(game)
      );
    }
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
    this.backgroundOffset=0;
    this.buttonPulse=0;
    this.buttonScale=1;
    this.ship=new MenuShip(game);
    this.resize();

  }

  resize(){
    const width=this.game.canvas.width;
    const height=this.game.canvas.height;
    this.titleY=height*0.25;
    this.shipX=width/2;
    this.shipY=height*0.45;
    this.buttonY=height*0.72;
  }

  
  update(){
    for(const star of this.stars){
    star.update();
    this.backgroundOffset+=0.005;
    this.buttonPulse+=0.05;
  }
  this.buttonPulse+=0.05;
  this.buttonScale=1+Math.sin(this.buttonPulse)*0.03;
  for(const shooting of this.shootingStar){
    shooting.update();
  }

  this.ship.update();

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
    const isMobile=height>width || width<600;
    const titleY=isMobile
    ?height*0.18:height*0.22;
    const subtitleY=isMobile
    ?height*0.30:height*0.34;
    const buttonY=isMobile
    ?height*0.50:height*0.48;
    const footerY=isMobile
    ?height*0.90:height*0.92;
    const scale=Math.min(width/1200,height/800);
    this.ship.x=centerX;
    this.ship.y=buttonY-60;

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
      width/2,height/2,0,
      width/2,height/2,width
    );
    gradient.addColorStop(0,"#020024");
    gradient.addColorStop(0.5,"#090979");
    gradient.addColorStop(1,"#000010");
    context.fillStyle=gradient;
    context.fillRect(0,0,
    width,height
    );

    for(const star of this.stars){
      star.render(context);
    }

    for(const shooting of this.shootingStar){
      shooting.render(context);
    }

    this.ship.render(context);

    context.fillStyle="#024";
    context.beginPath();
    context.arc(
      width/2,height+200,
      300,0,Math.PI*2
    );
    context.fill();

    const titleSize=Math.min(width*0.09,60);
    const float=Math.sin(Date.now()*0.003)*8;

    context.shadowColor="#00ffff";
    context.shadowBlur=20;
    context.fillStyle="#ffffff";
    context.font=`bold ${titleSize}px Arial`;
    context.textAlign="center";
    context.fillText(
      "MATHLAB SPACE", centerX,titleY+float
    );

    context.font="22px Arial";
    context.fillStyle="#bbbbbb";
    context.fillText(
      "Explore . Survive . Conquer",
      centerX, subtitleY
    );
    context.fill();

    this.startButton.width=Math.min(width*0.7,320);
    this.startButton.height=Math.min(height*0.09,70);
    this.startButton.x=centerX-this.startButton.width/2;
    this.startButton.y=buttonY;
    let pulse=Math.sin(Date.now()/300)*8;

    context.translate(
      this.startButton.x,
      this.startButton.y
    );
    context.scale(
      this.buttonScale,this.buttonScale
    );
    context.translate(
      -this.startButton.x,
      -this.startButton.y
    );

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
    let buttonGlow=Math.sin(this.buttonPulse)*10+20;
    context.shadowBlur=buttonGlow;
    context.shadowColor="#00ffff";

    context.fillText(
      "START GAME",
      centerX,this.startButton.y+36
    );

    context.font="20px Arial";
    const instructionY=this.startButton.y+height*0.15;
    context.fillText(
      "Travel Through Space",
      centerX,instructionY
    );

    context.font="20px Arial";
    context.fillStyle="#aaaaaa";
    context.fillText(
      "ENTER or TAP",
      centerX, instructionY+height*0.06
    );

    const footerSize=Math.min(width*0.04,18);
    context.shadowBlur=0;
    context.font=`${footerSize}px Arial`;
    context.fillStyle="#888";
    context.fillText(
      "Version 1.0",
      centerX,height*0.86
    );

    context.fillText(
      "Created By Nasir",
      centerX,
      height*0.8
    );

    context.restore();

  }

  }