export const Input={
  keys:{}
};

window.addEventListener("keydown",(event)=>{
  Input.keys[event.code]=true;
});

window.addEventListener("keyup",(event)=>{
  Input.keys[event.code]=false;
});

