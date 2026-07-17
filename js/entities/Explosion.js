import { ExplosionParticle } from "./ExplosionParticle.js";
import { RockFragment } from "./RockFragment.js";

export class Explosion{
  constructor(x,y,game,size=1){
    this.game=game;
    this.position={
      x:x,
      y:y
    };
    this.life=20;
    this.destroyed=false;
    this.particles=[];
    
   for(let i=0;i<15;i++){
      const particle=new ExplosionParticle(x,y);
      particle.radius=6;
      particle.color="white";
      this.game.add(particle);
    } 

    for(let i=0;i<5*size;i++){
      this.game.add(new RockFragment(x,y));
    }

  }

  update(){
    this.life--;
      if(this.life<=0){
        this.destroyed=true;
      }
    }

  

  render(context,camera){
    for(const particle of this.particles){
      particle.render(context,camera);
    }
  } 
}
