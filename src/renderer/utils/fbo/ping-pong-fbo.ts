
export default class PingPongFBO {
  private _renderer: THREE.WebGLRenderer;
  private _fboScene: THREE.Scene;
  private _orthographicCamera: THREE.OrthographicCamera;
  private _renderTargets: THREE.WebGLRenderTarget[];
  private _currentRenderTarget: number;

  constructor(width: number, height: number, renderer: THREE.WebGLRenderer, shader: THREE.ShaderMaterial, filtering?: any) {
    this._renderer = renderer;
    let gl: WebGLRenderingContext = this._renderer.getContext();

    if (!gl.getExtension('OES_texture_float')) {
      throw new Error('Float textures are not supported');
    }

    if (gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) == false) {
      throw new Error('Vertex shaders cannot read textures');
    }

    this._orthographicCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow( 2, 53 ), 1);

    this._renderTargets = [];

    this._renderTargets.push(new THREE.WebGLRenderTarget(width, height, {
      minFilter: filtering != null ? filtering : THREE.NearestFilter,
      magFilter: filtering != null ? filtering : THREE.NearestFilter,
      format: THREE.RGBFormat,
      type: THREE.FloatType,
    }));

    this._renderTargets.push(new THREE.WebGLRenderTarget(width, height, {
      minFilter: filtering != null ? filtering : THREE.NearestFilter,
      magFilter: filtering != null ? filtering : THREE.NearestFilter,
      format: THREE.RGBFormat,
      type: THREE.FloatType,
    }));

    this._currentRenderTarget = 0;

    this._fboScene = new THREE.Scene();
    let geometry = new THREE.PlaneGeometry( 2, 2, 2 );
    let plane = new THREE.Mesh( geometry, shader );
    this._fboScene.add( plane );
  }

  public render() {
    this._renderer.render(this._fboScene, this._orthographicCamera, this._renderTargets[this._currentRenderTarget]);
    this._currentRenderTarget = 1 - this._currentRenderTarget;
  }

  get texture(): THREE.Texture {
    return this._renderTargets[1 - this._currentRenderTarget].texture;
  }
}