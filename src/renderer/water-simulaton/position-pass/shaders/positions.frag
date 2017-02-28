varying vec2 vUv;
varying vec3 vPosition;

uniform float delta;
uniform sampler2D lastPositions;
uniform sampler2D velocities;

void main() {
    vec3 lastPosition = texture2D(lastPositions, vUv).xyz;
    vec3 velocity = texture2D(velocities, vUv).xyz;

    vec3 particlePosition = lastPosition + delta * velocity;
    gl_FragColor = vec4(particlePosition, 1.0);
}