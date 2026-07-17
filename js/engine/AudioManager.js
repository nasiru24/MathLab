export class AudioManager{
  constructor(){
    this.sounds=new Map();
    this.masterVolume=1;
    this.sfxVolume=1;
    this.musicVolume=0.5;
  }

  load(name,path){
    const sound=new Audio(path);
    sound.preload="auto";
    this.sounds.set(name,sound);
  }

  play(name){
    const sound=this.sounds.get(name);
    if(!sound) return;
    sound.currentTime=0;
    sound.volume=this.sfxVolume*this.masterVolume;
    sound.play();
  }

  stop(name){
    const sound=this.sounds.get(name);
    if(!sound) return;
    sound.pause();
    sound.currentTime=0;
  }

  playMusic(name){
    const music=this.sounds.get(name);
    if(!music) return;
    music.loop=true;
    music.volume=this.musicVolume;
    music.play();
  }

  pauseAll(){
    this.sounds.forEach(sound=>{
      sound.pause();
    });
  }

  resumeAll(){
    this.sounds.forEach(sound=>{
      sound.play();
    });
  }
}