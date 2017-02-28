/*
 Shader imports
 */
const waterFrag = require('raw-loader!glslify-loader!./shaders/water.frag');
const waterVert = require('raw-loader!glslify-loader!./shaders/water.vert');

export default class WaterRenderer {
  private _waterParticles: THREE.Points;
  private _waterUniforms: any;

  constructor(
    private _renderer: THREE.WebGLRenderer,
    private _camera: THREE.Camera,
    private _scene: THREE.Scene
  ) {
    let width = 256;
    let height = 256;

    let l = width * height;
    let vertices = new Float32Array(l * 3);
    for (let i = 0; i < l; i++) {
      let i3 = i * 3;
      vertices[i3] = (i % width) / width;
      vertices[i3 + 1] = (i / width) / height;
    }

    let geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));

    let data = this.getRandomData( width, height, 16 );
    let positions = new THREE.DataTexture(
      data, width, height,
      THREE.RGBFormat, THREE.FloatType, THREE.UVMapping,
      THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping,
      THREE.NearestFilter, THREE.NearestFilter
    );
    positions.needsUpdate = true;

    this._waterUniforms = {
      particlePositions: { value: positions }
    };

    let waterShader = new THREE.ShaderMaterial({
      uniforms: this._waterUniforms,
      vertexShader: waterVert,
      fragmentShader: waterFrag,
      blending: THREE.AdditiveBlending
    });
    waterShader.needsUpdate = true;

    this._waterParticles = new THREE.Points(geometry, waterShader);
    this._scene.add(this._waterParticles);
  }

  getRandomData( width, height, size ){
    let len = width * height * 3;
    let data = new Float32Array( len );
    while( len-- )data[len] = ( Math.random() * 2 - 1 ) * size;
    return data;
  }


  public update(positions: THREE.DataTexture) {
    this._waterUniforms.particlePositions.value = positions;
  }
}