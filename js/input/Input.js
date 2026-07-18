export class Input{
  constructor(){
  this.keys={};
  this.touch={
    up:false,
    left:false,
    right:false,
    fire:false
  };

window.addEventListener("keydown",(event)=>{
  this.keys[event.code]=true;
});

window.addEventListener("keyup",(event)=>{
  this.keys[event.code]=false;
});
  }
}