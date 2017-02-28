import PingPongFBO from "../../utils/fbo/ping-pong-fbo";
import {DELTA_TIME, PARTICLE_COUNT} from "../../renderer-settings";

/*
Shader imports
*/
const positionFrag = require('raw-loader!glslify-loader!./shaders/positions.frag');
const positionVert = require('raw-loader!glslify-loader!./shaders/positions.vert');

export default class PositionPass {
  private _framebuffer: PingPongFBO;
  private _positionsUniforms: any;

  constructor(private _renderer: THREE.WebGLRenderer) {

    this._positionsUniforms = {
      lastPositions: { value: this.generateStartPositions() },
      velocities: { value: null },
      delta: { type: 'f', value: DELTA_TIME }
    };

    let positionsShader = new THREE.ShaderMaterial({
      uniforms: this._positionsUniforms,
      vertexShader: positionVert,
      fragmentShader: positionFrag,
      blending: THREE.AdditiveBlending
    });
    positionsShader.needsUpdate = true;

    this._framebuffer = new PingPongFBO(Math.sqrt(PARTICLE_COUNT), Math.sqrt(PARTICLE_COUNT), _renderer, positionsShader);
  }

  private generateStartPositions(): THREE.DataTexture {
    let len = PARTICLE_COUNT * 3;
    let data = new Float32Array(len);
    while( len-- ) data[len] = (Math.random() * 2 - 1) * 3;

    let startPositions = new THREE.DataTexture(
      data, Math.sqrt(PARTICLE_COUNT), Math.sqrt(PARTICLE_COUNT),
      THREE.RGBFormat, THREE.FloatType, THREE.UVMapping,
      THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping,
      THREE.NearestFilter, THREE.NearestFilter
    );
    startPositions.needsUpdate = true;

    return startPositions;
  }

  public update(velocityTexture: THREE.Texture) {
    this._positionsUniforms.velocities.value = velocityTexture;
    this._framebuffer.render();
    this._positionsUniforms.lastPositions.value = this._framebuffer.texture;
  }

  get positionsTexture(): THREE.Texture { return this._framebuffer.texture }
}