export class Collision{
  static check(a,b){
    const dx=a.position.x-b.position.x;
    const dy=a.position.y-b.position.y;
    const distance=Math.sqrt(
      dx*dx+dy*dy
    );
    return distance<a.radius+b.radius;
  }
}