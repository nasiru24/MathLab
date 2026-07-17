export class Menu{
  constructor(game){
    this.game=game;
  }

  
  update(){
    if(this.game.input.keys["Enter"] || this.game.input.keys["NumpadEnter"]){
      this.game.startGame();
      this.game.input.keys["Enter"] =false;

  }
  }
  render(context,camera){
    context.save();
    context.fillStyle="#000";
    context.fillRect(
      0,0,
      context.canvas.width,
      context.canvas.height
    );
    context.fillStyle="white";
    context.font="60px Arial";
    context.textAlign="center";
    context.fillText(
      "MATHLAB SPACE", context.canvas.width/2,
      context.canvas.height/2-100
    );
    context.font="30px Arial";
    context.fillText(
      "PRESS ENTER",
      context.canvas.width/2,
      context.canvas.height/2
    );

    context.font="20px Arial";
    context.fillText(
      "Have You Ever Travel Through Space ? Try Me!",
      context.canvas.width/2,
      context.canvas.height/2+70
    );
    context.restore();

  }

  }