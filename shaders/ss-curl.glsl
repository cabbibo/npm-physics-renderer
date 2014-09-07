
precision mediump float;

uniform sampler2D t_oPos;
uniform sampler2D t_pos;

varying vec2 vUv;

#pragma glslify: curlNoise = require(glsl-curl-noise/curl.glsl) 

void main(){

  vec2 add = vec2(  (1. / 256.) ,  (1. / 256.) );
  vec4 oPos = texture2D( t_oPos , vUv + add );
  vec4 pos  = texture2D( t_pos  , vUv+ add  );

  float life = pos.w;


  vec3 vel = oPos.xyz - pos.xyz;

  vec3 curl = curlNoise( pos.xyz * .03 );
  vel += curl;

  vec3 p = pos.xyz;

  if( life > .9999 ){

    vel = vec3( 0. );

  }

  if( life < 0. ){

    p = vec3(
      sin( cos( vUv.x * 10000. ) * 1000. ) * 5.,
      cos( cos( vUv.y * 6000. ) * 400. ) * 5.,
      sin( cos( (vUv.x+vUv.y) * 400. ) * 10000. ) * 5.
    );

    vel = vec3( 0. );

    life = 1.;

  }



  life -= .001 *  (5. +(1. + sin( cos( vUv.x * 10000. + vUv.y * 100000. ) * 1000. ) * 5.));
  
  p += vel * .1;


  gl_FragColor = vec4( p , life );

}


