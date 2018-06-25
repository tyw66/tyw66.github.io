//基础的顶点着色器
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}