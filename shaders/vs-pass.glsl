attribute vec2 position;

varying vec2 vUv;

void main(){

  vUv = position;
  gl_Position = vec4( position , 0. , 1. );

}
