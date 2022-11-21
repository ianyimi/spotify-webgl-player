in vec2 uv;
in vec3 position;
precision highp float;

out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);

}
