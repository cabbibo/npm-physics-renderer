precision mediump float;

uniform sampler2D t_sprite;

varying vec2 vUv;
varying vec3 vPos;
varying vec3 vOPos;
varying vec3 vVel;

varying float vLife;



void main(){

  vec4 s = texture2D( t_sprite , vec2( gl_PointCoord.y , gl_PointCoord.x) );

  if( s.w < .1 ){

    discard;

  }

  vec3 c = vec3( 0. );
  float match = 0.;

  float m   =  max( 0. , dot(normalize( vVel) , vec3( 1. , 0. , 0. ) ) );
  vec3 s1 = vec3( .4 , .6 , .9 ) * pow( m , 30. );
  c+= s1;
  match += m;


  m   =  max( 0. , dot(normalize( vVel) , vec3( 0. , 1. , 0. ) ) );
  s1 = vec3( 1.4 , .6 , .4 ) * pow( m , 30. );
  c+= s1;
  match += m;


  m   =  max( 0. , dot(normalize( vVel) , vec3( 0. , 0. , 1. ) ) );
  s1 = vec3( .4 , 1.6 , .9 ) * pow( m , 30.);
  c+= s1;
  match += m;


  m   =  max( 0. , dot(normalize( vVel) , vec3( 0. , 0. , -1. ) ) );
  s1 = vec3( 1.4 , 1.6 , .9 ) * pow( m , 30.);
  c+= s1;
  match += m;


  m   =  max( 0. , dot(normalize( vVel) , vec3( 0. , -1. , 0. ) ) );
  s1 = vec3( 1.4 , .4, .9 ) * pow( m , 30.);
  c+= s1;
  match += m;


  m   =  max( 0. , dot(normalize( vVel) , vec3( -1. , 0. , 0. ) ) );
  s1 = vec3( .4 , .4, 2.9 ) * pow( m , 30.);
  c+= s1;
  match += m;


  m   =  max( 0. , dot(normalize( vVel) , normalize( vec3( -1. , 1. , 0. ) )) );
  s1 = vec3( .4 , .5, 2.9 ) * pow( m , 30. );
  c+= s1;
  match += m;

  m   =  max( 0. , dot(normalize( vVel) , normalize( vec3( 1. , 1. , 0. ) )) );
  s1 = vec3( 1. , .5, .3 ) * pow( m , 30. );
  c+= s1;
  match += m;

m   =  max( 0. , dot(normalize( vVel) , normalize( vec3( 1. , -1. , 0. ) )) );
  s1 = vec3( 1. , 2.5, 3.3 ) * pow( m , 30. );
  c+= s1;
  match += m;

  m   =  max( 0. , dot(normalize( vVel) , normalize( vec3( -1. , -1. , 0. ) )) );
  s1 = vec3( .1 , 1.5, .3 ) * pow( m , 30. );
  c+= s1;
  match += m;

   m   =  max( 0. , dot(normalize( vVel) , normalize( vec3( -1. , -1. , 1. ) )) );
  s1 = vec3( 3.1 , 1.5, .3 ) * pow( m , 30. );
  c+= s1;
  match += m;



  vec3 lifeCol = vec3( 1. ) * (1. - vLife) * ( 1. - vLife );
  if( vLife > 1. ){

    c *= 0.;
    lifeCol *= 0.;

  }

  gl_FragColor = (s *  (5. - match )+ vec4( c , 1. )) * vec4( lifeCol , 1. ); //* vec4( 1. , 0. , vLife , 1. );


}
