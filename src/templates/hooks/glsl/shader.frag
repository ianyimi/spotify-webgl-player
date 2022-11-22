precision highp float;
out highp vec4 pc_fragColor;
uniform float active_scene;
uniform sampler2D diffuse;
uniform sampler2D past;
uniform sampler2D present;
uniform sampler2D future;
uniform float time;
in vec2 vUv;

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

void main() {
  vec2 c_uv = vUv * 2.0 - 1.0;
  vec2 o_uv = vUv * 0.8;
  float gradient = radial(c_uv, time*1.8);
  vec2 fuv = mix(vUv, o_uv, gradient);

  pc_fragColor = texture(diffuse, fuv);

  if (active_scene == 2.0) {
    vec4 scene_color = texture(future, fuv);
    pc_fragColor = texture(future, fuv);
    //    pc_fragColor.rgb = mix(pc_fragColor.rgb, scene_color.rgb, gradient);
  }
  //  pc_fragColor2 = texture(future_scene, fuv);
  //  pc_fragColor = texture(diffuse, fuv);
}
