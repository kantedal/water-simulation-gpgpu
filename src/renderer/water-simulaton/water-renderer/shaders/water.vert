uniform sampler2D particlePositions;

void main() {
    vec3 particlePosition = texture2D( particlePositions, position.xy).xyz;

    vec4 mvPosition = modelViewMatrix * vec4( particlePosition, 1.0 );
    gl_PointSize = 1.0;
    gl_Position = projectionMatrix * mvPosition;
}