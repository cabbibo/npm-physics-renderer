var glslify     = require( 'glslify'        );
var triangle    = require( 'a-big-triangle' );
var FBO         = require( 'gl-fbo'         );
var ndArray     = require( 'ndarray'        );

function PhysicsRenderer( gl , size , simulation ){

  this.gl           = gl;
  
  this.size         = size;
  this.s2           = size * size;
  this.simulation   = simulation;

  this.rt_1 = FBO( gl , [ this.size , this.size ], {
    float:true
  });

  this.rt_2 = FBO( gl , [ this.size , this.size ], {
    float:true
  });

  this.rt_3 = FBO( gl , [ this.size , this.size ], {
    float:true
  });

  this.counter = 0;

  this.texturePass = glslify({
    vert:'./shaders/vs-pass.glsl',
    frag:'./shaders/fs-pass.glsl',
  })(gl);

}

PhysicsRenderer.prototype.update = function(){

  var flipFlop = this.counter % 3;

  if( flipFlop === 0 ){

    this.simulation.bind();    
    this.simulation.uniforms.t_oPos = this.rt_1.color[0].bind(0);
    this.simulation.uniforms.t_pos  = this.rt_2.color[0].bind(1);

    this.pass( this.simulation, this.rt_3 );

    this.ooOutput = this.rt_1;
    this.oOutput = this.rt_2;
    this.output = this.rt_3;  

  }else if( flipFlop === 1 ){
   
    this.simulation.bind();    
    this.simulation.uniforms.t_oPos = this.rt_2.color[0].bind(0);
    this.simulation.uniforms.t_pos  = this.rt_3.color[0].bind(1);

    this.pass( this.simulation , this.rt_1 );

    this.ooOutput = this.rt_2;
    this.oOutput = this.rt_3;
    this.output = this.rt_1;

  }else if( flipFlop == 2 ){

    this.simulation.bind();
    this.simulation.uniforms.t_oPos = this.rt_3.color[0].bind(0);
    this.simulation.uniforms.t_pos  = this.rt_1.color[0].bind(1);

    this.pass( this.simulation , this.rt_2 );

    this.ooOutput = this.rt_3;
    this.oOutput = this.rt_1;
    this.output = this.rt_2;
      
  }

  this.counter ++;

}

PhysicsRenderer.prototype.pass = function( shader , output ){

  //shader already bound, so no need to bind again.
  output.bind();
  this.gl.viewport( 0 , 0 , this.size , this.size);
  triangle( this.gl );

}


PhysicsRenderer.prototype.reset = function( texture ){

  this.texturePass.bind();
  this.texturePass.uniforms.texture = texture.color[0].bind(0);

  this.pass( this.texturePass , this.rt_1 );
  this.pass( this.texturePass , this.rt_2 );
  this.pass( this.texturePass , this.rt_3 );


}


PhysicsRenderer.prototype.dataReset = function( nd ){

  this.rt_1.color[0].setPixels( nd );
  this.rt_2.color[0].setPixels( nd );
  this.rt_3.color[0].setPixels( nd );
  /*this.texturePass.bind();
  this.texturePass.uniforms.texture = texture.color[0].bind(0);

  this.pass( this.texturePass , this.rt_1 );
  this.pass( this.texturePass , this.rt_2 );
  this.pass( this.texturePass , this.rt_3 );*/


}

module.exports = PhysicsRenderer;
