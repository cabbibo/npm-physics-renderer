precision mediump float;


uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform sampler2D t_pos;
uniform sampler2D t_oPos;

attribute vec2 uv;

varying vec2 vUv;
varying vec3 vPos;
varying vec3 vOPos;
varying vec3 vVel;

varying float vLife;

void main(){


  vUv = uv;

  vec4 p = texture2D( t_pos , uv );

  vPos  = p.xyz; 
  vOPos = texture2D( t_oPos , uv ).xyz; 

  vVel = vPos - vOPos;

  vLife = p.w;
  gl_PointSize = 5.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos , 1. ); 

}
