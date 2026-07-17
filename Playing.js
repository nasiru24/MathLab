export class Playing{
  constructor(game){
    this.game=game;
  }

  update(){
    this.game.camera.update();
    }
  

  render(context){
    for(let object of this.game.objects){
      object.render(context, this.game.camera);
    }
  }
}