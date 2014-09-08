precision mediump float;


uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform sampler2D t_pos;
uniform sampler2D t_oPos;

attribute vec2 uv;
attribute float tri;

varying vec2 vUv;
varying vec3 vPos;
varying vec3 vOPos;
varying vec3 vVel;
varying vec3 vNorm;

varying float vLife;
varying float vTri;
varying float vEdge;


void main(){


  vUv = uv;

  vec4 p = texture2D( t_pos , uv );
  vOPos = texture2D( t_oPos , uv ).xyz; 
  vVel = vPos - vOPos;


  float rad = 3.14 * 2. * (tri+1.) / 6.;
  float x = 1. * sin( rad );
  float y = 1. * cos( rad );

  if( tri == -1. ){
    vPos  = p.xyz;
    vEdge = 0.;
    vNorm = normalize( vVel );
    
  }else{
    
    
    vPos  = vOPos.xyz  + vec3( x , y , 0. ); 
    vEdge = 1.;

    vNorm = normalize( vVel );
    vec3  upVector = vec3( 0. , 1. , 0. );
    float upVectorProj = dot( upVector , vNorm );
    vec3  upVectorPara = upVectorProj * vNorm;
    vec3  upVectorPerp = upVector - upVectorPara;

    vec3 basisX = normalize( upVectorPerp );
    vec3 basisY = cross( vNorm , basisX );


    float theta = ( tri / 6. ) * 2. * 3.14159;

    float x = cos( theta );
    float y = sin( theta );

    float radius = .1;
    vPos = vOPos.xyz + radius * x * basisX  + radius * y * basisY;
    //pos += radius * aPow * x * basisX + radius * aPow * y * basisY;
  }

  vTri = tri;
  vOPos = texture2D( t_oPos , uv ).xyz; 


  vLife =  p.w;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos , 1. ); 

}
