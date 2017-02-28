import PingPongFBO from "../../utils/fbo/ping-pong-fbo";
import {DELTA_TIME, PARTICLE_COUNT} from "../../renderer-settings";

/*
 Shader imports
 */
const velocityFrag = require('raw-loader!glslify-loader!./shaders/velocity.frag');
const velocityVert = require('raw-loader!glslify-loader!./shaders/velocity.vert');

export default class VelocityPass {
  private _framebuffer: PingPongFBO;
  private _velocityUniforms: any;

  constructor(private _renderer: THREE.WebGLRenderer) {

    this._velocityUniforms = {
      lastVelocities: { value: this.generateStartVelocities() },
      forces: { value: null },
      delta: { type: 'f', value: DELTA_TIME }
    };

    let velocityShader = new THREE.ShaderMaterial({
      uniforms: this._velocityUniforms,
      vertexShader: velocityVert,
      fragmentShader: velocityFrag,
      blending: THREE.AdditiveBlending
    });
    velocityShader.needsUpdate = true;

    this._framebuffer = new PingPongFBO(Math.sqrt(PARTICLE_COUNT), Math.sqrt(PARTICLE_COUNT), _renderer, velocityShader);
  }

  private generateStartVelocities(): THREE.DataTexture {
    let len = PARTICLE_COUNT * 3;
    let data = new Float32Array(len);
    while( len-- ) data[len] = (Math.random() * 2 - 1) * 15;

    let startVelocities = new THREE.DataTexture(
      data, Math.sqrt(PARTICLE_COUNT), Math.sqrt(PARTICLE_COUNT),
      THREE.RGBFormat, THREE.FloatType, THREE.UVMapping,
      THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping,
      THREE.NearestFilter, THREE.NearestFilter
    );
    startVelocities.needsUpdate = true;

    return startVelocities;
  }

  public update(forceTexture: THREE.Texture) {
    this._velocityUniforms.forces.value = forceTexture;
    this._framebuffer.render();
    this._velocityUniforms.lastVelocities.value = this._framebuffer.texture;
  }

  get velocityTexture(): THREE.Texture { return this._framebuffer.texture }
}