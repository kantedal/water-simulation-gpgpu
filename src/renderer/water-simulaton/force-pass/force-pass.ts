import PingPongFBO from "../../utils/fbo/ping-pong-fbo";
import {DELTA_TIME, PARTICLE_COUNT} from "../../renderer-settings";

/*
 Shader imports
 */
const forceFrag = require('raw-loader!glslify-loader!./shaders/force.frag');
const forceVert = require('raw-loader!glslify-loader!./shaders/force.vert');

export default class ForcePass {
  private _framebuffer: PingPongFBO;
  private _forceUniforms: any;

  constructor(private _renderer: THREE.WebGLRenderer) {

    this._forceUniforms = {
      delta: { type: 'f', value: DELTA_TIME }
    };

    let forceShader = new THREE.ShaderMaterial({
      uniforms: this._forceUniforms,
      vertexShader: forceVert,
      fragmentShader: forceFrag,
      blending: THREE.AdditiveBlending
    });
    forceShader.needsUpdate = true;

    this._framebuffer = new PingPongFBO(Math.sqrt(PARTICLE_COUNT), Math.sqrt(PARTICLE_COUNT), _renderer, forceShader);
  }

  public update() {
    this._framebuffer.render();
  }

  get forceTexture(): THREE.Texture { return this._framebuffer.texture }
}