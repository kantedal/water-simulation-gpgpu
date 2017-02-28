import {Injectable, ElementRef} from "@angular/core";
import WaterSimulation from "./water-simulaton/water-simulation";
import SphereGeometry = THREE.SphereGeometry;
const Stats = require('stats-js');

/*
 Shader imports
 */
// const composerFrag = require('raw-loader!glslify-loader!./shaders/composer.frag');
// const composerVert = require('raw-loader!glslify-loader!./shaders/composer.vert');

@Injectable()
export class RenderService {
  private _renderer: THREE.WebGLRenderer;
  private _scene: THREE.Scene;
  private _camera: THREE.Camera;
  private _stats: any;
  private _controls: THREE.OrbitControls;
  private _waterSimulation: WaterSimulation;

  constructor() {
    this._scene = new THREE.Scene();

    this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this._camera.position.z = -25;
    this._camera.lookAt(new THREE.Vector3(0,0,0));

    this._stats = new Stats();
    this._stats.setMode(0);
    this._stats.domElement.style.position = 'absolute';
    this._stats.domElement.style.left = '0px';
    this._stats.domElement.style.top = '0px';
    document.body.appendChild(this._stats.domElement);

    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setSize(window.innerWidth, window.innerHeight);

    this._waterSimulation = new WaterSimulation(this._renderer, this._camera, this._scene);

    let sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
  }

  private time = 0.0;
  private render = () => {
    this._stats.begin();
    requestAnimationFrame( this.render );

    this._waterSimulation.update(0.0);
    this._renderer.render(this._scene, this._camera);

    this.time += 0.01;
    this._stats.end();
  };

  public initRenderer(domElement: ElementRef) {
    domElement.nativeElement.appendChild(this._renderer.domElement);
    this._controls = new THREE.OrbitControls(this._camera, this._renderer.domElement);
    this.render();
  }
}