
var PR          = require( '../physics-renderer.js' );

var glslify     = require( 'glslify'                );

var triangle    = require( 'a-big-triangle'         );

var FBO         = require( 'gl-fbo'                 );
var Vao         = require( 'gl-vao'                 );
var Buffer      = require( 'gl-buffer'              );
var Texture     = require( 'gl-texture2d'           );

var create      = require( 'gl-mat4/create'         );
var perspective = require( 'gl-mat4/perspective'    );

var Camera      = require( 'canvas-orbit-camera'    );

var NDA         = require( 'ndarray'                );

var lilBub      = require( '../dataImg/lilBub.js' );

var physicsRenderer;
var renderer;
var gl;
var textureShow;
var triShow;
var particleShader;

var modelViewMatrix;
var projectionMatrix;
var camera;

var uvBuffer;
var vao;

var t_lilBub;

var size;

init();
animate();

function init(){

  renderer = document.createElement( "canvas" );

  var dpr = window.devicePixelRatio || 1;
  renderer.width  = window.innerWidth * dpr;
  renderer.height = window.innerHeight * dpr;
  renderer.style.width  = window.innerWidth + "px";
  renderer.style.height = window.innerHeight + "px";
  renderer.style.position = 'absolute';
  renderer.style.top  = '0px';
  renderer.style.left = '0px';
  renderer.style.background = "#000";

  document.body.appendChild( renderer );
  gl = renderer.getContext( 'webgl' );

  var simShader = glslify({
    vert:'../shaders/vs-pass.glsl',
    frag:'../shaders/ss-curl.glsl'
  })(gl);

  size = 128;

  physicsRenderer = new PR( gl , size , simShader );

  textureShow = glslify({
    vert:'../shaders/vs-pass.glsl',
    frag:'../shaders/fs-pass.glsl'
  })(gl);

  triShow = glslify({
    vert:'../shaders/vs-pass.glsl',
    frag:'../shaders/fs-tri.glsl'
  })(gl);


  particleShader = glslify({
    vert:'../shaders/vs-meshRender.glsl',
    frag:'../shaders/fs-meshRender.glsl'
  })(gl);


  var data = new Array( size * size * 4 );

  for( var i=0; i < data.length; i++ ){
    data[i] =( Math.random() - .5 ) * 10;
  }

  var ndData = NDA( data , [ size , size , 4 ] );

  startTexture = FBO( gl , [ size , size ] , {
    float:true
  });

  startTexture.color[0].setPixels( ndData );

  physicsRenderer.dataReset( ndData );

  modelViewMatrix   = create();
  projectionMatrix  = create();


  camera = Camera( renderer );

  var uvData = new Float32Array( size * size * 6 *2 *3 );

  var triData = new Float32Array( size * size * 6  * 3); 

  for(var i = 0; i < size; i++ ){
    for(var j = 0; j < size; j++ ){

      var index = ( i * size + j ) * 6 * 3;
    
      for( var k = 0; k < 6; k++ ){

        var nI = index + k *3 ;
        
        uvData[ nI * 2 + 0 ] = i / size;
        uvData[ nI * 2 + 1 ] = j / size;

        uvData[ nI * 2 + 2 ] = i / size;
        uvData[ nI * 2 + 3 ] = j / size;

        uvData[ nI * 2 + 4 ] = i / size;
        uvData[ nI * 2 + 5 ] = j / size;


        triData[ nI + 0 ] = -1; 
        triData[ nI + 1 ] = k % 6;//3 * k;
        triData[ nI + 2 ] = (k+1 ) % 6;//3 * k;


      }

    }
  }


  uvBuffer = Buffer( gl , uvData );
  triBuffer = Buffer( gl , triData );
  vao    = Vao( gl , [
    {
      buffer: uvBuffer,
      size:   2,
      type:   gl.FLOAT
    },
    {
      buffer: triBuffer,
      size:   1,
      type:   gl.FLOAT
    },

  ]);

  t_lilBub = Texture( gl , lilBub ); 
}

function animate(){

  gl.clearColor( 0 , 0, 0 , 0 )
  gl.clearDepth(true);
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
  
  
  //debugger;
  //
  perspective( 
    projectionMatrix , 
    Math.PI / 4,
    renderer.width / renderer.height,
    .01,
    1000
  );

  camera.view( modelViewMatrix );
  camera.tick();



  physicsRenderer.update();
  gl.bindFramebuffer( gl.FRAMEBUFFER , null );  
  gl.viewport( 0 , 0 , renderer.width  , renderer.height  );

  textureShow.bind();
  textureShow.uniforms.texture = physicsRenderer.rt_1.color[0].bind( 0 );


  
  //textureShow.uniforms.texture = startTexture.color[0].bind( 0 );

  //triangle( gl );

  particleShader.bind();
  particleShader.uniforms.modelViewMatrix = modelViewMatrix;
  particleShader.uniforms.projectionMatrix = projectionMatrix;
  particleShader.uniforms.t_sprite = t_lilBub.bind( 2 );
  particleShader.uniforms.t_pos   = physicsRenderer.output.color[0].bind( 0 );
  particleShader.uniforms.t_oPos  = physicsRenderer.oOutput.color[0].bind( 1 );

  //gl.enable( gl.BLEND );
  //gl.blendFunc( gl.SRC_ALPHA , gl.ONE );
  gl.enable( gl.DEPTH_TEST );
  vao.bind();
  vao.draw( gl.TRIANGLES , (size * size * 6 ) );
  gl.disable( gl.DEPTH_TEST );
  //gl.disable( gl.BLEND );
  




  requestAnimationFrame( animate );

}
