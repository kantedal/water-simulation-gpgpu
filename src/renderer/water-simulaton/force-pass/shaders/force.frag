varying vec2 vUv;
varying vec3 vPosition;

uniform float delta;

void main() {
    vec3 force = vec3(0.0, -9.82, 0.0);
    gl_FragColor = vec4(force, 1.0);
}