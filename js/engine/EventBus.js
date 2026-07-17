export class EventBus{
  constructor(){
    this.events={};
  }

  on(eventName, callback){
    if(!this.events[eventName]){
      this.events[eventName]=[];
    }
    this.events[eventName].push(callback);
  }

  emit(eventName){
    const listeners=this.events[eventName];
    if(!listeners) return;
    for(const listener of listeners){
      listener(data);
    }
  }
}