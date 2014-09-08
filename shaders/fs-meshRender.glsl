precision mediump float;

uniform sampler2D t_sprite;

varying vec2 vUv;
varying vec3 vPos;
varying vec3 vOPos;
varying vec3 vVel;
varying vec3 vNorm;

varying float vLife;
varying float vTri;
varying float vEdge;



void main(){


  gl_FragColor = vec4( vec3( vEdge ) * abs( vNorm ), 1. );
}
