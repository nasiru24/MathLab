import { Nebula } from "../entities/Nebula.js";
import {Star} from "../entities/Star.js";
export class Universe {
  constructor(game){
    this.game=game;
    this.stars=[];
    this.starCount=250;
    this.nebulas=[];
    this.nebulaRadius=1800;
    this.nebulaCount=5;
    this.generate();
    this.generateAroundPlayer();
    this.generateNebulas();
  }


  generate(){
    for(let i=0;i<this.starCount;i++){
      const x=Math.random()*4000-2000;
      const y=Math.random()*4000-2000;
      const size=Math.random()*2+1;
      let depth=Math.random()*0.8+0.2;
      const star=new Star(x,y,size,depth);
      this.stars.push(star);
    }
  }

  generateAroundPlayer(){
    if(!this.game.ship){
      return;
    }
    const player=this.game.ship;
    let ship=this.game.ship;
    for(let i=0;i<100;i++){
      let angle=Math.random()*Math.PI*2;
      let distance=1500+Math.random()*2000;
      let x=ship.position.x+Math.cos(angle)*distance;
      let y=ship.position.y+Math.sin(angle)*distance;
      let size=Math.random()*2+1;
      let depth=Math.random()*0.8+0.2;
      let star=new Star(
        x,y,
        size,depth
      );
      this.stars.push(star);
    }
  }

  generateNebulas(){
    const colors=[
      "#5B6CFF", "#8A2BE2", "#00BCD4", "#FF5FCF"
    ];
    for(let i=0;i<this.nebulaCount;i++){
      this.nebulas.push(
        new Nebula(
          Math.random()*8000-4000,
          Math.random()*8000-4000,
          400+Math.random()*500,
          colors[
            Math.floor(Math.random()*colors.length)
          ], 0.05+Math.random()*0.1
        )
      );
    }
  }

  spawnNebula(){
    const angle=Math.random()*Math.PI*2;
    const distance=1200+Math.random()*600;
    const x=this.game.ship.position.x+Math.cos(angle)*distance;
    const y=this.game.ship.position.y+Math.sin(angle)*distance;
    const colors=["#5B6CFF","#8A2BE2","#00BCDA","#FF5FCF"];
    this.nebulas.push(
      new Nebula(
        x,y,
        250+Math.random()*300,
        colors[Math.floor(Math.random()*colors.length)],0.05+Math.random()*0.1
      )
    );
    this.nebulas=this.nebulas.filter(nebula=>{
      const dx=nebula.position.x-this.game.ship.position.x;
      const dy=nebula.position.y-this.game.ship.position.y;
      return Math.hypot(dx,dy)<5000;
    });
  }


  updateNebulas(){
    let nearby=0;
    for(const nebula of this.nebulas){
      const dx=nebula.position.x-this.game.ship.position.x;
      const dy=nebula.position.y-this.game.ship.position.y;
      const distance=Math.hypot(dx,dy);
      if(distance<this.nebulaRadius){
        nearby++;
      }
    }
      if(nearby<8 ){
        this.spawnNebula();
    }
  }


  update(){
  const camera=this.game.camera;
  for(const nebula of this.nebulas){
    nebula.update();
  }
  this.updateNebulas();
  for(const star of this.stars){
    const dx=star.position.x-camera.position.x;
    const dy=star.position.y-camera.position.y;
    const distance=Math.sqrt(dx*dx+dy*dy);
    if(distance>3000){
      const angle=Math.random()*Math.PI*2;
      const radius=1800+Math.random()*500;
      star.position.x=camera.position.x+Math.cos(angle)*radius;
      star.position.y=camera.position.y+Math.sin(angle)*radius;
    }
  }
  
}

render(context, camera){
  for(const nebula of this.nebulas){
  let dx=nebula.position.x-this.game.ship.position.x;
  let dy=nebula.position.y-this.game.ship.position.y;
    let distance=Math.sqrt(dx*dx+dy*dy);
    if(distance<2500){
    nebula.render(context,camera);
    }
  }
  for(const star of this.stars){
    star.render(context, camera);
  }
}
}