precision mediump float;

attribute vec2 position;

varying vec2 vUv;

void main(){

  vUv = (position + vec2( 1. , 1. ))/2.;//vec2(-1. , 1. );

  gl_Position = vec4( position.x , position.y , 0. , 1. );

}
