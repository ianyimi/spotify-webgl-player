#define fogNear 10.
#define fogFar 25.

uniform highp float time;
uniform sampler2D tex;
uniform sampler2D tex2;
uniform sampler2D backgroundImage;
uniform vec2 resolution;
uniform vec3 color;
uniform mediump float intensity;
uniform vec3 fogColor;

varying vec2 vUv;
precision mediump float;

float random(vec2 v) {
  return fract(sin(v.x * 32.1231 - v.y * 2.334 + 13399.2312) * 2412.32312);
}
float random(float x, float y) {
  return fract(sin(x * 32.1231 - y * 2.334 + 13399.2312) * 2412.32312);
}
float random(float x) {
  return fract(sin(x * 32.1231 + 13399.2312) * 2412.32312);
}

float character(float i) {
  return i<15.01? floor(random(i)*32768.) : 0.;
}

void main() {
  vec2 S = 5. * vec2(25., 50.);
  vec2 c = floor(vUv * S);

  float offset = random(c.x) * S.x;
  float speed = random(c.x * 3.) * .5 + 0.2;
  float len = random(c.x) * 15. + 100.;
  float u = 1. - fract(c.y / len + time * speed + offset) * 2.;

  float padding = 2.;
  vec2 smS = vec2(3., 5.);
  vec2 sm = floor(fract(vUv * S) * (smS + vec2(padding))) - vec2(padding);
  float symbol = character(floor(random(c + floor(time * speed)) * 15.));
  bool s = sm.x < 0. || sm.x > smS.x || sm.y < 0. || sm.y > smS.y ? false
  : mod(floor(symbol / pow(2., sm.x + sm.y * smS.x)), 2.) == 1.;

  vec3 curRGB = color;
  if (s)
  {
    if (u > 0.9)
    {
      curRGB.r = intensity/2. + 0.25;
      curRGB.g = intensity/2. + 0.25;
      curRGB.b = intensity/2. + 0.25;
    }
    else if (u > 0.)
    {
      curRGB = mix(fogColor, curRGB, u);
    }
    else
    curRGB = fogColor;
  }
  else
  curRGB = fogColor;

  gl_FragColor = vec4(curRGB.x, curRGB.y, curRGB.z, 1.0);
  gl_FragColor = texture2D(backgroundImage, vUv);

  // account for fog
  float depth = gl_FragCoord.z / gl_FragCoord.w;
  float fogFactor = smoothstep(fogNear, fogFar, depth);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);
}
