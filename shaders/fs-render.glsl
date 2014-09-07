precision mediump float;

varying vec2 vUv;
varying vec3 vPos;
varying vec3 vOPos;
varying vec3 vVel;

varying float vLife;



void main(){

  vec3 c = vec3( 1. );
  gl_FragColor = vec4( 1. , 0. , vLife , 1. );

}
