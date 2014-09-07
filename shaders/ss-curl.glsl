#pragma glslify: curlNoise = require( 'glsl-curl-noise/curl.glsl' ) 

uniform sampler2D t_oPos;
uniform sampler2D t_pos;
varying vec2 vUv;

void main(){

  vec4 oPos = texture2D( t_oPos , vUv );
  vec4 pos  = texture2D( t_pos , vUv );

  float life = pos.w;
  life -= .1;

  vec3 vel = oPos.xyz - pos.xyz;

  vec3 curl = curlNoise( pos.xyz * .02 );
  vel += curl;

  vec3 p = pos.xyz + vel * .1; 

  gl_FragColor = vec4( p , life );

}


