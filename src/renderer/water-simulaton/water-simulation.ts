import WaterRenderer from "./water-renderer/water-renderer";
import PositionPass from "./position-pass/position-pass";
import VelocityPass from "./velocity-pass/velocity-pass";
import ForcePass from "./force-pass/force-pass";

export default class WaterSimulation {
  private _forcePass: ForcePass;
  private _velocityPass: VelocityPass;
  private _positionPass: PositionPass;
  private _renderPass: WaterRenderer;

  constructor(
    private _renderer: THREE.WebGLRenderer,
    private _camera: THREE.Camera,
    private _scene: THREE.Scene
  ) {
    this._forcePass = new ForcePass(_renderer);
    this._velocityPass = new VelocityPass(_renderer);
    this._positionPass = new PositionPass(_renderer);

    this._renderPass = new WaterRenderer(_renderer, _camera, _scene);
  }

  public update(time: number) {
    this._forcePass.update();
    this._velocityPass.update(this._forcePass.forceTexture);
    this._positionPass.update(this._velocityPass.velocityTexture);

    this._renderPass.update(this._positionPass.positionsTexture);
  }

}