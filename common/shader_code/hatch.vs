//笔触的顶点着色器
varying vec2 vUv;
void main(void) {
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	vUv = uv;
}