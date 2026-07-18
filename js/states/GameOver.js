export class GameOver{
  constructor(game){
    this.game=game;
    this.newGameButton={
      x:0,
      y:0,
      width:300,
      height:70
    };
    this.mouse={
      x:0,
      y:0
    }
    this.clicked=false;
    game.canvas.addEventListener("click",()=>{
      this.clicked=true;
    });
    game.canvas.addEventListener("touchstart",()=>{
      this.clicked=true;
    });
  }

  update(){
    let button=this.newGameButton;
    if(this.clicked && this.game.mouse.x>button.x && this.game.mouse.x<button.x + button.width &&
      this.game.mouse.y>button.y && this.game.mouse.y<button.y + button.height
    ){
      this.game.restart();
      this.clicked=false;

    }

    if(this.game.input.keys["Enter"] || this.game.input.keys["NumpadEnter"] || this.clicked){
      this.game.restart();
      this.clicked=false;
      this.game.input.keys["Enter"]=false;
  }

  }

  render(context){
    let width=context.canvas.width;
    let height=context.canvas.height;
    context.fillStyle="#000";
    context.fillRect(
      0,0,
      width,height
    );
    context.fillStyle="white";
    context.textAlign="center";
    context.font="60px Arial";
    context.fillText(
      "GAME OVER",
      width/2,height/2-100
    );
    this.newGameButton.width=Math.min(width*0.65,300);
    this.newGameButton.x=width/2-this.newGameButton.width/2;
    this.newGameButton.y=height/2;
    context.fillStyle="#112244";
    context.fillRect(
      this.newGameButton.x,this.newGameButton.y,
      this.newGameButton.width,this.newGameButton.height
    );
    context.strokeStyle="#00ffff";
    context.strokeRect(
      this.newGameButton.x,this.newGameButton.y,
      this.newGameButton.width,
      this.newGameButton.height
    );

    context.fillStyle="white";
    context.font="30px Arial";
    context.fillText(
      "NEW GAME",
      width/2,this.newGameButton.y+45
    );
    context.font="18px Arial";
    context.fillStyle="#aaa";
    context.fillText(
      "TAP or Press ENTER",
      width/2,this.newGameButton.y+100
    );

  }
}