precision highp float;
out highp vec4 pc_fragColor;
uniform float time;
uniform float distortion;
uniform float active_scene;
uniform float uCircleScale;
uniform float screenAspect;
uniform sampler2D diffuse;
uniform sampler2D past;
uniform sampler2D present;
uniform sampler2D future;
in vec2 vUv;

// FBM NOISE - src: https://www.shadertoy.com/view/WslcR2 - "inspired by https://iquilezles.org/articles/warp/warp.htm"

#define M_PI 3.14159265358979323846

float random(vec2 p)
{
  float x = dot(p, vec2(4371.321, -9137.327));
  return 2.0 * fract(sin(x)*17381.94472) - 1.0;
}

float noise(in vec2 p)
{
  vec2 id = floor(p);
  vec2 f = fract(p);

  vec2 u = f*f*(3.0-2.0*f);

  return mix(mix(random(id + vec2(0.0, 0.0)),
  random(id + vec2(1.0, 0.0)), u.x),
  mix(random(id + vec2(0.0, 1.0)),
  random(id + vec2(1.0, 1.0)), u.x),
  u.y);
}

float fbm(vec2 p)
{
  float f = 0.0;
  float gat = 0.0;

  for (float octave = 0.; octave < 5.; ++octave)
  {
    float la = pow(2.0, octave);
    float ga = pow(0.5, octave + 1.);
    f += ga*noise(la * p);
    gat += ga;
  }

  f = f/gat;

  return f;
}

float noise_fbm(vec2 p)
{
  float h = fbm(0.05*time + p + fbm(0.065*time + 2.0 * p - 5.0 * fbm(0.02 * p)));
  return h;
}

// END FBM NOISE

// based on https://www.shadertoy.com/view/llGXzR
float radial(vec2 pos, float radius)
{
  float result = length(pos)-radius;
  result = fract(result*1.0);
  float result2 = 1.0 - result;
  float fresult = result * result2;
  fresult = pow((fresult*3.), 7.);
  return fresult;
}

float circle(vec2 uv, float radius, float sharp) {
  vec2 tempUV = uv - vec2(0.5);

  return smoothstep(
  radius - radius * sharp,
  radius + radius * sharp,
  dot(tempUV, tempUV)*4.0
  );
}

void main() {
  vec2 c_uv = vUv * 2.0 - 1.0;
  vec2 o_uv = vUv * 0.8;
  float gradient = radial(c_uv, time*1.8);
  vec2 fuv = mix(vUv, o_uv, gradient);

  vec2 centerVec = vUv - vec2(0.5);

  vec2 newUV = vUv;
  vec2 circleUV = (vUv - vec2(0.5))*vec2(screenAspect, 1.) + vec2(0.5);

  // keep constant sharpness for complete scene immersion
  float circleProgress = circle(circleUV, uCircleScale, 0.03);

  // ripples

  vec2 noiseUV = vUv - vec2(0.5);
  vec2 rv = noiseUV/(length(noiseUV*10.)*noiseUV*20.);

  float swirl = 10. * noise_fbm(vec2(length(noiseUV) - time*0.5 + rv));

  vec2 swirlDistort = noise_fbm(noiseUV*swirl)*centerVec*10.;

  // end ripples

  vec4 futureScene = texture(future, newUV);
  vec4 presentScene = texture(diffuse, vUv);

  pc_fragColor = presentScene;

  if (active_scene == 2.0) {

    vec2 backgroundUV = newUV + 0.03*distortion*swirlDistort;
    futureScene = texture(future, newUV);
    presentScene = texture(diffuse, backgroundUV);

    vec4 final = mix(futureScene, presentScene, circleProgress);
    pc_fragColor = vec4(centerVec, 0., 1.);
    pc_fragColor = vec4(swirlDistort, 0., 1.);
    pc_fragColor = final;

  }

}
