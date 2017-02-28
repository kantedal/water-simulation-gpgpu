varying vec2 vUv;
varying vec3 vPosition;

uniform float delta;
uniform sampler2D lastVelocities;
uniform sampler2D forces;

void main() {
    vec3 lastVelocity = texture2D(lastVelocities, vUv).xyz;
    vec3 acceleration = texture2D(forces, vUv).xyz;

    vec3 velocity = lastVelocity + delta * acceleration;
    gl_FragColor = vec4(velocity, 1.0);
}