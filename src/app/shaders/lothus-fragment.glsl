precision highp float;

uniform sampler2D tMap;
uniform sampler2D tMask;
uniform float uAlpha;
uniform vec2 uMouse;
uniform vec4 uResolution;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vec2 ratio = vec2(
    min((uResolution.x / uResolution.y) / (1920.0 / 1080.0), 1.0),
    min((uResolution.y / uResolution.x) / (1080.0 / 1920.0), 1.0)
  );

  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  float move = texture2D(tMask, uv).r;

  vec3 color = texture2D(tMap, uv + uMouse * move * 0.015).rgb;

  gl_FragColor = vec4(color, uAlpha);
}
