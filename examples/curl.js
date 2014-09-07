
var PR          = require( '../physics-renderer.js' );

var glslify     = require( 'glslify'                );

var triangle    = require( 'a-big-triangle'         );

var FBO         = require( 'gl-fbo'                 );
var Vao         = require( 'gl-vao'                 );
var Buffer      = require( 'gl-buffer'              );

var create      = require( 'gl-mat4/create'         );
var perspective = require( 'gl-mat4/perspective'    );

var Camera      = require( 'canvas-orbit-camera'    );

var NDA         = require( 'ndarray'                );

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

var size;

init();
animate();

function init(){

  renderer = document.createElement( "canvas" );

  renderer.width  = window.innerWidth * 2;
  renderer.height = window.innerHeight* 2;
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

  size = 256;

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
    vert:'../shaders/vs-render.glsl',
    frag:'../shaders/fs-render.glsl',
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

  var uvData = new Float32Array( size * size *2  );

  for(var i = 0; i < size; i++ ){
    for(var j = 0; j < size; j++ ){

      var index = ( i * size + j ) * 2;
    
      uvData[ index + 0 ] = i / size;
      uvData[ index + 1 ] = j / size;

    }
  }

  var vaoA

  uvBuffer = Buffer( gl , uvData );
  vao    = Vao( gl , [
    {
      buffer: uvBuffer,
      size:   2,
      type:   gl.FLOAT
    }
  ]);

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
  particleShader.uniforms.t_pos = physicsRenderer.output.color[0].bind( 0 );
  particleShader.uniforms.t_oPos = physicsRenderer.oOutput.color[0].bind( 1 );

  gl.enable( gl.DEPTH_TEST );
  vao.bind();
  vao.draw( gl.POINTS , (size * size ) );
  gl.disable( gl.DEPTH_TEST );
  




  requestAnimationFrame( animate );

}

